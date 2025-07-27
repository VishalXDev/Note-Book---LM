'use server';

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import fetch from 'node-fetch';

const PdfDataExtractionInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe("Base64 PDF Data URI (data:application/pdf;base64,...)"),
});
export type PdfDataExtractionInput = z.infer<typeof PdfDataExtractionInputSchema>;

const PdfDataExtractionOutputSchema = z.object({
  extractedText: z.string().describe('Extracted markdown text from PDF'),
});
export type PdfDataExtractionOutput = z.infer<typeof PdfDataExtractionOutputSchema>;

// ✅ Add type for API response
type LlamaParseResponse = {
  documents?: { text: string }[];
};

export const pdfDataExtractionFlow = ai.defineFlow(
  {
    name: 'pdfDataExtractionFlow',
    inputSchema: PdfDataExtractionInputSchema,
    outputSchema: PdfDataExtractionOutputSchema,
  },
  async (input): Promise<PdfDataExtractionOutput> => {
    const apiKey = process.env.LLAMA_CLOUD_API_KEY;

    if (!apiKey) {
      throw new Error("LLAMA_CLOUD_API_KEY is not set in environment variables.");
    }

    const endpoint = "https://api.llamaindex.ai/api/parsing/upload";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: input.pdfDataUri,
          result_type: "markdown",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("LlamaParse API Error:", errorText);
        throw new Error(`LlamaParse API error: ${response.statusText}`);
      }

      // ✅ Now cast response to correct type
      const json = (await response.json()) as LlamaParseResponse;

      const extractedText = json.documents?.map((doc) => doc.text).join("\n\n") ?? "";
      return { extractedText };

    } catch (err: any) {
      console.error("Failed to fetch from LlamaParse API:", err.message);
      throw new Error(`Fetch failed: ${err.message}`);
    }
  }
);
