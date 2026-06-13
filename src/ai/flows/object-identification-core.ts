/**
 * @fileOverview This file defines a Genkit flow for real-time object identification from a camera feed.
 * Refactored for client-side execution in static exports.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for the object identification flow
const ObjectIdentificationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo from the live camera feed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  targetObject: z.string().describe('The name of the object to identify in the image (e.g., "Toothbrush").'),
  minConfidence: z.number().min(0).max(1).default(0.8).describe('The minimum confidence score (0.0 to 1.0) required for a positive identification. Defaults to 0.8.'),
});
export type ObjectIdentificationInput = z.infer<typeof ObjectIdentificationInputSchema>;

// Output schema for the object identification flow
const ObjectIdentificationOutputSchema = z.object({
  isIdentified: z.boolean().describe('True if the target object was successfully identified with sufficient confidence, false otherwise.'),
  identifiedObject: z.string().nullable().describe('The name of the object identified if successful, otherwise null.'),
  confidenceScore: z.number().min(0).max(1).describe('The confidence score (0.0 to 1.0) of the identification.'),
  message: z.string().describe('A message indicating the result of the identification (e.g., "Correct object!", "Incorrect object. Try again.").'),
});
export type ObjectIdentificationOutput = z.infer<typeof ObjectIdentificationOutputSchema>;

// Helper schema for the AI model's raw JSON output
const AiRawOutputSchema = z.object({
  isIdentified: z.boolean(),
  identifiedObject: z.string().nullable(),
  confidenceScore: z.number().min(0).max(1),
});
type AiRawOutput = z.infer<typeof AiRawOutputSchema>;

// Define the prompt for the AI model
const identifyObjectPrompt = ai.definePrompt({
  name: 'identifyObjectPrompt',
  input: {
    schema: ObjectIdentificationInputSchema.pick(['photoDataUri', 'targetObject'])
  },
  output: { schema: AiRawOutputSchema },
  prompt: [
    { media: { url: '{{{photoDataUri}}}' } },
    { text: `Analyze the provided image. Your task is to determine if the object '{{{targetObject}}}' is clearly visible in the image.
    Respond ONLY with a JSON object.
    The JSON object MUST strictly follow this schema:
    {
      "isIdentified": boolean,
      "identifiedObject": string | null,
      "confidenceScore": number
    }` }
  ],
});

const identifyObjectInImageFlow = ai.defineFlow(
  {
    name: 'identifyObjectInImageFlow',
    inputSchema: ObjectIdentificationInputSchema,
    outputSchema: ObjectIdentificationOutputSchema,
  },
  async (input) => {
    const { photoDataUri, targetObject, minConfidence } = input;

    try {
      const { output } = await identifyObjectPrompt({ photoDataUri, targetObject });

      if (!output) {
        throw new Error('AI model did not return any output.');
      }

      const { isIdentified: modelIsIdentified, identifiedObject: modelIdentifiedObject, confidenceScore } = output;

      let finalIsIdentified = false;
      let message = `Incorrect object. Try again.`;

      if (modelIsIdentified && modelIdentifiedObject?.toLowerCase() === targetObject.toLowerCase() && confidenceScore >= minConfidence) {
        finalIsIdentified = true;
        message = 'Correct object! Alarm dismissed.';
      } else if (modelIsIdentified && modelIdentifiedObject?.toLowerCase() !== targetObject.toLowerCase()) {
        message = `Incorrect object identified: ${modelIdentifiedObject}. Looking for ${targetObject}. Try again.`;
      } else if (confidenceScore > 0 && confidenceScore < minConfidence) {
        message = `Confidence too low (${(confidenceScore * 100).toFixed(0)}%). Please get a clearer shot of the ${targetObject}.`;
      } else {
        message = `No ${targetObject} detected. Try again.`;
      }

      return {
        isIdentified: finalIsIdentified,
        identifiedObject: finalIsIdentified ? targetObject : null,
        confidenceScore: confidenceScore,
        message: message,
      };
    } catch (e) {
      console.error('AI recognition failed:', e);
      return {
        isIdentified: false,
        identifiedObject: null,
        confidenceScore: 0.0,
        message: 'AI recognition failed. Please ensure your API key is correct.',
      };
    }
  }
);

/**
 * Identifies a specific real-world object in a provided image.
 */
export async function identifyObjectInImage(input: ObjectIdentificationInput): Promise<ObjectIdentificationOutput> {
  return identifyObjectInImageFlow(input);
}
