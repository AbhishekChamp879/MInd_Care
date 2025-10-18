import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import {
  Send,
  MessageCircle,
  AlertTriangle,
  Heart,
  Clock,
  CheckCircle,
  Phone,
  Shield,
  Sparkles,
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high' | 'crisis';
  suggestions?: string[];
}

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mindbuddy_messages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("mindbuddy_messages", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = (smooth = true) => {
    const endEl = messagesEndRef.current;
    if (!endEl) return;

    let node: HTMLElement | null = endEl.parentElement as HTMLElement | null;
    while (node) {
      try {
        const style = window.getComputedStyle(node);
        const overflowY = style.overflowY;
        const el = node as HTMLElement & { scrollTo?: (options?: ScrollToOptions) => void };
        const isScrollable = el.scrollHeight > el.clientHeight;

        if (isScrollable && (overflowY === 'auto' || overflowY === 'scroll')) {
          if (typeof el.scrollTo === 'function') {
            el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
          } else {
            el.scrollTop = el.scrollHeight;
          }
          return;
        }
      } catch (e) {}
      node = node.parentElement as HTMLElement | null;
    }
  };

  const handleSendMessage = async (text?: string) => {
    const messageToSend = text ?? inputText;
    if (!messageToSend.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: messageToSend, sender: 'user', timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: data.id,
        text: data.text,
        sender: 'ai',
        timestamp: new Date(data.timestamp),
        severity: data.severity,
        suggestions: data.suggestions
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, I couldn't process your message. Try again.",
        sender: 'ai',
        timestamp: new Date(),
        severity: 'low'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'crisis':
        return 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/80 to-red-100/60';
      case 'high':
        return 'border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50/80 to-orange-100/60';
      case 'medium':
        return 'border-l-4 text-black border-l-yellow-300 bg-gradient-to-r from-yellow-50/80 to-yellow-100/60'; // lighter yellow for better visibility
      default:
        return 'border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-primary/10';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'crisis':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Heart className="h-4 w-4 text-secondary" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-5xl">
        {/* Chat interface */}
        <Card className="enhanced-card slide-up mb-4 sm:mb-6">
          <CardHeader className="border-b border-border/40 bg-gradient-to-r from-background to-background/80 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg text-heading">
                    AI Mental Health Assistant
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Secure & confidential conversation
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg p-3 ${msg.sender === 'user' ? 'bg-primary/20 text-primary' : getSeverityColor(msg.severity)}`}>
                      {msg.sender === 'ai' && msg.severity && msg.severity !== 'low' && (
                        <div className="flex items-center space-x-1 mb-2">
                          {getSeverityIcon(msg.severity)}
                          <span className="text-xs">{msg.severity} priority</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                      {msg.suggestions && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {msg.suggestions.map((sug, i) => (
                            <Button key={i} variant="outline" size="sm" onClick={() => handleSendMessage(sug)}>
                              {sug}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start group fade-in">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 shadow-soft flex-shrink-0">
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-secondary animate-pulse" />
                      </div>
                      <div className="bg-gradient-to-br from-background to-background/80 border border-border/40 rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-soft flex items-center space-x-2 sm:space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          MindBuddy is analyzing...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="flex space-x-2 p-4 border-t border-border/40">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={() => handleSendMessage()} disabled={!inputText.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIChat;
