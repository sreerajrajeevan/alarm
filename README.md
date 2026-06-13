
# AlarmQuest | Wake Up with AI

A modern, high-difficulty alarm clock inspired by Nothing OS, powered by Google Gemini AI.

## 📱 Convert to Android APK

This project is optimized for **Capacitor** to wrap the Next.js static export into a native Android app.

### 1. Prerequisites
- Install [Android Studio](https://developer.android.com/studio).
- Install the **Android SDK** from the Android Studio SDK Manager.

### 2. Setup Environment
Ensure your Gemini API key is in your `.env` file:
- `NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here`

### 3. Build & Package
```bash
# 1. Install dependencies
npm install

# 2. Build the static project
npm run build

# 3. Add/Sync Android platform
npx cap add android
npx cap sync android

# 4. Open in Android Studio
npx cap open android
```

### 4. Generate APK
In Android Studio:
1. Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. The generated `.apk` will be in `android/app/build/outputs/apk/debug/`.

---

## ✨ Features
- **AI Vision Quest**: Stop the alarm by photographing a specific object assigned by Gemini.
- **Nothing Design Language**: Minimalist aesthetics with dot-matrix typography.
- **Cloud Sync**: Powered by Firebase—your alarms and stats are synced across devices.

## 🛠 Setup (Local & PWA)
1. Get an API Key at [Google AI Studio](https://aistudio.google.com/) and add it to `.env` as `NEXT_PUBLIC_GEMINI_API_KEY`.
2. Run `npm run dev` to start locally.
3. Access via your phone's browser and "Add to Home Screen" for a native-like experience.
