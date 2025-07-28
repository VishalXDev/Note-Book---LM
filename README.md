📓 NotebookLM Clone – Chat with Your PDFs

Built with ❤️ by **Vishal X Dwivedy**

[🌐 Live Demo](https://note-book-lm-gamma.vercel.app/)

NotebookLM Clone is a modern web-based application that lets you **upload large PDF files**, **view them inside the browser**, and **chat with them using AI** – all in one clean, intuitive interface.

Inspired by Google’s NotebookLM, this clone empowers you to interact with your documents like never before. Ask questions, get smart answers, and instantly jump to cited pages.

---

## 🚀 Features

### 📁 Upload & View PDFs  
Seamlessly upload large PDF files and read them with a smooth in-app viewer.

### 💬 Chat Interface  
Ask anything about your PDF. The AI understands context and gives accurate, concise answers.

### 🔖 Smart Citations & Navigation  
Each response comes with clickable citations. Tap to scroll directly to the referenced PDF page.

---

## 🧰 Tech Stack

| Layer         | Technology                     |
| ------------- | ------------------------------ |
| Framework     | Next.js 14+ (App Router)       |
| Language      | TypeScript                     |
| UI Components | shadcn/ui + Tailwind CSS       |
| AI Integration| Genkit (Google Gemini)         |
| PDF Parsing   | LlamaParse                     |
| File Storage  | Firebase Storage               |

---

## 📦 Getting Started

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/VishalXDev/Note-Book---LM.git
cd Note-Book---LM
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
🔑 Get your Firebase config from Firebase Console > Project Settings > General

🧠 Get your LlamaParse API key from LlamaCloud

🤖 Get your Gemini API key from Google AI Studio

3. Enable CORS for Firebase Storage
Run this command to allow PDFs to load from Firebase Storage:

bash
Copy
Edit
gcloud storage buckets update gs://your-storage-bucket --cors-file=cors.json
Replace your-storage-bucket with your actual Firebase Storage bucket name.

4. Start the Dev Server
bash
Copy
Edit
npm run dev
Visit your local dev server: http://localhost:9002

🌍 Deployment
You can deploy this app to:

🔥 Firebase Hosting

▲ Vercel

🌐 Netlify

Make sure to copy your .env.local variables into your deployment platform's environment settings.

📌 Credits
Made with precision, creativity, and late-night debugging by
Vishal X Dwivedy

🧠 Reference
Inspired by the original Google NotebookLM concept.

🔗 Live Demo
👉 https://note-book-lm-gamma.vercel.app/

Happy building! 🚀
