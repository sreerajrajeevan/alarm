/**
 * @fileOverview This file exists to satisfy Next.js static export requirements.
 * The application has been refactored to use query parameters (e.g., /ringing?id=...)
 * which is the correct pattern for static site generation (SSG) in Capacitor/Android.
 */

export const dynamicParams = false;

export async function generateStaticParams() {
  // Providing a placeholder value ensures the static build completes successfully.
  return [{ id: 'build-time-placeholder' }];
}

export default function RingingStaticPage() {
  return null;
}
