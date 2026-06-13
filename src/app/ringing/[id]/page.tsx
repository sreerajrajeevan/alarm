/**
 * This file satisfies the Next.js static export requirement for dynamic segments.
 * The application has been refactored to use query parameters (e.g., /ringing?id=...)
 * which is more compatible with static site generation (SSG) for Capacitor/Android.
 */
export async function generateStaticParams() {
  return [];
}

export default function RingingRedirect() {
  return null;
}
