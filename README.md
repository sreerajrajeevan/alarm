
# AlarmQuest | Wake Up with AI

A modern, high-difficulty alarm clock inspired by Nothing OS, powered by Google Gemini AI.

## 🚀 Deployment

**Live App**: [YOUR_FIREBASE_APP_HOSTING_LINK_HERE](https://alarm-quest.web.app)

---

## 📱 Build Your Android APK

This project is configured with **Capacitor** to wrap the Next.js static export into a native Android app.

### 1. Prerequisites
- [Android Studio](https://developer.android.com/studio) installed and configured.
- **Android SDK** installed via the Android Studio SDK Manager.

### 2. Generate the APK
Run these commands from your project root:

```bash
# 1. Build the static web project
npm run build

# 2. Add the Android platform (first time only)
npm run android:add

# 3. Sync the 'out' directory to the Android project
npm run android:sync

# 4. Open the project in Android Studio
npm run android:open
```

### 3. Final Step in Android Studio
1. Wait for the **Gradle sync** (bottom progress bar) to complete.
2. Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Once completed, a popup will appear at the bottom right. Click **locate**.
4. Your file is in `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 🏠 Local Usage (No Deployment)
1. Ensure your Gemini API key is in your `.env` file as `NEXT_PUBLIC_GEMINI_API_KEY`.
2. Run `npm run dev`.
3. Find your Computer's Local IP (e.g., `192.168.1.5`).
4. On your Android phone, open Chrome and navigate to `http://<YOUR_IP>:9002`.
5. Tap the three dots (⋮) -> **Add to Home Screen** for the full-screen experience.

## ✨ Features
- **AI Vision Quest**: Stop the alarm by photographing a specific object assigned by Gemini.
- **Nothing Design Language**: Minimalist aesthetics with dot-matrix typography.
- **Cloud Sync**: Powered by Firebase—your alarms and stats are synced across devices.
- **Offline Capable**: Works as a native app even without an active internet connection (once installed).
