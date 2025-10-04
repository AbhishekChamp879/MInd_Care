import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import {
  Send,
  Bot,
  User,
  MessageCircle,
  AlertTriangle,
  Heart,
  Clock,
  CheckCircle,
  Loader2,
  Phone,
  Shield,
  Sparkles,
  Zap,
  Brain,
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
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (!sessionStarted) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: `Hello ${user?.name.split(' ')[0]}! I'm MindBuddy AI, your personal mental health assistant. I'm here to provide support, listen to your concerns, and help you navigate through any challenges. How are you feeling today?`,
        sender: 'ai',
        timestamp: new Date(),
        severity: 'low',
        suggestions: [
          "I'm feeling anxious about exams",
          "I've been having trouble sleeping",
          'I feel overwhelmed with coursework',
          "I'm feeling lonely on campus",
        ],
      };
      setMessages([welcomeMessage]);
      setSessionStarted(true);
    }
  }, [user, sessionStarted]);

  // AI Response Generator
  const generateAIResponse = (userMessage: string): Message => {
    const messageId = Date.now().toString();
    let response = '';
    let severity: 'low' | 'medium' | 'high' | 'crisis' = 'low';
    let suggestions: string[] = [];

    // Crisis detection keywords
    const crisisKeywords = [
      'suicide',
      'kill myself',
      'end it all',
      'not worth living',
      'harm myself',
      'give up',
    ];
    const highSeverityKeywords = [
      'panic attack',
      "can't cope",
      'breakdown',
      'hopeless',
      'desperate',
    ];
    const mediumSeverityKeywords = [
      'anxious',
      'depressed',
      'stressed',
      'worried',
      'scared',
      'overwhelmed',
    ];

    const lowerMessage = userMessage.toLowerCase();

    // Check for crisis indicators
    if (crisisKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      severity = 'crisis';
      response = `I'm very concerned about what you're sharing with me. Your safety is the most important thing right now. Please know that you're not alone and there are people who want to help you immediately.

🚨 **Immediate Support Available:**
- National Crisis Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Campus Counseling Center: Available 24/7

Would you like me to help connect you with immediate professional support? You matter, and there are trained counselors ready to help you through this difficult time.`;

      suggestions = [
        'Yes, please connect me with crisis support',
        'I want to talk to someone right now',
        'Help me find campus resources',
      ];
    }
    // High severity response
    else if (highSeverityKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      severity = 'high';
      response = `I can hear that you're going through a really difficult time right now. What you're experiencing sounds overwhelming, and it's completely understandable to feel this way.

**Immediate steps you can take:**
• Take slow, deep breaths (4 seconds in, 6 seconds out)
• Try to ground yourself: Name 5 things you can see, 4 you can touch, 3 you can hear
• Remember that intense feelings are temporary and will pass

Would you like to talk more about what's happening? I'm here to listen and support you through this.`;

      suggestions = [
        'Help me with breathing exercises',
        "I want to talk about what's bothering me",
        'Show me grounding techniques',
      ];
    }
    // Medium severity responses
    else if (mediumSeverityKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      severity = 'medium';

      if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
        response = `Anxiety can feel really overwhelming, but you're taking a positive step by reaching out. Anxiety is very common among students and is definitely treatable.

**Some helpful strategies:**
• Practice the 4-7-8 breathing technique
• Try progressive muscle relaxation
• Challenge anxious thoughts with evidence
• Establish a regular sleep and exercise routine

What specific situations tend to trigger your anxiety? Understanding your patterns can help us develop better coping strategies.`;

        suggestions = [
          'Tell me about breathing techniques',
          "I'm anxious about exams",
          'Help me challenge negative thoughts',
        ];
      } else if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelmed')) {
        response = `It sounds like you have a lot on your plate right now. Stress is a normal response, but when it becomes overwhelming, it's important to address it.

**Stress management techniques:**
• Break large tasks into smaller, manageable steps
• Practice time management and prioritization
• Take regular breaks (even 5-10 minutes helps)
• Try mindfulness or meditation apps
• Connect with friends and support systems

What's contributing most to your stress right now? Let's work together to find some practical solutions.`;

        suggestions = [
          'Help me organize my tasks',
          'I need study tips',
          'Show me relaxation techniques',
        ];
      } else {
        response = `Thank you for sharing that with me. I want you to know that what you're feeling is valid, and seeking support shows real strength.

Sometimes it helps to talk through what's on your mind. I'm here to listen without judgment and provide support in whatever way would be most helpful to you.

Is there something specific that's been weighing on you lately?`;

        suggestions = [
          'I want to talk about my feelings',
          'Help me understand my emotions',
          'Show me coping strategies',
        ];
      }
    }
    // General supportive responses
    else {
      const generalResponses = [
        `I appreciate you reaching out and sharing with me. It takes courage to talk about what's on your mind. 

Is there something specific you'd like to explore or discuss today? I'm here to provide support and practical strategies that might help.`,

        `Thank you for trusting me with your thoughts. Every student goes through challenges, and you're not alone in this journey.

What would be most helpful for you right now? Whether it's talking through a situation, learning coping techniques, or just having someone listen, I'm here for you.`,

        `I'm glad you're here and taking time to focus on your mental wellness. That's an important step in taking care of yourself.

How has your day been treating you? Sometimes it helps to check in with ourselves and acknowledge what we're experiencing.`,
      ];

      response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
      suggestions = [
        "I'd like some study tips",
        'Help me manage stress',
        'I want to talk about relationships',
        'Show me relaxation techniques',
      ];
    }

    return {
      id: messageId,
      text: response,
      sender: 'ai',
      timestamp: new Date(),
      severity,
      suggestions,
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(
      () => {
        const aiResponse = generateAIResponse(inputText);
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      },
      1500 + Math.random() * 1000
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'crisis':
        return 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/80 to-red-100/60';
      case 'high':
        return 'border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50/80 to-orange-100/60';
      case 'medium':
        return 'border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50/80 to-yellow-100/60';
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
        {/* Responsive Header - Matching MindBuddy Design */}
        <div className="text-center mb-6 sm:mb-8 fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6 group">
            <div className="relative">
              <div className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="absolute inset-0 bg-gradient-hero rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-heading mb-2">
                MindBuddy AI Support
              </h1>
              <div className="h-1 w-16 sm:w-20 bg-gradient-primary rounded-full mx-auto"></div>
            </div>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg mb-4 max-w-2xl mx-auto px-2 leading-relaxed">
            Your personal mental health companion, available 24/7. Safe, confidential, and designed
            specifically for student wellbeing.
          </p>
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
            <Badge
              variant="secondary"
              className="bg-gradient-primary text-white shadow-soft text-xs sm:text-sm"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="outline" className="border-primary/30 text-primary text-xs sm:text-sm">
              <Shield className="h-3 w-3 mr-1" />
              Confidential
            </Badge>
            <Badge
              variant="outline"
              className="border-secondary/30 text-secondary text-xs sm:text-sm"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Crisis Detection
            </Badge>
          </div>
        </div>

        {/* Responsive Main Chat Interface - Enhanced MindBuddy Styling */}
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
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <Badge
                  variant="secondary"
                  className="bg-gradient-primary text-white shadow-soft text-xs"
                >
                  <Heart className="h-2 w-2 sm:h-3 sm:w-3 mr-1 animate-pulse" />
                  Online
                </Badge>
                <div className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Responsive Messages Area with MindBuddy Styling */}
            <ScrollArea className="h-80 sm:h-96 lg:h-[32rem] p-3 sm:p-4 lg:p-6">
              <div className="space-y-4 sm:space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] lg:max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}
                    >
                      <div
                        className={`flex items-start space-x-2 sm:space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                      >
                        <div
                          className={`p-2 sm:p-3 rounded-full shadow-soft transition-all duration-300 group-hover:scale-110 flex-shrink-0 ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-br from-primary/20 to-primary/10'
                              : 'bg-gradient-to-br from-secondary/20 to-secondary/10'
                          }`}
                        >
                          {message.sender === 'user' ? (
                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                          ) : (
                            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-soft transition-all duration-300 group-hover:shadow-medium ${
                            message.sender === 'user'
                              ? 'bg-gradient-primary text-primary-foreground'
                              : `bg-gradient-to-br from-background to-background/80 border border-border/40 ${getSeverityColor(message.severity)}`
                          }`}
                        >
                          {message.sender === 'ai' &&
                            message.severity &&
                            message.severity !== 'low' && (
                              <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3 p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-background/50">
                                {getSeverityIcon(message.severity)}
                                <span className="text-xs font-medium capitalize text-heading">
                                  {message.severity === 'crisis'
                                    ? 'Immediate Support Needed'
                                    : `${message.severity} Priority Response`}
                                </span>
                              </div>
                            )}
                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                            {message.text}
                          </p>
                          <p className="text-xs opacity-70 mt-1 sm:mt-2 flex items-center">
                            <Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      {/* Responsive Suggestion Pills - Enhanced Styling */}
                      {message.suggestions && (
                        <div className="mt-3 sm:mt-4 ml-8 sm:ml-12 space-y-2 fade-in">
                          <p className="text-xs text-muted-foreground font-medium">
                            Quick responses:
                          </p>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-7 sm:h-8 px-2 sm:px-3 rounded-full border-primary/20 text-primary hover:bg-gradient-primary hover:text-white hover:border-transparent transition-all duration-300 hover:shadow-soft btn-enhanced"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                <span className="truncate max-w-[120px] sm:max-w-none">
                                  {suggestion}
                                </span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Responsive Enhanced Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start group fade-in">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 shadow-soft group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-secondary animate-pulse" />
                      </div>
                      <div className="bg-gradient-to-br from-background to-background/80 border border-border/40 rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-soft flex items-center space-x-2 sm:space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: '0.1s' }}
                          ></div>
                          <div
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          ></div>
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

            {/* Responsive Enhanced Input Area */}
            <div className="border-t border-border/40 p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-background to-background/50">
              <div className="flex space-x-2 sm:space-x-3">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Share what's on your mind... I'm here to listen and support you ❤️"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 rounded-xl sm:rounded-full border-primary/20 focus:border-primary focus:ring-primary/20 focus-enhanced transition-all duration-300 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="rounded-xl sm:rounded-full bg-gradient-primary hover:shadow-glow hover:scale-105 active:scale-95 transition-all duration-300 px-4 sm:px-6 btn-enhanced flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 sm:mt-3 text-center px-2">
                💬 Press Enter to send • 🔒 Your conversation is private and secure
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Enhanced Crisis Support Section */}
        <Card className="enhanced-card bg-gradient-to-br from-red-50/80 to-orange-50/80 border-red-200/60 shadow-soft hover:shadow-medium transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
                <div className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-red-100 to-red-200 shadow-soft flex-shrink-0">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-red-800 text-center sm:text-left">
                  Emergency Mental Health Support
                </h3>
              </div>
              <p className="text-red-700 text-sm leading-relaxed max-w-2xl mx-auto px-2">
                If you're experiencing a mental health crisis, having thoughts of self-harm, or need
                immediate support, please don't hesitate to reach out. You are not alone, and help
                is available 24/7.
              </p>
              <div className="flex flex-col gap-3 justify-center mt-6">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="destructive"
                    size="lg"
                    className="shadow-soft hover:shadow-medium btn-enhanced bg-gradient-to-r from-red-600 to-red-700 w-full sm:w-auto"
                  >
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Crisis Lifeline: 988
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-red-300 text-red-700 hover:bg-red-50 shadow-soft hover:shadow-medium btn-enhanced w-full sm:w-auto"
                  >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Crisis Text: HOME to 741741
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-red-200">
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-red-800 text-sm sm:text-base">
                    Campus Support
                  </h4>
                  <p className="text-xs sm:text-sm text-red-600 leading-relaxed">
                    Contact your campus counseling center for immediate assistance
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-red-800 text-sm sm:text-base">
                    24/7 Online Chat
                  </h4>
                  <p className="text-xs sm:text-sm text-red-600 leading-relaxed">
                    Crisis Text Line provides free, confidential support via text
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIChat;
