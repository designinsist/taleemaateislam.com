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

## Before submitting to the app stores

1. **Replace the placeholder icon/splash.** `resources/icon.png` and
   `resources/splash.png` are currently the website's 564×564 logo, upscaled.
   Before a store submission, replace both with a proper 1024×1024 icon (and a
   1024×1024+ splash image) and re-run `npx capacitor-assets generate`.
2. **Apple Developer Program** ($99/yr) — required to submit to the App Store and
   to test on a physical iPhone. Enroll at https://developer.apple.com/programs/.
3. **Google Play Console** ($25 one-time) — required to publish to the Play Store.
   Register at https://play.google.com/console/.
4. **App signing:**
   - Android: generate a release keystore (`keytool -genkey -v -keystore
     release.keystore ...`), configure it in `android/app/build.gradle`. Never
     commit the keystore file (already git-ignored here).
   - iOS: signing is managed through Xcode + your Apple Developer team once
     enrolled.
5. **Privacy policy** — the site already has one at `/privacy.html`; both stores
   require a privacy policy URL during submission, so `https://taleemaateislam.com/privacy.html`
   can be reused.
6. **Bundle/App ID** is set to `com.taleemaateislam.app` in `capacitor.config.json`
   — change it now if you want a different reverse-domain identifier, since it
   cannot be changed after the first store submission.

## Project structure

```
mobile-app/
  capacitor.config.json   # app id, name, remote URL, splash/status bar config
  package.json             # Capacitor dependencies + build scripts
  resources/                # source icon.png / splash.png for asset generation
  www/                      # offline fallback page (not the app's real content)
  android/                  # generated native Android project (after cap add android)
  ios/                      # generated native iOS project (after cap add ios)
```
