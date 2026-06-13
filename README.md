# AlarmQuest | Wake Up with AI

A modern, high-difficulty alarm clock inspired by Nothing OS, powered by Google Gemini AI.

## Features
- **AI Vision Quest**: The only way to stop the alarm is to find and photograph a specific object.
- **Nothing Design Language**: Minimalist aesthetics with dot-matrix typography and glass-card components.
- **Performance Tracking**: Track your streaks and average wake-up times.

## How to add this to GitHub

Follow these steps to push your local project to a GitHub repository:

1. **Create a Repo**: Go to [GitHub](https://github.com/new) and create a new repository (do not initialize with README or .gitignore).
2. **Open Terminal**: Navigate to this project folder.
3. **Run Commands**:
   ```bash
   # Initialize git
   git init

   # Add all files (the .gitignore will handle exclusions)
   git add .

   # Create initial commit
   git commit -m "Initial commit: AlarmQuest prototype"

   # Rename branch to main
   git branch -M main

   # Link to your remote GitHub repo
   # Replace <username> and <repo-name> with your details
   git remote add origin https://github.com/<username>/<repo-name>.git

   # Push to GitHub
   git push -u origin main
   ```

## Tech Stack
- **Next.js 15 (App Router)**
- **Genkit + Gemini 2.5 Flash**
- **Tailwind CSS + ShadCN UI**
- **Lucide Icons**
