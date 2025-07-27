"use client";

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, Loader2, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload = ({ onFileUpload, isProcessing }: FileUploadProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isProcessing) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(timer);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isProcessing]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div
        className={cn(
          'w-full max-w-2xl rounded-2xl text-center relative z-10 transition-all duration-500',
          !isProcessing && 'cursor-pointer hover:scale-105'
        )}
      >
        <Card className={cn(
          "bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl rounded-2xl border-0 transition-all duration-500",
          isDragActive && "ring-4 ring-blue-500/50 shadow-blue-500/25",
          !isProcessing && "hover:shadow-3xl hover:bg-white/90 dark:hover:bg-slate-800/90"
        )}>
          <CardContent className="p-16">
            {!isProcessing ? (
              <div {...getRootProps({
                className: 'outline-none'
              })}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-8">
                  {/* Enhanced icon with animation */}
                  <div className={cn(
                    "relative w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-all duration-300",
                    isDragActive ? "scale-110 rotate-6" : "hover:scale-105"
                  )}>
                    <UploadCloud className="w-12 h-12 text-white" />
                    {isDragActive && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 animate-ping opacity-75"></div>
                    )}
                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
                  </div>

                  {/* Enhanced title with gradient */}
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                      NotebookLM
                    </h1>
                    <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                      AI-Powered PDF Chat Assistant
                    </h2>
                  </div>

                  {/* Enhanced description */}
                  <div className="space-y-3">
                    <p className={cn(
                      "text-lg font-medium transition-colors duration-200",
                      isDragActive 
                        ? "text-blue-600 dark:text-blue-400" 
                        : "text-slate-600 dark:text-slate-300"
                    )}>
                      {isDragActive ? "Drop your PDF here!" : "Upload your PDF to start an intelligent conversation"}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Click here or drag & drop • PDF files only • Max 10MB
                    </p>
                  </div>

                  {/* Feature highlights */}
                  <div className="flex items-center justify-center gap-6 pt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <FileText className="w-4 h-4" />
                      <span>Smart Analysis</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Insights</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-8 text-center">
                {/* Enhanced loading state */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse opacity-50"></div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                    Processing Your PDF
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Analyzing content and preparing for conversation...
                  </p>
                </div>

                {/* Enhanced progress bar */}
                <div className="w-full space-y-3 max-w-md">
                  <div className="relative">
                    <Progress 
                      value={progress} 
                      className="w-full h-3 bg-slate-200 dark:bg-slate-700" 
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-pulse"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Uploading and processing...
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Processing steps indicator */}
                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    progress > 20 ? "bg-green-500" : "bg-slate-300"
                  )}></div>
                  <span>Upload</span>
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    progress > 60 ? "bg-green-500" : progress > 20 ? "bg-blue-500 animate-pulse" : "bg-slate-300"
                  )}></div>
                  <span>Process</span>
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    progress > 90 ? "bg-green-500" : progress > 60 ? "bg-blue-500 animate-pulse" : "bg-slate-300"
                  )}></div>
                  <span>Ready</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};