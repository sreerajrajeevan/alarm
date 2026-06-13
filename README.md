
# AlarmQuest | Wake Up with AI

A modern, high-difficulty alarm clock inspired by Nothing OS, powered by Google Gemini AI.

## 📱 Convert to Android APK

To turn this project into a real Android App (APK), we use **Capacitor**. Follow these steps:

### 1. Prerequisites
- Install [Android Studio](https://developer.android.com/studio).
- Install the **Android SDK** and **Command Line Tools** from the Android Studio SDK Manager.

### 2. Prepare the Project
```bash
# Install Capacitor dependencies
npm install

# Build the project (generates the 'out' folder)
npm run build
```

### 3. Add Android Platform
```bash
# Initialize Capacitor (one-time setup)
npx cap add android
```

### 4. Sync and Build APK
```bash
# Sync your web code to the Android project
npx cap sync android

# Open the project in Android Studio
npx cap open android
```

### 5. Generate APK in Android Studio
1. Once Android Studio opens, wait for Gradle to finish syncing.
2. Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Android Studio will generate the `.apk` file. You can then copy it to your phone and install it.

---

## ✨ Features
- **AI Vision Quest**: The only way to stop the alarm is to find and photograph a specific object assigned by the AI.
- **Nothing Design Language**: Minimalist aesthetics with dot-matrix typography and glass-card components.
- **Cloud Sync**: Powered by Firebase—your alarms and statistics are synced across your devices.

## 🛠 Setup (Firebase & AI)
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a project and add a Web App.
3. Copy the `firebaseConfig` values into your `.env` file.
4. Enable **Google Auth** in the Authentication section.
5. Create a **Firestore Database**.
6. Get an API Key for Gemini at [Google AI Studio](https://aistudio.google.com/) and add it to `.env` as `GEMINI_API_KEY`.

## 🚀 Live Preview (PWA)
If you don't want to build an APK, you can use the **PWA** version:
1. Open your hosted site (e.g., Firebase App Hosting link) in Chrome on Android.
2. Tap **(⋮) > Add to Home screen**.
3. It will install as an app on your phone.

> **Note on AI**: For the AI Vision Quest to work in a native APK, you must host your Genkit flows on a server (like Firebase Functions or a Cloud Run instance) because native apps cannot run Node.js server actions internally.
