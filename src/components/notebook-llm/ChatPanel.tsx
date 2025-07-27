"use client";

import { useState, useRef, useEffect } from 'react';
import type { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bot, Book, Loader2, File, X, Sparkles, MessageCircle, BookOpen } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onCitationClick: (page: number) => void;
}

const ChatMessage = ({ message, onCitationClick }: { message: Message; onCitationClick: (page: number) => void }) => {
  const isAssistant = message.role === 'assistant';

  const renderContent = (content: string) => {
    // Basic markdown-like rendering for bold and lists
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('- ')) {
          return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <strong key={i} className="font-semibold">{line.substring(2, line.length - 2)}</strong>;
        }
        return <p key={i} className="whitespace-pre-wrap">{line}</p>;
      });
  };

  const renderContentWithCitations = (content: string, citations?: number[]) => {
    return (
      <div className="space-y-3">
        <div className="prose prose-sm max-w-none text-inherit">{renderContent(content)}</div>
        {citations && citations.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-border/30">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <BookOpen className="w-4 h-4" /> 
              <span>Sources:</span>
            </div>
            {citations.map((page, i) => (
              <Button
                key={i}
                variant="secondary"
                size="sm"
                className="h-7 text-xs font-medium bg-background/50 hover:bg-background/80 border border-border/50 transition-all duration-200 hover:scale-105"
                onClick={() => onCitationClick(page)}
              >
                <Book className="w-3 h-3 mr-1" />
                Page {page}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      'flex items-start gap-4 py-6 px-2 transition-all duration-300 hover:bg-muted/30 rounded-xl',
      isAssistant ? '' : 'justify-end'
    )}>
      {isAssistant && (
        <div className="relative">
          <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <AvatarFallback className="bg-transparent">
              <Bot className="w-5 h-5 text-white" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
        </div>
      )}
      <div
        className={cn(
          'max-w-2xl p-6 rounded-2xl shadow-md transition-all duration-300',
          isAssistant 
            ? 'bg-gradient-to-br from-muted/80 to-muted/60 border border-border/50 backdrop-blur-sm' 
            : 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25'
        )}
      >
        {renderContentWithCitations(message.content, message.citations)}
      </div>
      {!isAssistant && (
        <div className="relative">
          <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600">
            <AvatarFallback className="bg-transparent">
              <User className="w-5 h-5 text-white" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-background"></div>
        </div>
      )}
    </div>
  );
};

export const ChatPanel = ({ messages, isLoading, onSendMessage, onCitationClick }: ChatPanelProps) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <Card className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20 shadow-xl border-0 backdrop-blur-sm">
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-2 px-6 py-4">
            {messages.map((msg, index) => {
              // Special styling for the first message
              if (index === 0 && msg.role === 'assistant') {
                return (
                  <div key={msg.id} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-8 my-6 relative border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                    <div className="absolute top-4 right-4">
                      <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                    </div>
                    <div className="flex items-start gap-6">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                        <File className="w-8 h-8 text-white"/>
                      </div>
                      <div className="prose prose-sm max-w-none space-y-3 flex-1">
                        {msg.content.split('\n').map((line, i) => {
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return (
                              <h2 key={i} className="text-2xl font-bold !m-0 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {line.substring(2, line.length - 2)}
                              </h2>
                            );
                          }
                          if (line.startsWith('- ')) {
                            return (
                              <div key={i} className="flex items-start gap-3 !m-0">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-muted-foreground !m-0 leading-relaxed">
                                  "{line.substring(2)}"
                                </p>
                              </div>
                            );
                          }
                          return <p key={i} className="text-muted-foreground !m-0 leading-relaxed">{line}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                );
              }
              return <ChatMessage key={msg.id} message={msg} onCitationClick={onCitationClick} />;
            })}
            {isLoading && (
              <div className="flex items-start gap-4 py-6 px-2">
                <div className="relative">
                  <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <AvatarFallback className="bg-transparent">
                      <Bot className="w-5 h-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-background animate-pulse"></div>
                </div>
                <div className="max-w-md p-6 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/60 border border-border/50 backdrop-blur-sm shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-150"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-300"></div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-6 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="w-full space-y-4">
          {/* Quick suggestions when no messages */}
          {messages.length <= 1 && !isLoading && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Try asking:
              </span>
              {['Summarize this document', 'What are the key points?', 'Explain the main concepts'].map((suggestion, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-background/50 hover:bg-background transition-all duration-200 hover:scale-105"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="relative flex w-full items-end gap-3">
            <div className="relative flex-1">
              <Textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about this document..."
                className="flex-1 resize-none rounded-2xl border-2 border-border/50 py-4 px-6 pr-16 focus-visible:ring-primary/50 focus-visible:border-primary/50 bg-background/80 backdrop-blur-sm transition-all duration-200 min-h-[56px] max-h-32"
                rows={1}
                disabled={isLoading}
              />
              <div className="absolute right-4 bottom-4">
                <Button 
                  type="submit" 
                  size="icon" 
                  className={cn(
                    "rounded-xl w-10 h-10 transition-all duration-300 shadow-lg",
                    isTyping || input.trim() 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 scale-100" 
                      : "bg-muted scale-90"
                  )}
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className={cn("w-5 h-5 transition-transform duration-200", isTyping && "scale-110")} />
                  )}
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </form>
          
          <div className="text-xs text-muted-foreground text-center">
            Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> to send • <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift + Enter</kbd> for new line
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};