'use server';
/**
 * @fileOverview This file implements a Genkit flow for real-time vision validation.
 * It processes a camera capture, checks its validity (not dark/blank/screenshot),
 * and identifies if a target object is present with a specified confidence level.
 *
 * - validateImageForObject - A function that handles the image validation process.
 * - RealtimeVisionValidationInput - The input type for the validateImageForObject function.
 * - RealtimeVisionValidationOutput - The return type for the validateImageForObject function.
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
  confidence: z.number().min(0).max(1).describe('The estimated confidence score (0-1) of the detection. This is an estimate by the AI.'),
});

const RealtimeVisionValidationOutputSchema = z.object({
  isValidImage: z.boolean().describe('True if the image is valid (e.g., well-lit, not blank, appears to be a real-world capture).'),
  isObjectFound: z.boolean().describe('True if the target object is detected with confidence greater than or equal to minConfidence.'),
  detectedObjects: z.array(DetectedObjectSchema).describe('A list of all objects detected in the image with their estimated confidence scores.'),
  errorMessage: z.string().optional().describe('An error message if validation failed, e.g., "Image is too dark."'),
});
export type RealtimeVisionValidationOutput = z.infer<typeof RealtimeVisionValidationOutputSchema>;

// Intermediate schema for what the LLM directly outputs.
// The flow will then process this to produce RealtimeVisionValidationOutput.
const LlvmDirectOutputSchema = z.object({
  isValidImage: z.boolean().describe('True if the image is clear, well-lit, not blank, and appears to be a real-world photograph rather than a digital image (like a screenshot or a solid color).'),
  imageQualityReason: z.string().optional().describe('If isValidImage is false, describe the quality issue (e.g., "too dark", "blank image", "appears to be a screenshot").'),
  detectedObjects: z.array(DetectedObjectSchema).describe('A list of all discernible objects in the image with their estimated confidence scores.'),
});

const visionRecognitionPrompt = ai.definePrompt({
  name: 'visionRecognitionPrompt',
  input: { schema: RealtimeVisionValidationInputSchema },
  output: { schema: LlvmDirectOutputSchema }, // LLM outputs this schema
  model: 'googleai/gemini-2.5-flash-image',
  prompt: [
    { text: `Analyze the provided image.

    1.  Determine if the image is a valid real-world photograph. It should be clear, well-lit, not blank, and should not appear to be a digital image (like a screenshot, a solid color, or a generated image). Set 'isValidImage' to true or false.
    2.  If 'isValidImage' is false, briefly describe the reason in 'imageQualityReason'.
    3.  Identify all discernible objects in the image and estimate a confidence score (from 0 to 1) for each detection. Populate the 'detectedObjects' array with these. The confidence score should reflect how sure you are about the object's identity and its clear visibility.
    
    The target object the user is looking for is: "{{{targetObject}}}"

    Output your response strictly as a JSON object conforming to the following schema:` },
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
    const { output: promptOutput } = await visionRecognitionPrompt(input);

    if (!promptOutput) {
      throw new Error('No structured output received from the vision recognition prompt.');
    }

    let isObjectFound = false;
    let errorMessage: string | undefined;

    if (!promptOutput.isValidImage) {
      errorMessage = promptOutput.imageQualityReason || 'The captured image is invalid (e.g., too dark, blank, or not a real-world photo).';
    } else {
      // Check for target object with minimum confidence
      const targetObjectNameLower = input.targetObject.toLowerCase();
      const foundTarget = promptOutput.detectedObjects.find(
        obj => obj.label.toLowerCase().includes(targetObjectNameLower) && obj.confidence >= input.minConfidence
      );

      if (foundTarget) {
        isObjectFound = true;
      } else {
        errorMessage = `Could not find "${input.targetObject}" with sufficient confidence (${(input.minConfidence * 100).toFixed(0)}%). Detected objects: ${promptOutput.detectedObjects.map(o => `${o.label} (${(o.confidence * 100).toFixed(0)}%)`).join(', ') || 'None'}.`;
      }
    }

    return {
      isValidImage: promptOutput.isValidImage,
      isObjectFound: isObjectFound,
      detectedObjects: promptOutput.detectedObjects,
      errorMessage: errorMessage,
    };
  }
);
