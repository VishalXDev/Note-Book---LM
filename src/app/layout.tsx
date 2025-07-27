import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'NotebookLM – AI-Powered PDF Analysis',
  description: 'Transform your PDF documents into interactive conversations. Upload, analyze, and chat with your documents using advanced AI technology.',
  keywords: 'PDF, AI, chat, document analysis, machine learning, text extraction, question answering',
  authors: [{ name: 'NotebookLM Team' }],
  creator: 'NotebookLM',
  publisher: 'NotebookLM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://notebooklm.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NotebookLM – AI-Powered PDF Analysis',
    description: 'Transform your PDF documents into interactive conversations. Upload, analyze, and chat with your documents using advanced AI.',
    url: 'https://notebooklm.ai',
    siteName: 'NotebookLM',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NotebookLM - AI PDF Analysis Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotebookLM – AI-Powered PDF Analysis',
    description: 'Transform your PDF documents into interactive conversations with AI.',
    images: ['/og-image.png'],
    creator: '@notebooklm',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  other: {
    'theme-color': '#3b82f6',
    'color-scheme': 'light dark',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'NotebookLM',
    'application-name': 'NotebookLM',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Enhanced favicon and app icons */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Enhanced font loading with display=swap for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Performance and security optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="origin-when-cross-origin" />
        
        {/* Progressive Web App support */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NotebookLM" />
        
        {/* Enhanced color scheme and theming */}
        <meta name="color-scheme" content="light dark" />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --color-primary: 59 130 246;
              --color-background: 255 255 255;
              --color-foreground: 15 23 42;
            }
            
            @media (prefers-color-scheme: dark) {
              :root {
                --color-background: 2 6 23;
                --color-foreground: 248 250 252;
              }
            }
            
            /* Prevent flash of unstyled content */
            html {
              background: rgb(var(--color-background));
              color: rgb(var(--color-foreground));
            }
            
            /* Enhanced loading animation */
            .loading-gradient {
              background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4);
              background-size: 300% 300%;
              animation: gradient-shift 3s ease infinite;
            }
            
            @keyframes gradient-shift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            /* Smooth transitions for theme changes */
            * {
              transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            }
            
            /* Custom scrollbar styling */
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            
            ::-webkit-scrollbar-track {
              background: transparent;
            }
            
            ::-webkit-scrollbar-thumb {
              background: rgba(var(--color-primary), 0.3);
              border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: rgba(var(--color-primary), 0.5);
            }
            
            /* Enhanced focus styles for accessibility */
            :focus-visible {
              outline: 2px solid rgb(var(--color-primary));
              outline-offset: 2px;
              border-radius: 4px;
            }
            
            /* Reduced motion preferences */
            @media (prefers-reduced-motion: reduce) {
              *,
              *::before,
              *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            }
          `
        }} />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "NotebookLM",
              "description": "AI-powered PDF analysis and chat assistant",
              "url": "https://notebooklm.ai",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "NotebookLM Team"
              }
            })
          }}
        />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary-foreground">
        {/* Loading indicator for slow connections */}
        <noscript>
          <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">JavaScript is required to run NotebookLM</p>
            </div>
          </div>
        </noscript>
        
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Skip to main content
        </a>
        
        {/* Main application container */}
        <div id="main-content" className="relative">
          {children}
        </div>
        
        {/* Enhanced toast notifications */}
        <Toaster />
        
        {/* Performance monitoring */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Monitor Core Web Vitals
            if (typeof window !== 'undefined') {
              window.addEventListener('load', () => {
                if ('performance' in window) {
                  // Log performance metrics for debugging
                  const perfData = performance.getEntriesByType('navigation')[0];
                  if (perfData && process.env.NODE_ENV === 'development') {
                    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                  }
                }
              });
            }
          `
        }} />
      </body>
    </html>
  );
}