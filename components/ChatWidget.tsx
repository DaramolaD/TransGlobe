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
import type { SiteBrand } from "@/lib/branding/types";

export default function ChatWidget({ brand }: { brand: SiteBrand }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: `Hello! Welcome to ${brand.name}. How can we help with your shipment today?`,
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
        `Thank you for contacting ${brand.name}. Our team will follow up on your request shortly.`
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
        className="fixed bottom-8 left-8 w-16 h-16 bg-ember-main hover:bg-ember-dark text-white rounded-full flex items-center justify-center shadow-glow z-50 transition-colors duration-200"
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
            className="fixed bottom-24 left-8 w-80 h-96 bg-graphite-mid rounded-2xl shadow-2xl border border-graphite-light/50 z-40 flex flex-col"
          >
            {/* Header */}
            <div className="bg-graphite-dark text-white p-4 rounded-t-2xl border-b border-graphite-light/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-ember-main rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{brand.name} Support</h3>
                    <p className="text-[10px] text-platinum-mid">Usually responds in minutes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 bg-graphite-light/50 rounded-full flex items-center justify-center hover:bg-graphite-light text-platinum-light transition-colors"
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
                        ? "bg-ember-main text-white" 
                        : "bg-graphite-dark text-white border border-graphite-light/30"
                    }`}>
                      {message.type === "user" ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Bot className="w-3 h-3" />
                      )}
                    </div>
                    <div className={`rounded-lg px-3 py-2 ${
                      message.type === "user"
                        ? "bg-ember-main text-white shadow-sm"
                        : "bg-graphite-dark border border-graphite-light/30 text-platinum-light"
                    }`}>
                      <p className="text-xs leading-relaxed">{message.content}</p>
                      <p className={`text-[10px] mt-1 ${
                        message.type === "user" ? "text-white/70" : "text-platinum-mid"
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
                    <div className="w-6 h-6 bg-graphite-dark border border-graphite-light/30 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-graphite-dark border border-graphite-light/30 rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-platinum-mid rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-platinum-mid rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-platinum-mid rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-t border-graphite-light/20">
              <div className="flex space-x-2 mb-1">
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-graphite-dark hover:bg-graphite-light border border-graphite-light/30 rounded-lg text-xs text-platinum-light hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Us</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-graphite-dark hover:bg-graphite-light border border-graphite-light/30 rounded-lg text-xs text-platinum-light hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-graphite-light/20">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 bg-graphite-dark border border-graphite-light/30 text-white placeholder-platinum-mid rounded-lg focus:ring-1 focus:ring-ember-main focus:border-transparent transition-all text-xs outline-none"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="px-3 py-2 bg-ember-main text-white rounded-lg hover:bg-ember-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
