'use server';

import { z } from 'zod';

const PdfQuestionAnsweringInputSchema = z.object({
  pdfText: z
    .string()
    .describe('The text content of the PDF document, extracted via LlamaParse.'),
  question: z.string().describe('The question to ask about the PDF document.'),
});
export type PdfQuestionAnsweringInput = z.infer<typeof PdfQuestionAnsweringInputSchema>;

const PdfQuestionAnsweringOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the PDF document.'),
  pageCitations: z.array(z.number()).describe('The page numbers cited in the answer.'),
});
export type PdfQuestionAnsweringOutput = z.infer<typeof PdfQuestionAnsweringOutputSchema>;

export async function pdfQuestionAnswering(input: PdfQuestionAnsweringInput): Promise<PdfQuestionAnsweringOutput> {
  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1', // You can change model here
      messages: [
        {
          role: 'system',
          content: `You're a helpful assistant that answers questions based on PDF content and returns cited page numbers if possible.`,
        },
        {
          role: 'user',
          content: `Here is the PDF text:\n${input.pdfText}\n\nQuestion: ${input.question}\n\nReturn answer and any page numbers you refer to.`,
        },
      ],
    }),
  });

  const data = await response.json();

  const answer = data.choices?.[0]?.message?.content ?? 'No answer found.';

  // Basic page citation extraction from text (e.g., "page 2", "Page 5")
  const pageCitations: number[] = Array.from(new Set(
    [...answer.matchAll(/page\s+(\d+)/gi)].map(match => parseInt(match[1]))
  ));

  return {
    answer,
    pageCitations,
  };
}
