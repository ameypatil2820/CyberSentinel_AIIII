import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Bot, User, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export function AIAssistant() {
  const { getAuthHeaders } = useAuth();
  const { fetchData } = useData();
  const [messages, setMessages] = useState([
    {
      id: 'default',
      role: 'ai',
      content: 'Hello! I am your ABC Cyber Shield AI Assistant. I can help you analyze threats, explain vulnerabilities, or suggest security policies. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What are the top active threats right now?",
    "Explain CVE-2024-1024",
    "How to mitigate a phishing attack?",
    "Summarize yesterday's security events"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load chat history from backend on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/security/ai-chat/history`, {
          headers: getAuthHeaders()
        });
        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.data.length > 0) {
            // Map messages to include an ID if missing
            const mapped = resData.data.map((m, idx) => ({
              id: m._id || idx,
              role: m.role,
              content: m.content
            }));
            setMessages([
              {
                id: 'default',
                role: 'ai',
                content: 'Welcome back! Here is our security consultation history. How can I help you today?'
              },
              ...mapped
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    loadHistory();
  }, []);

  const handleSend = async (text) => {
    const query = text || input;
    if (!query.trim()) return;

    // Push user query immediately into local state
    const userMsgId = Date.now().toString();
    const userMessage = { id: userMsgId, role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/security/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ prompt: query })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        const aiReply = { id: Date.now().toString() + '-ai', role: 'ai', content: resData.data.reply };
        setMessages(prev => [...prev, aiReply]);
        // Refresh dashboard feeds in background in case triggers occurred
        fetchData();
      } else {
        const errReply = { 
          id: Date.now().toString() + '-err', 
          role: 'ai', 
          content: 'Sorry, I encountered an issue communicating with my analysis subsystem. Please try again.' 
        };
        setMessages(prev => [...prev, errReply]);
      }
    } catch (err) {
      console.error(err);
      const errReply = { 
        id: Date.now().toString() + '-err', 
        role: 'ai', 
        content: 'Connection issue. Please verify the security gateway is running.' 
      };
      setMessages(prev => [...prev, errReply]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Security Assistant</h1>
        <p className="text-slate-400 text-sm mt-1">Get intelligent insights and actionable recommendations.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden h-[calc(100vh-180px)]">
        <CardHeader className="border-b border-slate-800 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-brand-cyan" />
            Cyber Shield Copilot
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`hidden md:flex w-10 h-10 rounded-full items-center justify-center shrink-0 ${
                  msg.role === 'ai' ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-slate-800 text-slate-300'
                }`}>
                  {msg.role === 'ai' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>
                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-3 md:p-4 shadow-sm ${
                  msg.role === 'ai' 
                    ? 'bg-[#202c33] md:bg-slate-900/80 md:border border-slate-800 text-slate-200 rounded-tl-sm md:rounded-tl-none' 
                    : 'bg-[#005c4b] md:bg-brand-blue text-white rounded-tr-sm md:rounded-tr-none'
                }`}>
                  <p className="text-[14px] md:text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 md:gap-4">
                <div className="hidden md:flex w-10 h-10 rounded-full bg-brand-cyan/20 text-brand-cyan items-center justify-center shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="bg-[#202c33] md:bg-slate-900/80 md:border border-slate-800 rounded-2xl rounded-tl-sm md:rounded-tl-none p-3 md:p-4 flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md">
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-brand-cyan border border-slate-700 hover:border-brand-cyan transition-colors rounded-full px-3 py-1 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> {q}
                </button>
              ))}
            </div>
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2 items-end"
            >
              <div className="flex-1 bg-slate-800 rounded-2xl md:rounded-lg overflow-hidden">
                <Input 
                  placeholder="Message AI Assistant..." 
                  className="w-full bg-transparent border-0 focus:ring-0 px-4 py-3"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <Button type="submit" variant="cyan" className="rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0" disabled={!input.trim() || isTyping}>
                <Send className="w-5 h-5 ml-1" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
