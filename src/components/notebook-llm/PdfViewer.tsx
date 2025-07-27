"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, FileText, Eye, Download, ZoomIn, ZoomOut, RotateCw, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfViewerProps {
  fileUrl: string | null;
  currentPage: number;
}

export const PdfViewer = ({ fileUrl, currentPage }: PdfViewerProps) => {
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!fileUrl) return;
    setLoading(true);
    const timeout = setTimeout(() => {
      setViewerUrl(`${fileUrl}#page=${currentPage}&toolbar=1&navpanes=1&scrollbar=1&view=FitH`);
      setLoading(false);
    }, 200); // Delay to allow animation

    return () => clearTimeout(timeout);
  }, [fileUrl, currentPage]);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!fileUrl) {
    return (
      <Card className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-xl">
        <div className="flex flex-col items-center gap-6 text-center p-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border-2 border-blue-200 dark:border-blue-800">
              <FileText className="w-10 h-10 text-blue-500 animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full border-2 border-background animate-bounce">
              <Eye className="w-3 h-3 text-white ml-0.5 mt-0.5" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">PDF Viewer Ready</h3>
            <p className="text-muted-foreground">Upload a PDF document to start viewing and analyzing</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Waiting for document...</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "h-full w-full overflow-hidden shadow-xl flex flex-col bg-white dark:bg-slate-900 border-0 transition-all duration-300 ease-in-out",
      isFullscreen && "fixed inset-0 z-50 rounded-none"
    )}>
      {/* Enhanced Header */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-background to-muted/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">PDF Document</h3>
              <p className="text-xs text-muted-foreground">Page {currentPage}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Viewer Controls */}
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <RotateCw className="h-4 w-4" />
              </Button>
              <div className="w-px h-4 bg-border mx-1"></div>
            </div>

            <Button size="sm" variant="ghost" onClick={handleFullscreen} className="h-8 w-8 p-0">
              <Maximize2 className="h-4 w-4" />
            </Button>
            
            <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0">
              <a href={fileUrl} download>
                <Download className="h-4 w-4" />
              </a>
            </Button>
            
            <Button asChild size="sm" variant="default" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md">
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Open External</span>
                <span className="sm:hidden">Open</span>
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 w-full h-full relative bg-slate-100 dark:bg-slate-800">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <Loader2 className="absolute -bottom-2 -right-2 w-6 h-6 animate-spin text-blue-500" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Loading PDF</p>
                <p className="text-sm text-muted-foreground">Navigating to page {currentPage}...</p>
              </div>
            </div>
          </div>
        )}
        
        <iframe
          key={viewerUrl}
          src={viewerUrl ?? ""}
          title="PDF Document Viewer"
          className={cn(
            "w-full h-full transition-opacity duration-500 ease-in-out border-0",
            loading ? "opacity-0" : "opacity-100"
          )}
          frameBorder="0"
          allowFullScreen
        />
        
        {/* Page Navigation Overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
          Page {currentPage}
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="px-4 py-2 border-t border-border/50 bg-muted/20 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Document loaded</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Interactive PDF viewer</span>
            <span>•</span>
            <span>Zoom, scroll & navigate enabled</span>
          </div>
        </div>
      </div>
    </Card>
  );
};