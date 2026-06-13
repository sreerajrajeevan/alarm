
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alarmquest.app',
  appName: 'AlarmQuest',
  webDir: 'out', // The directory where Next.js exports static files
  server: {
    androidScheme: 'https'
  }
};

export default config;
