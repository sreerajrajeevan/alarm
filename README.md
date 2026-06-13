
# AlarmQuest | Wake Up with AI

A modern, high-difficulty alarm clock inspired by Nothing OS, powered by Google Gemini AI.

## 📱 Build & Update Your Android APK

Follow these steps whenever you make changes to the app code.

### 1. Build the Web Project
This compiles your React/Next.js code into static files.
```bash
npm run build
```

### 2. Sync to Android
This pushes the compiled files from `out/` into the `android/` folder.
```bash
npm run android:sync
```

### 3. Build in Android Studio
1. Run `npm run android:open` to launch the project.
2. In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Once completed, click **locate** in the popup to find your `app-debug.apk`.

---

## 🛠 Troubleshooting (Windows)

**Error: `C:\Users\...\AppData\Roaming\npm` not found**
Run this once: `mkdir %AppData%\npm`

**Error: Java Runtime version (class file version 61.0)**
Your Android Studio is using an old Java version.
1. Go to **File > Settings > Build, Execution, Deployment > Build Tools > Gradle**.
2. Change **Gradle JDK** to **Java 17**.
3. Click the "Sync" button (Elephant icon).

**Error: `UNIFIED_TEST_PLATFORM`**
Ensure you are using **Android Studio Hedgehog** or newer. If issues persist, go to **File > Invalidate Caches...** and restart.

---

## ✨ Features
- **AI Vision Quest**: Stop the alarm by photographing a specific object assigned by Gemini.
- **Nothing Design Language**: Minimalist aesthetics with dot-matrix typography.
- **Guest Access**: No login required.
- **Cloud Sync**: Alarms are synced to Firestore under a guest profile.
