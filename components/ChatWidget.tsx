"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  User, 
  Bot,
  Phone,
  Mail
} from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! Welcome to SwiftCargo. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Thank you for your message! Our team will get back to you within 2 hours.",
        "I understand your inquiry. Let me connect you with our logistics specialist.",
        "That's a great question! Our team can provide detailed information about that service.",
        "I'll forward your request to our customer service team right away.",
        "Thank you for contacting SwiftCargo. We're here to help with all your logistics needs."
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: messages.length + 2,
        type: "bot" as const,
        content: randomResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 w-16 h-16 bg-gradient rounded-full flex items-center justify-center shadow-glow z-50"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 left-8 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-border/50 z-40 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">SwiftCargo Support</h3>
                    <p className="text-xs text-white/80">Usually responds in minutes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user" 
                        ? "bg-primary text-white" 
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {message.type === "user" ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Bot className="w-3 h-3" />
                      )}
                    </div>
                    <div className={`rounded-lg px-3 py-2 ${
                      message.type === "user"
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === "user" ? "text-white/70" : "text-slate-500"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-slate-600" />
                    </div>
                    <div className="bg-slate-100 rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-t border-border/50">
              <div className="flex space-x-2 mb-3">
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-700 hover:bg-slate-200 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-700 hover:bg-slate-200 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
