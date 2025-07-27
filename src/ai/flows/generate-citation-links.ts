'use server';

/**
 * @fileOverview This flow generates citation links for AI responses, referencing specific pages in the PDF.
 *
 * - generateCitationLinks - A function that takes an AI response and PDF page mapping and returns the response with citation links.
 * - GenerateCitationLinksInput - The input type for the generateCitationLinks function.
 * - GenerateCitationLinksOutput - The return type for the generateCitationLinks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCitationLinksInputSchema = z.object({
  response: z.string().describe('The AI generated response.'),
  pageMapping: z.record(z.string(), z.number()).describe('Mapping of content identifiers to page numbers in the PDF.'),
});
export type GenerateCitationLinksInput = z.infer<typeof GenerateCitationLinksInputSchema>;

const GenerateCitationLinksOutputSchema = z.string().describe('The AI response with citation links added as clickable buttons.');
export type GenerateCitationLinksOutput = z.infer<typeof GenerateCitationLinksOutputSchema>;

export async function generateCitationLinks(input: GenerateCitationLinksInput): Promise<GenerateCitationLinksOutput> {
  return generateCitationLinksFlow(input);
}

const generateCitationLinksFlow = ai.defineFlow(
  {
    name: 'generateCitationLinksFlow',
    inputSchema: GenerateCitationLinksInputSchema,
    outputSchema: GenerateCitationLinksOutputSchema,
  },
  async input => {
    //  Find all substrings of the form [ref:some_id]
    const regex = /\[ref:(.*?)\]/g;
    let match;
    let output = input.response;

    while ((match = regex.exec(input.response)) !== null) {
      const citationId = match[1];
      const pageNumber = input.pageMapping[citationId];

      if (pageNumber !== undefined) {
        const citationLink = `<button class="citation-button" data-page="${pageNumber}">Page ${pageNumber}</button>`;
        // Replace the citation id with the citation link
        output = output.replace(match[0], citationLink);
      }
    }

    return output;
  }
);
