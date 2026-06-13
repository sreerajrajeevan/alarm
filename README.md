
# AlarmQuest | Wake Up with AI

A modern, high-difficulty alarm clock inspired by Nothing OS, powered by Google Gemini AI.

## 📱 Build Your Android APK

This project is configured with **Capacitor** to wrap the Next.js static export into a native Android app.

### 1. Prerequisites
- [Android Studio](https://developer.android.com/studio) installed and configured.
- **Android SDK** installed via the Android Studio SDK Manager.

### 2. Generate the APK
Follow these commands in order:

```bash
# 1. Build the static web project
npm run build

# 2. Add the Android platform (first time only)
npx cap add android

# 3. Sync the 'out' directory to the Android project
npx cap sync android

# 4. Open the project in Android Studio
npx cap open android
```

### 3. Final Step in Android Studio
1. Wait for the Gradle sync to complete.
2. Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Locate your file in `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## ✨ Features
- **AI Vision Quest**: Stop the alarm by photographing a specific object assigned by Gemini.
- **Nothing Design Language**: Minimalist aesthetics with dot-matrix typography.
- **Cloud Sync**: Powered by Firebase—your alarms and stats are synced across devices.
- **Offline Capable**: Works as a native app even without an active internet connection (once installed).

## 🛠 Local Development (Web)
1. Ensure your Gemini API key is in your `.env` file as `NEXT_PUBLIC_GEMINI_API_KEY`.
2. Run `npm run dev` to start the local server.
3. Access at `http://localhost:9002`.
