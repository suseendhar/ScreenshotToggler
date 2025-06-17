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

<!-- You can add screenshots or a GIF of the app running here -->

## Project Structure