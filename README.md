
# AlarmQuest | Wake Up with AI

A modern, high-difficulty alarm clock inspired by Nothing OS, powered by Google Gemini AI. This app is built as a Progressive Web App (PWA), providing a native-like experience on Android.

## 🚀 How to Run Locally

You don't need to host the app to use it. You can run it on your laptop and access it from your phone.

1. **Start the Server**:
   ```bash
   npm install
   npm run dev
   ```
2. **Find your Local IP**:
   - On Windows: Run `ipconfig` in CMD. Look for `IPv4 Address`.
   - On Mac/Linux: Run `ifconfig` or `ip addr`.
3. **Open on Phone**:
   Open Chrome on your Android phone and navigate to `http://<YOUR-IP-ADDRESS>:9002`.
4. **Install as App**:
   Tap the **three dots (⋮)** in Chrome and select **"Add to Home screen"**. It will now behave like a native APK.

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

## 🚀 Deployment (Optional)
If you want to host it permanently:
1. Connect this repo to Firebase App Hosting.
2. Update your `README.md` with the live URL.
