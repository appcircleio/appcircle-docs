---
title: Flutter Mirror
description: Point pub and the Flutter tool at your artifact proxy for builds on runners without internet access.
tags: [flutter, dependencies, proxy, self-hosted]
---

# Flutter Mirror

The **Flutter Mirror** step points pub and the Flutter tool at your artifact proxy, such as Sonatype Nexus or JFrog Artifactory. Use it on self-hosted runners without internet access, for Flutter builds:

- Dart and Flutter packages come from your pub proxy;
- Flutter engine files come from your Flutter storage proxy.

The step only sets `PUB_HOSTED_URL` and `FLUTTER_STORAGE_BASE_URL` for the later steps of the build. It changes nothing in your repository. If both URLs are empty, it does nothing.

## Prerequisites

- Place the step after **Git Clone**, with the other mirror steps, and before [**Flutter Install**](/workflows/flutter-specific-workflow-steps/flutter-install).
- For the rest of a Flutter build, add:
  - Android: [**Gradle Mirror**](/workflows/common-workflow-steps/gradle-mirror);
  - iOS with CocoaPods: [**CocoaPods Mirror**](/workflows/ios-specific-workflow-steps/cocoapods-mirror);
  - `git:` packages in `pubspec.yaml`: [**Git Mirror**](/workflows/common-workflow-steps/git-mirror).
- Your artifact proxy has these repositories, with anonymous read:

| Repository | Type | Remote URL |
| ---------- | ---- | ---------- |
| pub | pub proxy (Sonatype Nexus 3.92.0 or later) | `https://pub.dev` |
| Flutter storage | raw (generic) proxy | `https://storage.googleapis.com` |

:::tip

Add the URLs to an [environment variable group](/environment-variables) once and select the group in each build configuration. The inputs of the step read these variables by default.

:::

## Input Variables

| Variable Name | Description | Status |
| ------------- | ----------- | ------ |
| `$AC_MIRROR_PUB` | URL of the pub proxy, for example `https://nexus.example.com/repository/pub-proxy`. | Optional |
| `$AC_MIRROR_FLUTTER` | URL of the Flutter storage proxy, for example `https://nexus.example.com/repository/flutter-storage`. | Optional |

## Limits

- **Flutter SDK:** the **Flutter Install** step clones the Flutter SDK from `github.com`. On a runner without internet access, install the SDK from your Flutter storage proxy with a [**Custom Script**](/workflows/common-workflow-steps/custom-script) step in its place, after this step.

  <details>
  <summary>Custom Script that installs the Flutter SDK</summary>

  Set `FLUTTER_VERSION` to the version your app uses.

  ```bash
  set -euo pipefail
  FLUTTER_VERSION="3.29.3"
  BASE="${FLUTTER_STORAGE_BASE_URL:-https://storage.googleapis.com}"
  RELEASES="$BASE/flutter_infra_release/releases"

  curl -fsS "$RELEASES/releases_macos.json" -o /tmp/releases.json
  read -r ARCHIVE SHA < <(FV="$FLUTTER_VERSION" python3 -c 'import json,os; d=json.load(open("/tmp/releases.json")); r=[x for x in d["releases"] if x["version"]==os.environ["FV"] and x.get("dart_sdk_arch")=="arm64"][0]; print(r["archive"], r["sha256"])')

  curl -fsS "$RELEASES/$ARCHIVE" -o /tmp/flutter.zip
  echo "$SHA  /tmp/flutter.zip" | shasum -a 256 -c -
  rm -rf "$HOME/flutter-sdk" && mkdir -p "$HOME/flutter-sdk"
  ditto -x -k /tmp/flutter.zip "$HOME/flutter-sdk" && rm -f /tmp/flutter.zip

  FL="$HOME/flutter-sdk/flutter"
  echo "PATH=$FL/bin:$PATH" >> "$AC_ENV_FILE_PATH"
  "$FL/bin/flutter" --no-version-check --version

  # Skip the version check on github.com in the later flutter commands.
  NOW=$(date -u "+%Y-%m-%d %H:%M:%S.000")
  printf '{"lastTimeVersionWasChecked":"%s","lastKnownRemoteVersion":"%s","lastTimeWarningWasPrinted":"%s"}' \
    "$NOW" "$NOW" "$NOW" > "$FL/bin/cache/flutter_version_check.stamp"
  ```

  </details>

- **Packages with build hooks** download native libraries outside pub, for example from GitHub releases. Environment variables do not reach build hooks. Use the package's own setting (`hooks: user_defines` in `pubspec.yaml`) to point it at your artifact proxy, or keep a copy of the package with the URL changed.
- **`hosted:` URLs** in `pubspec.yaml` other than `pub.dev` are used as written.

---

To access the source code of this component, please use the following link:

https://github.com/appcircleio/appcircle-flutter-mirror-component
