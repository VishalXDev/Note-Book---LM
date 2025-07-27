import { config } from 'dotenv';
config();

import '@/ai/genkit'; // ✅ Load Genkit config first
import '@/ai/flows/pdf-question-answering';
import '@/ai/flows/pdf-data-extraction';
import '@/ai/flows/generate-citation-links'; // optional
