"use client";

import { useState, useEffect } from "react";
import type { Message } from "@/types";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { pdfDataExtractionFlow } from "@/ai/flows/pdf-data-extraction";
import { pdfQuestionAnswering } from "@/ai/flows/pdf-question-answering";

import { FileUpload } from "@/components/notebook-llm/FileUpload";
import { PdfViewer } from "@/components/notebook-llm/PdfViewer";
import { ChatPanel } from "@/components/notebook-llm/ChatPanel";
import { Button } from "@/components/ui/button";
import {
  FileUp,
  Sparkles,
  Brain,
  FileText,
  MessageSquare,
  Clock,
  Users,
} from "lucide-react";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPublicUrl, setPdfPublicUrl] = useState<string | null>(null);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (pdfFile && !sessionStartTime) {
      setSessionStartTime(new Date());
    }
  }, [pdfFile, sessionStartTime]);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a valid PDF file.",
      });
      return;
    }
    setPdfFile(file);
    setIsProcessingPdf(true);
    setMessages([]);

    try {
      // 1. Upload to Firebase Storage
      const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      setPdfPublicUrl(downloadUrl);

      // 2. Extract text with LlamaParse via Genkit flow
      const pdfDataUri = await fileToDataUri(file);
      const result = await pdfDataExtractionFlow({ pdfDataUri });
      setPdfText(result.extractedText);

      const initialMessageContent = `**Your document is ready!**

You can now ask questions about your document. For example:
- "What is the main topic of this document?"
- "Can you summarize the key points?"
- "What are the conclusions or recommendations?"
      `;

      setMessages([
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: initialMessageContent,
        },
      ]);

      toast({
        title: "PDF Processed Successfully",
        description: "Your document is ready for analysis and questions.",
      });
    } catch (error: any) {
      console.error("Error processing PDF:", error);
      toast({
        variant: "destructive",
        title: "PDF Processing Failed",
        description:
          error.code === "storage/retry-limit-exceeded"
            ? "The connection to storage timed out. Please check your network and try again."
            : "There was an error processing the PDF. Please ensure your LlamaParse and Firebase configurations are correct.",
      });
      setPdfFile(null);
      setPdfPublicUrl(null);
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!pdfText) {
      toast({
        variant: "destructive",
        title: "No PDF Loaded",
        description: "Please upload a PDF before asking questions.",
      });
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await pdfQuestionAnswering({
        pdfText,
        question: content,
      });
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
        citations: result.pageCitations,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error answering question:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Sorry, I encountered an error trying to answer your question. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitationClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleNewUpload = () => {
    setPdfFile(null);
    setPdfText(null);
    setPdfPublicUrl(null);
    setMessages([]);
    setCurrentPage(1);
    setSessionStartTime(null);
  };

  if (!pdfFile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
        <FileUpload
          onFileUpload={handleFileUpload}
          isProcessing={isProcessingPdf}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-foreground font-body">
      {/* Enhanced Header */}
      <header className="flex items-center justify-between p-6 border-b border-border/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                {/* Fixed Image with fallback */}
                {!imageError ? (
                  <Image
                    src="/pdflogo.png"
                    alt="NotebookLM Logo"
                    width={24}
                    height={24}
                    className="filter brightness-0 invert"
                    onError={() => setImageError(true)}
                    priority
                    unoptimized={process.env.NODE_ENV === "development"}
                  />
                ) : (
                  // Fallback icon if image fails to load
                  <FileText className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse">
                <Brain className="w-2 h-2 text-white ml-0.5 mt-0.5" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-headline">
                NotebookLM
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                AI-Powered Document Analysis
              </p>
            </div>
          </div>

          <div className="h-8 w-px bg-border/50" />

          {/* Document Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground block max-w-48 truncate">
                {pdfFile.name}
              </span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatFileSize(pdfFile.size)}</span>
                <span>•</span>
                <span>{messages.length - 1} questions asked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Stats & Actions */}
        <div className="flex items-center gap-4">
          {sessionStartTime && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>
                Session:{" "}
                {Math.floor((Date.now() - sessionStartTime.getTime()) / 60000)}m
              </span>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleNewUpload}
            className="bg-background/50 hover:bg-background/80 border-border/50 backdrop-blur-sm transition-all duration-200 hover:scale-105"
          >
            <FileUp className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Upload New PDF</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 min-h-0 max-w-7xl mx-auto w-full">
        {/* Chat Panel */}
        <div className="h-full min-h-[60vh] lg:h-full lg:min-h-0 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
          <div className="relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 overflow-hidden">
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-muted-foreground">
                AI Assistant
              </span>
            </div>
            <div className="pt-12 h-full">
              <ChatPanel
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onCitationClick={handleCitationClick}
              />
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="h-full min-h-[60vh] lg:h-full lg:min-h-0 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
          <div className="relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 overflow-hidden">
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-muted-foreground">
                Document Viewer
              </span>
            </div>
            <div className="pt-12 h-full">
              <PdfViewer fileUrl={pdfPublicUrl} currentPage={currentPage} />
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Status Bar */}
      <footer className="px-6 py-3 border-t border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Document processed & ready</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3 h-3" />
              <span>{messages.length} total messages</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3" />
              <span>Page {currentPage} active</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              <span>Powered by AI</span>
            </div>
            <span>•</span>
            <span>Real-time analysis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
