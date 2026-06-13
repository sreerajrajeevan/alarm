# AlarmQuest | Wake Up with AI

A modern, high-difficulty alarm clock inspired by Nothing OS, powered by Google Gemini AI. This app is built as a Progressive Web App (PWA), providing a native-like experience on Android without needing a traditional APK.

## 🚀 Live Demo
**App Link:** [https://YOUR-PROJECT-ID.web.app](https://YOUR-PROJECT-ID.web.app)
*(Replace this with your actual Firebase App Hosting URL after deployment)*

## 📱 How to Install on Android

To use AlarmQuest as a native app on your Android device:

1. **Open the App**: Open your deployment URL (the link above) in **Google Chrome** on your Android phone.
2. **Menu**: Tap the **three dots (⋮)** in the top-right corner of Chrome.
3. **Add to Home Screen**: Select **"Install app"** or **"Add to Home screen"**.
4. **Launch**: Find the **AlarmQuest** icon in your app drawer or on your home screen. It will now launch in full-screen mode without the browser address bar, behaving exactly like a native APK.

## ✨ Features
- **AI Vision Quest**: The only way to stop the alarm is to find and photograph a specific object assigned by the AI.
- **Nothing Design Language**: Minimalist aesthetics with dot-matrix typography, glass-card components, and a dark monochrome palette.
- **Cloud Sync**: Powered by Firebase—your alarms and statistics are synced across your devices.
- **Performance Tracking**: Monitor your wake-up streaks and historical performance.

## 🛠 Tech Stack
- **Next.js 15 (App Router)**
- **Genkit + Gemini 2.5 Flash** (Vision AI)
- **Firebase** (Authentication & Firestore)
- **Tailwind CSS + ShadCN UI**
- **Lucide Icons**

## 🚀 Deployment

### How to add this to GitHub
1. **Create a Repo**: Go to [GitHub](https://github.com/new) and create a new repository.
2. **Open Terminal**: Navigate to this project folder.
3. **Run Commands**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AlarmQuest PWA"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```

### Local Development
1. Clone the repository.
2. Create a `.env.local` file with your Firebase and Google AI credentials.
3. Run `npm install` and `npm run dev`.
