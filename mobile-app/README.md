# Taleemaat-e-Islam Mobile App

Android + iOS app for [taleemaateislam.com](https://taleemaateislam.com), built with
[Capacitor](https://capacitorjs.com). This is a native app shell that loads the live
website (see `server.url` in `capacitor.config.json`) — so the app always shows the
same content as the site with no separate content pipeline to maintain. It adds native
app behavior on top: home-screen icon, splash screen, status bar theming, and a
foundation for push notifications / native features later.

## One-time machine setup

You need Node.js, and the Android/iOS SDKs, installed on your Mac. See the setup
commands the assistant gave you in chat (Homebrew → Node → Xcode → Android Studio).
Verify before continuing:

```sh
node -v      # any recent LTS, e.g. v20.x or v22.x
npm -v
xcodebuild -version   # requires full Xcode, not just Command Line Tools
```

### Android build environment (already set up on this machine)

Android Studio's bundled JDK (25) is too new for Gradle 8.11.1, and Capacitor 7's
Android module requires JDK 21+ as a minimum. **JDK 21** (`brew install openjdk@21`)
is installed and is what building this project requires. Every command below that
touches `android/` needs these exported first (not permanent — add them to your
shell profile if you don't want to retype them):

```sh
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
```

## First-time project setup

Run all of this from inside `mobile-app/`:

```sh
cd mobile-app
npm install

# Generate native projects (only needed once)
npx cap add android
npx cap add ios

# Generate app icons + splash screens for both platforms from resources/icon.png
# and resources/splash.png (currently the site logo — see "Before submitting" below)
npx capacitor-assets generate

# Pull the config/assets into the native projects
npx cap sync
```

This creates `android/` and `ios/` folders containing full native Xcode/Gradle
projects. Commit them to git — Capacitor's convention is to track the native
projects so builds are reproducible without regenerating them.

## Running the app during development

```sh
# Android (opens Android Studio; press Run, or use an emulator/device)
npx cap open android

# iOS (opens Xcode; press Run, needs a Mac + Xcode + simulator or device)
npx cap open ios
```

Because `capacitor.config.json` points `server.url` at the live site, both platforms
load `https://taleemaateislam.com` directly — editing the website's HTML/CSS/JS and
reloading the app shows the change immediately, no rebuild needed. The `www/`
folder here is only a fallback screen shown if the device has no internet on launch.

## Building without opening the IDE

Android debug APK from the command line:

```sh
cd android
./gradlew assembleDebug
# output: android/app/build/outputs/apk/debug/app-debug.apk
```

iOS requires Xcode's build tooling (`xcodebuild`) or the Xcode GUI; it cannot be
fully scripted without a paid Apple Developer account for device/App Store signing.

## Play Store submission (Android)

Everything technical is done - see `play-store/listing.md` for the full
copy-paste-ready listing content, graphics, data safety answers, and a
step-by-step walkthrough of the Play Console side. Summary of what's in place:

- **Release signing**: `android/keystore.properties` (git-ignored) points at
  `android/app/release.keystore` (also git-ignored) - both live only on this
  machine and whatever you back them up to. `android/app/build.gradle` picks
  this up automatically for release builds; debug builds are unaffected.
  **Back up `release.keystore` and the password somewhere durable (a password
  manager) - Play App Signing means losing it isn't catastrophic (Google can
  reset your upload key), but you'll need it for every release build until
  you do.**
- **Release bundle**: `npm run bundle:android:release` produces
  `android/app/build/outputs/bundle/release/app-release.aab`, the format
  Play Store requires (not the `.apk` used for direct/sideload distribution).
- **Store listing assets**: `play-store/icon-512.png`,
  `play-store/feature-graphic.png`, `play-store/listing.md`.
- **Still needed from you**: a Play Console developer account ($25 one-time,
  https://play.google.com/console/), phone screenshots taken from an actual
  device, and the actual upload/submission in the Play Console web UI.

## Apple App Store (iOS) - on hold

Not started. Needs a $99/yr Apple Developer Program enrollment
(https://developer.apple.com/programs/) and a Mac with full Xcode installed;
signing is then managed through Xcode + your Apple Developer team.

## Privacy policy

The site already has one at `/privacy.html`; both stores require a privacy
policy URL during submission, so `https://taleemaateislam.com/privacy.html`
can be reused as-is.

## Bundle/App ID

Set to `com.taleemaateislam.app` in `capacitor.config.json` - this cannot be
changed after the first store submission on either platform.

## Project structure

```
mobile-app/
  capacitor.config.json   # app id, name, remote URL, splash/status bar config
  package.json             # Capacitor dependencies + build scripts
  resources/                # source icon.png / splash.png for asset generation
  make-icon.mjs             # regenerates resources/icon.png (book + bookmark mark)
  make-splash.mjs           # regenerates android splash screens directly (bypasses
                             # a real stretching bug in @capacitor/assets' own splash step)
  make-feature-graphic.mjs  # regenerates play-store/feature-graphic.png
  play-store/                # Play Store listing copy + graphics (see listing.md)
  www/                      # offline fallback page (not the app's real content)
  android/                  # generated native Android project (after cap add android)
    keystore.properties      # release signing config - git-ignored, exists only locally
    app/release.keystore     # release signing key - git-ignored, exists only locally
  ios/                      # generated native iOS project (not yet started)
```
