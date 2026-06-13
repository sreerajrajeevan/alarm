/**
 * @fileOverview This file implements a Genkit flow for real-time vision validation.
 * Refactored for client-side execution in static exports.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RealtimeVisionValidationInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  targetObject: z.string().describe('The name of the object to identify in the image (e.g., "Toothbrush").'),
  minConfidence: z.number().min(0).max(1).default(0.8).describe('Minimum confidence score (0-1) for object identification. Defaults to 0.8 (80%).'),
});
export type RealtimeVisionValidationInput = z.infer<typeof RealtimeVisionValidationInputSchema>;

const DetectedObjectSchema = z.object({
  label: z.string().describe('The label of the detected object.'),
  confidence: z.number().min(0).max(1).describe('The estimated confidence score (0-1) of the detection.'),
});

const RealtimeVisionValidationOutputSchema = z.object({
  isValidImage: z.boolean().describe('True if the image is valid.'),
  isObjectFound: z.boolean().describe('True if the target object is detected.'),
  detectedObjects: z.array(DetectedObjectSchema).describe('A list of all objects detected.'),
  errorMessage: z.string().optional().describe('An error message if validation failed.'),
});
export type RealtimeVisionValidationOutput = z.infer<typeof RealtimeVisionValidationOutputSchema>;

const LlvmDirectOutputSchema = z.object({
  isValidImage: z.boolean(),
  imageQualityReason: z.string().optional(),
  detectedObjects: z.array(DetectedObjectSchema),
});

const visionRecognitionPrompt = ai.definePrompt({
  name: 'visionRecognitionPrompt',
  input: { schema: RealtimeVisionValidationInputSchema },
  output: { schema: LlvmDirectOutputSchema },
  model: 'googleai/gemini-2.5-flash-image',
  prompt: [
    { text: `Analyze the provided image.
    1. Determine if the image is a valid real-world photograph.
    2. Identify all discernible objects and estimate confidence scores.
    The target object is: "{{{targetObject}}}"` },
    { media: { url: '{{{imageDataUri}}}' } },
  ],
});

export async function validateImageForObject(input: RealtimeVisionValidationInput): Promise<RealtimeVisionValidationOutput> {
  return realtimeVisionValidationFlow(input);
}

const realtimeVisionValidationFlow = ai.defineFlow(
  {
    name: 'realtimeVisionValidationFlow',
    inputSchema: RealtimeVisionValidationInputSchema,
    outputSchema: RealtimeVisionValidationOutputSchema,
  },
  async (input) => {
    try {
      const { output: promptOutput } = await visionRecognitionPrompt(input);

      if (!promptOutput) {
        throw new Error('No output from AI.');
      }

      let isObjectFound = false;
      let errorMessage: string | undefined;

      if (!promptOutput.isValidImage) {
        errorMessage = promptOutput.imageQualityReason || 'Invalid image quality.';
      } else {
        const targetObjectNameLower = input.targetObject.toLowerCase();
        const foundTarget = promptOutput.detectedObjects.find(
          obj => obj.label.toLowerCase().includes(targetObjectNameLower) && obj.confidence >= input.minConfidence
        );
        if (foundTarget) isObjectFound = true;
        else errorMessage = `Could not find "${input.targetObject}".`;
      }

      return {
        isValidImage: promptOutput.isValidImage,
        isObjectFound: isObjectFound,
        detectedObjects: promptOutput.detectedObjects,
        errorMessage: errorMessage,
      };
    } catch (e) {
      return {
        isValidImage: false,
        isObjectFound: false,
        detectedObjects: [],
        errorMessage: 'Vision validation failed.',
      };
    }
  }
);
