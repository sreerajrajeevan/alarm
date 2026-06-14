
import type {Metadata, Viewport} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { NotificationHandler } from '@/components/NotificationHandler';

export const metadata: Metadata = {
  title: 'AlarmQuest | Wake Up with AI',
  description: 'A modern Android alarm clock application inspired by Nothing OS design language.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AlarmQuest',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#161A1E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-body antialiased min-h-screen dot-pattern selection:bg-primary/30">
        <FirebaseClientProvider>
          <NotificationHandler />
          {children}
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
