# Screenshot Toggler App

This is a React Native application for Android and iOS that allows users to toggle the native device screenshot feature and detects screenshot events, submitting device details to a REST API.

## Features

* **Toggle Screenshot Feature:** Activate/Deactivate a custom native plugin to enable/disable device screenshot capabilities.
* **Screenshot Detection:** If the screenshot feature is enabled, an alert is shown to the user upon a screenshot event (Android 14+ specific detection; iOS uses notification-based detection).
* **Device Details Submission:** On button tap, collects and submits various device details to a REST API, including:
    * OS, device name
    * Device MAC address (limited on modern OS)
    * IMEI (limited on modern OS)
    * Public IP Address
    * Screenshot Status
* **Custom Native Plugin:** Implemented using native modules (Kotlin for Android, Objective-C++ for iOS) to control and detect screenshot events, avoiding third-party NPM packages for this core functionality.
* **UI/UX:** Displays app logo, a custom toggle button, and a wait loader during API calls.
* **Cross-Platform:** Supports both Android and iOS.
* **Clean Code:** Follows ES6/TypeScript/React best practices for modular, readable, and high-performance code.

## Demo (Screenshots/GIFs - Optional)

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js (LTS recommended):** [nodejs.org](https://nodejs.org/)
* **Watchman:**
    * macOS: `brew install watchman`
    * Linux: `sudo apt-get install watchman`
* **JDK (Java Development Kit) 17 or newer LTS:** [Adoptium Temurin](https://adoptium.net/temurin/releases/) (for Android development)
* **Android Studio:** [developer.android.com/studio](https://developer.android.com/studio)
    * Install SDK Platforms (e.g., Android 14/API 34) and SDK Build-Tools.
    * Configure `ANDROID_HOME` environment variable and add platform-tools to `PATH`.
* **Xcode (macOS only):** Install from Mac App Store.
    * Open Xcode, go to `Settings > Locations`, and install the Command Line Tools.
* **rbenv & Ruby 3.3.0 (macOS only):** Crucial for iOS development with CocoaPods.
    ```bash
    brew update
    brew install rbenv ruby-build
    echo 'eval "$(rbenv init -)"' >> ~/.zshrc # or ~/.bash_profile
    source ~/.zshrc # or ~/.bash_profile
    rbenv install 3.3.0
    rbenv global 3.3.0
    gem install bundler
    ```
* **CocoaPods (macOS only):** This will be installed via Bundler.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[suseendhar/]/[ScreenshotToggler].git
    cd [ScreenshotToggler]
    ```
2.  **Install JavaScript dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Install iOS Pods (macOS only):**
    This step is crucial for linking native modules on iOS.
    ```bash
    cd ios
    # Clean up any previous pod/bundle issues (recommended)
    rm -rf Pods Podfile.lock Gemfile.lock vendor build
    # Install project-specific Ruby gems (Bundler will install CocoaPods)
    bundle install
    # Install iOS native dependencies
    bundle exec pod install
    cd ..
    ```

## Running the Application

### For Android

1.  **Start an Android Emulator** (API 34 or higher recommended for full screenshot detection):
    ```bash
    cd $ANDROID_HOME/emulator
    ./emulator -avd <YOUR_AVD_NAME>
    ```
    (Replace `<YOUR_AVD_NAME>` with an emulator name from `./emulator -list-avds`)
    *Ensure `ANDROID_HOME` and `PATH` are correctly configured in your shell.*
2.  **Deploy and Run the app:**
    ```bash
    npx react-native run-android
    ```

### For iOS (macOS only)

1.  **Start an iOS Simulator** (e.g., iPhone 15):
    ```bash
    npx react-native run-ios
    ```
    Alternatively, open `ios/ScreenshotToggler.xcworkspace` in Xcode and run from there.

## Testing

### Unit Tests (Jest)

Unit tests are pre-configured with React Native.
```bash
npm test
