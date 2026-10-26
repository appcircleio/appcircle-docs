---
title: Self-signed Certificates
description: Learn how to add self-signed certificates to the Appcircle runner
tags: [self-hosted runner, certificates, self-signed certificates]
sidebar_position: 5
---

## Overview

If your servers use certificates signed by your organization's own certificate authority (CA), the runner must trust that CA. These servers can be your self-hosted Appcircle server, your Git server, an artifact proxy, or a proxy that inspects TLS traffic.

Without it, the runner and the build tools fail with SSL errors.

## Adding Certificates

The runner package includes `install_cert.sh` in the `scripts` directory of the `appcircle-runner` directory. It connects to the server, finds the root CA of its certificate, and trusts it in:

- the macOS System keychain (the runner, Xcode, `curl`)
- the OpenSSL certificate directories (Ruby, CocoaPods, fastlane, Git)
- every Java installation
- Node.js (`NODE_EXTRA_CA_CERTS`)

Run it with the host name of the server:

```bash
./scripts/install_cert.sh --url api.appcircle.spacetech.com
```

Repeat `--url` for each server, and add the port when it is not `443`:

```bash
./scripts/install_cert.sh --url api.appcircle.spacetech.com --url git.spacetech.com:8443
```

Sample output:

```text
[INFO] install_cert.sh 2.0.0
[INFO] api.appcircle.spacetech.com:443: server certificate "api.appcircle.spacetech.com", 2 certificate(s) in the chain
[INFO] Trusting "SpaceTech Root CA" (SHA-256 3A:9F:...:C4:E1, valid until Apr 11 12:17:31 2036 GMT)
[INFO] Keychain: trusted "SpaceTech Root CA" (trustRoot)
[INFO] OpenSSL: /opt/homebrew/etc/openssl@3/certs (1 added)
[INFO] Java: added to 8.0.492-zulu 11.0.31-zulu 17.0.19-zulu 21.0.11-zulu 25.0.3-zulu
[INFO] Node.js: /Users/appcircle/cacerts.crt updated
[INFO] Verified https://api.appcircle.spacetech.com:443
[INFO] Done. Open a new terminal session for Node.js to pick up NODE_EXTRA_CA_CERTS.
```

:::caution
Open a new terminal session after the script completes for the changes to take effect.
:::

You can run the script again at any time. Certificates that are already trusted are not added twice.

### Certificates Valid for More Than 825 Days

macOS does not accept a server certificate valid for more than 825 days, even when its root CA is trusted. The script detects such a certificate and trusts it as well. Run the script again when the certificate is renewed.

### If the Server Does Not Send Its Root CA

Most servers send only their own certificate and an intermediate CA. The script then downloads the root CA from the address in the intermediate certificate. If that is not possible, it stops without changing anything.

In that case, get the root CA file from your IT team and pass it with `--cert`:

```bash
./scripts/install_cert.sh --cert rootca.crt --url api.appcircle.spacetech.com
```

With `--cert`, only the given certificates are trusted. The server is used to test the connection.

### Behind a Proxy

The script uses the `HTTPS_PROXY` and `NO_PROXY` environment variables, like other tools. If your proxy inspects TLS traffic, trust the proxy's CA as well: run the script with an external host, for example `--url github.com`, or pass the proxy's CA file with `--cert`.

### Exit Codes

| Code | Meaning |
| --- | --- |
| `0` | The certificates are trusted and the connection test passed. |
| `1` | Invalid usage. Run the script with `--help`. |
| `2` | The server's certificate or its root CA could not be fetched. |
| `3` | A trust step failed. |
| `4` | The certificates are trusted, but the connection test failed. The cause is printed. |

Add `--debug` to see the details of each step.

:::info
If macOS answers that the trust change was denied, System Integrity Protection is enabled on that Mac (Appcircle runner VM images have it disabled). Trust the certificate in Keychain Access with **Always Trust**, or with a certificate payload from your MDM, then run the script again.
:::
