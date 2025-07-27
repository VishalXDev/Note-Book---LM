📓 NotebookLM Clone – Chat with Your PDFs

Built with ❤️ by **Vishal X Dwivedy**

---

NotebookLM Clone is a modern web-based application that lets you **upload large PDF files**, **view them inside the browser**, and **chat with them using AI** – all in one clean, intuitive interface.

Inspired by Google’s NotebookLM, this clone empowers you to interact with your documents like never before. Ask questions, get smart answers, and instantly jump to cited pages.

---

## 🚀 Features

- 📁 **Upload & View PDFs**  
  Seamlessly upload large PDF files and read them with a smooth in-app viewer.

- 💬 **Chat Interface**  
  Ask anything about your PDF. The AI understands context and gives accurate, concise answers.

- 🔖 **Smart Citations & Navigation**  
  Each response comes with clickable citations. Tap to scroll directly to the referenced PDF page.

---

## 🧰 Tech Stack

| Layer             | Technology |
|------------------|------------|
| Framework        | [Next.js 14+](https://nextjs.org/) (App Router) |
| Language         | [TypeScript](https://www.typescriptlang.org/) |
| UI Components    | [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) |
| AI Integration   | [Genkit (Google Gemini)](https://firebase.google.com/docs/genkit) |
| PDF Parsing      | [LlamaParse](https://github.com/run-llama/llama_parse) |
| File Storage     | [Firebase Storage](https://firebase.google.com/docs/storage) |

---

## 📦 Getting Started

### 1. Clone and Install Dependencies

```bash
npm install
2. Set Up Environment Variables
Create a .env.local file at the root and paste the following:

env
Copy
Edit
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# AI Keys
LLAMA_CLOUD_API_KEY=
GEMINI_API_KEY=
✅ You can find your Firebase config under Project Settings > General in Firebase Console.
🔑 Get your LlamaParse key from LlamaCloud.
🔐 Get your Gemini key from Google AI Studio.

3. Enable CORS for Firebase Storage
To allow PDFs to load from Firebase Storage, run this:

bash
Copy
Edit
gcloud storage buckets update gs://your-storage-bucket --cors-file=cors.json
Make sure you replace your-storage-bucket with your actual bucket name.

4. Start the Dev Server
bash
Copy
Edit
npm run dev
Visit 👉 http://localhost:9002

🌍 Deployment
You can deploy this app to:

Firebase App Hosting

Vercel

Netlify

Just make sure to add the same environment variables from .env.local in your deployment platform settings.

📌 Credits
Made with precision, creativity, and late-night debugging by
Vishal X Dwivedy

🧠 Reference
Inspired by the original Google NotebookLM concept.

Happy building! 🚀