import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// For a static export / Capacitor app, we use the public API key 
// to allow the AI to run directly in the mobile webview.
export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
  })],
  model: 'googleai/gemini-2.5-flash',
});
