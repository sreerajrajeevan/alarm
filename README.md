
# AlarmQuest | Wake Up with AI

A modern, high-difficulty alarm clock inspired by Nothing OS, powered by Google Gemini AI.

## 🚀 Deployment

**Live App**: [YOUR_FIREBASE_APP_HOSTING_LINK_HERE](https://alarm-quest.web.app)

---

## 📱 Build Your Android APK

This project is configured with **Capacitor** to wrap the Next.js static export into a native Android app.

### 1. Prerequisites
- [Android Studio](https://android.google.com/studio) installed and configured.
- **Android SDK** installed via the Android Studio SDK Manager.

### 2. Generate the APK

**Windows Fix**: If you see an `ENOENT` error regarding `AppData\Roaming\npm`, run this command once in your terminal:
`mkdir %AppData%\npm`

Then run these commands from your project root:

```bash
# 1. Build the static web project
npm run build

# 2. Add the Android platform (Already Done)
npm run android:add

# 3. Sync the 'out' directory to the Android project
npm run android:sync

# 4. Open the project in Android Studio
npm run android:open
```

### 3. Final Step in Android Studio
1.  **Wait for Gradle**: Once Android Studio opens, wait for the **Gradle sync** (bottom progress bar) to complete. This can take a minute.
2.  **Build APK**: Go to the top menu: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3.  **Locate**: Once completed, a popup will appear at the bottom right. Click **locate**.
4.  **Install**: Your file is in `android/app/build/outputs/apk/debug/app-debug.apk`. Transfer this to your phone and install it!

---

## ✨ Features
- **AI Vision Quest**: Stop the alarm by photographing a specific object assigned by Gemini.
- **Nothing Design Language**: Minimalist aesthetics with dot-matrix typography.
- **Cloud Sync**: Powered by Firebase—your alarms and stats are synced across devices.
- **Offline Capable**: Works as a native app even without an active internet connection.
