'use server';
/**
 * @fileOverview This file defines a Genkit flow for real-time object identification from a camera feed.
 *
 * - identifyObjectInImage - A function that identifies a specific object in a provided image.
 * - ObjectIdentificationInput - The input type for the identifyObjectInImage function.
 * - ObjectIdentificationOutput - The return type for the identifyObjectInImage function.
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
    { text: `Analyze the provided image. Your task is to determine if the object '{{{targetObject}}}' is clearly visible in the image.\n    Respond ONLY with a JSON object.\n    The JSON object MUST strictly follow this schema:\n    {\n      "isIdentified": boolean, // Set to true if '{{{targetObject}}}' is clearly present and identifiable. Set to false otherwise.\n      "identifiedObject": string | null, // If 'isIdentified' is true, this should be '{{{targetObject}}}'. Otherwise, it should be null.\n      "confidenceScore": number // A floating-point number between 0.0 and 1.0 (inclusive) representing your confidence that '{{{targetObject}}}' is present and correctly identified. If 'isIdentified' is false, this should be 0.0.\n    }` }
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

    // Call the AI model for image analysis
    const { text } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image',
      prompt: identifyObjectPrompt({ photoDataUri, targetObject }), // Pass input directly
      config: {
        responseModalities: ['TEXT'],
        // Safety settings can be configured here if specific content needs to be blocked
        // safetySettings: [
        //   {
        //     category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        //     threshold: 'BLOCK_NONE',
        //   },
        // ],
      },
    });

    if (!text) {
      throw new Error('AI model did not return any text output.');
    }

    let rawAiOutput: AiRawOutput;
    try {
      rawAiOutput = JSON.parse(text);
      // Validate the parsed output against the schema
      AiRawOutputSchema.parse(rawAiOutput);
    } catch (e) {
      console.error('Failed to parse AI model output or it did not match schema:', e);
      // Fallback if AI doesn't return valid JSON or structure
      return {
        isIdentified: false,
        identifiedObject: null,
        confidenceScore: 0.0,
        message: 'AI recognition failed to process image. Please try again.',
      };
    }

    const { isIdentified: modelIsIdentified, identifiedObject: modelIdentifiedObject, confidenceScore } = rawAiOutput;

    let finalIsIdentified = false;
    let message = `Incorrect object. Try again.`;

    // Check if the model identified the correct object and meets confidence
    if (modelIsIdentified && modelIdentifiedObject === targetObject && confidenceScore >= minConfidence) {
      finalIsIdentified = true;
      message = 'Correct object! Alarm dismissed.';
    } else if (modelIsIdentified && modelIdentifiedObject !== targetObject) {
      message = `Incorrect object identified: ${modelIdentifiedObject}. Looking for ${targetObject}. Try again.`;
    } else if (confidenceScore > 0 && confidenceScore < minConfidence) {
      message = `Confidence too low (${(confidenceScore * 100).toFixed(0)}%). Please get a clearer shot of the ${targetObject}.`;
    } else {
      // This covers cases where modelIsIdentified is false or confidenceScore is 0.
      message = `No ${targetObject} detected. Try again.`;
    }


    return {
      isIdentified: finalIsIdentified,
      identifiedObject: finalIsIdentified ? targetObject : null, // Ensure we only return the target object if it was truly identified
      confidenceScore: confidenceScore,
      message: message,
    };
  }
);

/**
 * Identifies a specific real-world object in a provided image (e.g., from a live camera feed).
 *
 * @param input - The input containing the image data URI, the target object name, and an optional minimum confidence.
 * @returns An object indicating whether the target object was identified, its confidence score, and a message.
 */
export async function identifyObjectInImage(input: ObjectIdentificationInput): Promise<ObjectIdentificationOutput> {
  return identifyObjectInImageFlow(input);
}
