---
title: Troubleshooting & FAQ for Appcircle Runner
description: Troubleshooting and FAQ for Appcircle runner
tags: [troubleshooting, faq, self-hosted]
sidebar_position: 60
sidebar_label: Troubleshooting & FAQ
---


## Appcircle Runner FAQ

### We are facing a self-signed certificate error on builds.

The certificate of your organization should be trusted on the Appcircle runner virtual machines.

You should refer to the [Custom Certificates](/self-hosted-appcircle/self-hosted-runner/configure-runner/custom-certificates) page for more details.

### We are facing an "SSL certificate is not valid yet" error on builds.

The runner VMs cannot connect to the servers to update their date and time due to network restrictions.

You should configure NTP server settings in the runner VMs. For updating base runners, please refer to the [Update Base Images](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup#update-base-images) section.

For details on configuring NTP settings, you can refer to the [NTP Configuration](/self-hosted-appcircle/self-hosted-runner/runner-vm-setup#2-configure-base-runners-ntp-settings) section and follow the steps.

### We are facing a "connection timeout" / "connection reset" / "403 forbidden" error on builds.

Especially if you're using external sources as dependencies that require access to certain URLs, you may encounter connection issues due to network restrictions.

To verify whether your Appcircle runner can access the URL, you can run the command below and check the output. Make sure to replace the example RubyGems URL below with the URL you faced network problems with while running the build.

```bash
curl -v https://rubygems.org
```

If you receive an "operation timed out", "connection timeout", "connection reset", or "403 forbidden" error, it indicates that the Appcircle runner is unable to access the URL due to network restrictions. In that case, you'll need to allow Appcircle runners to access the URL. 

You can find the list of commonly required URLs for Appcircle runners [here](/self-hosted-appcircle/install-server/linux-package/configure-server/integrations-and-access/network-access#appcircle-runner-runtime). Please note that the specific URL the Appcircle runner is unable to access may not be included in this list.

### We can't register Appcircle runner to the server.

First, you should check if your Appcircle runner can access the Appcircle server. You can run the command below to test this. You should change the example Appcircle URL for yourself.

```bash
curl -v https://api.appcircle.spacetech.com
```

You should check if there is a self-signed certificate problem. You can refer to the [Custom Certificates](/self-hosted-appcircle/self-hosted-runner/configure-runner/custom-certificates) page to trust the root CA certificate of your organization.

If the Appcircle server's certificate is valid for more than 825 days, macOS does not accept it even when the root CA is trusted. Run `install_cert.sh` with the server's URL: it trusts such a certificate as well.

### The runner VM does not start over SSH after the host was restarted.

After a restart, the login keychain of the host user stays locked until someone logs in to the macOS desktop. Tart needs it to start a VM, so `tart run` fails. When the runner was started with `screen`, the error is not shown and the VM never starts.

Check the keychain over SSH:

```bash
security show-keychain-info ~/Library/Keychains/login.keychain-db
```

If it prints `User interaction is not allowed`, the keychain is locked. Unlock it with the host user's password, then start the runners again:

```bash
security unlock-keychain ~/Library/Keychains/login.keychain-db
```

To have the runners start on their own after a restart, run them as a service. See [Running macOS VM Runners as a Service](/self-hosted-appcircle/self-hosted-runner/configure-runner/macos-vm-service).

### We are facing "LoginName too long" error while running the `screen` command.

The `screen` command has a bug with long usernames which has been fixed in the new versions.

If you are facing this error while trying to run Appcircle runner VMs on a macOS host, you should update the `screen` tool on the host machine with `brew`.

You should follow the steps below to update the `screen` tool:

- Check the current version before updating.

```bash
screen --version
```

- Install the up-to-date version using Homebrew.

```bash
brew install screen
```

- Open a new terminal session to use the new `screen`.

:::caution
If you don't open a new terminal session, you cannot use the up-to-date `screen` since the current shell session has access to the older version.
:::

- Re-check the version to see if the update was done successfully.

```bash
screen --version
```
