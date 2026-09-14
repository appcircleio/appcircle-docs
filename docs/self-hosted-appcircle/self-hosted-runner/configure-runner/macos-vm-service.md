---
title: Running macOS VM Runners as a Service
description: Install your Tart macOS VM runners as a launchd service so they survive an SSH logout and start automatically after a host reboot.
tags:
  [
    self-hosted runner,
    macos,
    tart,
    launchd,
    service,
    auto-start,
    keychain,
    auto-login,
  ]
sidebar_position: 7
---

# Running macOS VM Runners as a Service

On a macOS host, runners are started with `run.sh`, which keeps a Tart VM running in a loop: clone the base image, run the clone until the build finishes, delete the clone, repeat.

Starting that script from an SSH session with `screen` works, but it leaves two gaps:

- When the SSH session that started it is closed, the runner loses the security context Tart needs and fails with `VZErrorDomain Code=-9`.
- When the host reboots, nothing starts the runners again. Someone has to connect over SSH and start them by hand.

Installing `run.sh` as a **launchd service** closes both. launchd owns the process, so it belongs to no login session, and it starts at boot.

:::info

This page is about the **Tart macOS VM runners**. It is not the same as [Service Configuration](/self-hosted-appcircle/self-hosted-runner/configure-runner/runner-service), which covers running the Appcircle runner process itself as a launchd or systemd service on Linux and on bare-metal macOS.

:::

## Requirements

- A macOS host set up as described in [Self-hosted Runner as MacOS VM Image](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup), with at least one base VM and one runner folder such as `$HOME/runner1`.
- `run.sh` version 1.7.0 or newer in that runner folder. Older versions do not wait for Tart and the network to become usable at boot, so they exit instead of starting the VM.
- Administrator access on the host, since the service is installed in launchd's system domain.

## Install the service

Download `runner-service.sh` into the runner folder and make it executable:

```bash
curl -fsSL -o $HOME/runner1/runner-service.sh https://cdn.appcircle.io/self-hosted/runner-service.sh && \
  chmod +x $HOME/runner1/runner-service.sh
```

Install the service, passing the base VM the runner should clone:

```bash
cd $HOME/runner1 && sudo ./runner-service.sh install vm01
```

The service label is derived from the runner folder name, so `$HOME/runner1` becomes `io.appcircle.runner1`. Several runners on one host get independent services; repeat the steps in `$HOME/runner2` with `vm02`.

The runner starts immediately, restarts if it exits unexpectedly, and starts again on every host reboot.

## Prepare the host for unattended start

launchd starts the service without anyone being logged in. On macOS 15 and newer that is not enough on its own.

Tart cannot read the Virtualization.framework HostKey unless the runner account's login keychain exists and is unlocked. Without it the VM never starts and the runner log shows:

```txt
Error Domain=VZErrorDomain Code=-9 "The virtual machine encountered a security error."
... Failed to get current HostKey / Failed to create new HostKey ...
```

A desktop login normally performs that unlock. There are two supported ways to get it done, and you only need one.

### Option 1: let the service unlock the keychain (recommended)

`run.sh` can perform the unlock itself, so no desktop session and no automatic login are needed.

Store the keychain password in a file that only the runner account can read:

```bash
mkdir -p ~/.appcircle && chmod 700 ~/.appcircle
printf '%s' '<keychain-password>' > ~/.appcircle/runner-keychain.pw
chmod 600 ~/.appcircle/runner-keychain.pw
```

At startup `run.sh` reads that file, unlocks `~/Library/Keychains/login.keychain-db`, and disables the keychain's auto-lock so it does not re-lock between builds. If the file is absent the step is skipped, which is the correct behaviour on macOS 13.

Optionally, give the keychain its own password first so the stored secret cannot be used to log in to the host at all:

```bash
NEW=$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 40)
security set-keychain-password -o '<current-account-password>' -p "$NEW" \
  ~/Library/Keychains/login.keychain-db
printf '%s' "$NEW" > ~/.appcircle/runner-keychain.pw
```

After this the keychain password no longer matches the account password. That is harmless on a headless runner, but if you later log in at the desktop, macOS will ask you about the mismatch.

### Option 2: enable automatic login

Automatic login creates a desktop session at boot, which unlocks the keychain as a side effect:

```bash
sudo sysadminctl -autologin set -userName <runner-account> -password '<password>'
sudo sysadminctl -autologin status
```

This stores the account password on disk in `/etc/kcpassword`, so anyone who reaches the host can log in as the runner account. Option 1 is preferred where your security policy allows a choice, because the stored secret unlocks only a keychain rather than granting an interactive session.

:::caution

**FileVault must be off for either option to work.** With FileVault on, the host stops at the pre-boot authentication screen after a reboot and never reaches launchd, so no service starts and no session is created. Neither the keychain unlock nor automatic login can help, because neither runs before that screen.

:::

:::caution

**A password rotation policy will break both options.** Both depend on a stored credential. When an MDM profile or a directory policy forces the account password to change, the stored value goes stale and the runner stops coming back after a reboot, typically weeks after a working install. Exempt the runner account from rotation, or use Option 1 with a keychain password decoupled from the account password so only the account password rotates.

:::

:::caution

If you choose Option 2, keep **"Require password after sleep or screen saver begins"** enabled. Automatic login leaves a logged-in desktop on the host, and without a screen lock anyone with physical access has it.

:::

:::info

Neither option is needed on macOS 13, where the service starts Tart with no session at all. macOS 14 and 15 have not been verified. The behaviour described here was measured on macOS 26.6.2.

:::

## Verify

Check the service and the VM:

```bash
cd $HOME/runner1 && ./runner-service.sh status
cd $HOME/runner1 && ./runner-service.sh logs
```

For a full check of the host, download the readiness script. It is read-only and reports PASS, WARN or FAIL per item, covering sizing, power settings, the keychain, automatic login, FileVault, egress reachability, Tart images and runner supervision:

```bash
curl -fsSL -O https://cdn.appcircle.io/self-hosted/check-runner-host.sh && \
  chmod +x check-runner-host.sh && \
  sudo ./check-runner-host.sh
```

The real test is a reboot. Restart the host, do **not** log in over SSH or at the desktop, and confirm the runner comes back online in the self-hosted runners list on its own. If you used Option 1, `service-stdout.log` in the runner folder should contain:

```txt
Keychain unlocked with no auto-lock: /Users/<runner-account>/Library/Keychains/login.keychain-db
```

## Stop and start

A stop waits for the build in progress to finish, up to 30 minutes:

```bash
cd $HOME/runner1 && sudo ./runner-service.sh stop
```

An idle runner does not exit on its own, because its VM only powers off at the end of a build. Use `--now` to stop immediately, which kills a build in progress:

```bash
cd $HOME/runner1 && sudo ./runner-service.sh stop --now
```

Both forms delete the leftover VM clone. A stopped service starts again on the next host reboot; add `--disable` to keep it down until you explicitly start it:

```bash
cd $HOME/runner1 && sudo ./runner-service.sh stop --now --disable
cd $HOME/runner1 && sudo ./runner-service.sh start
```

To remove the service entirely so it no longer starts at boot:

```bash
cd $HOME/runner1 && sudo ./runner-service.sh uninstall
```

:::info

Under the service, creating a `.stop` file on its own is no longer a complete stop, because `run.sh` clears that file when it starts. Use `runner-service.sh stop`.

:::

## Troubleshooting

### The runner does not come back after a reboot

Check the service first:

```bash
cd $HOME/runner1 && ./runner-service.sh status
```

If the service is not loaded, it may have been disabled by an earlier `stop --disable`. Start it again with `sudo ./runner-service.sh start`.

If the service is running but the VM is not, read `service-stdout.log` and `stderr.log` in the runner folder.

### `VZErrorDomain Code=-9` in the logs

Tart cannot reach the HostKey. Check the keychain:

```bash
security show-keychain-info ~/Library/Keychains/login.keychain-db
```

`no-timeout` is what Tart needs. Anything else, including `locked`, means the unlock did not happen. Confirm that `~/.appcircle/runner-keychain.pw` exists, holds the correct password and is mode 600, or that automatic login is enabled and `/etc/kcpassword` is present.

If this appears weeks after a working install, the account password was most likely rotated. See the password rotation warning above.

### The runner works until the host sleeps

Check the power settings in [Configure Power Settings](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup#4-configure-power-settings). A sleeping host stops the VM, and on wake the keychain may be locked again if auto-lock was not disabled.
