"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, X, Sparkles, ShoppingCart, Star, Clock } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'product' | 'quick-reply';
  productId?: string;
}

interface QuickReply {
  id: string;
  text: string;
  action: string;
}

const quickReplies: QuickReply[] = [
  { id: "1", text: "Show me spices", action: "show_spices" },
  { id: "2", text: "Order status", action: "order_status" },
  { id: "3", text: "Shipping info", action: "shipping_info" },
  { id: "4", text: "Payment methods", action: "payment_methods" },
  { id: "5", text: "Contact support", action: "contact_support" },
  { id: "6", text: "Special offers", action: "special_offers" }
];

const products = [
  { id: "1", name: "Premium Black Pepper", price: 15000, image: "/1.png" },
  { id: "2", name: "Organic Cinnamon", price: 18000, image: "/2.png" },
  { id: "3", name: "Gourmet Nutmeg", price: 22000, image: "/3.png" },
  { id: "4", name: "Cardamom Supreme", price: 28000, image: "/4.png" },
  { id: "5", name: "Saffron Gold", price: 55000, image: "/5.png" }
];

export default function AIChatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Emmy, your AI spice assistant. How can I help you today? 🌶️",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const simulateTyping = async (text: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + text.length * 50));
    setIsTyping(false);
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('spice') || lowerMessage.includes('product') || lowerMessage.includes('show')) {
      return "Here are our premium spices! Each one is carefully sourced and tested for quality. Which one interests you most?";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Our prices range from 15,000 RWF to 55,000 RWF depending on the spice. Premium spices like Saffron are more expensive due to their rarity and quality.";
    } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return "We offer fast delivery across Rwanda! Standard shipping takes 2-3 days, express delivery is available for same-day delivery in Kigali. International shipping is also available.";
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return "We accept Flutterwave payments, mobile money (MTN, Airtel), and cash on delivery. All online payments are secure and encrypted.";
    } else if (lowerMessage.includes('quality') || lowerMessage.includes('organic')) {
      return "All our spices are premium quality, many are organic and sourced directly from local farmers. We have strict quality control processes to ensure the best taste and freshness.";
    } else if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
      return "To track your order, please provide your order number. You can also check your order status in your account dashboard.";
    } else {
      return "I'm here to help with any questions about our spices, ordering, shipping, or payments. What would you like to know more about?";
    }
  };

  const handleQuickReply = async (action: string) => {
    const quickReplyText = quickReplies.find(qr => qr.action === action)?.text || "";
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: quickReplyText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate AI response
    setIsLoading(true);
    const response = await generateAIResponse(action);
    setIsLoading(false);
    
    await simulateTyping(response);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    
    // Generate AI response
    setIsLoading(true);
    const response = await generateAIResponse(inputText);
    setIsLoading(false);
    
    await simulateTyping(response);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-8 right-8 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <Bot className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold">Emmy AI Assistant</h3>
                    <p className="text-xs opacity-90">Online • Smart & Helpful</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <Bot className="w-4 h-4 mt-1 text-green-600" />
                      )}
                      <div>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-green-600" />
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick Replies */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 pb-2"
              >
                <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <motion.button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply.action)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      {reply.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isTyping || isLoading}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping || isLoading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-full ${
                    inputText.trim() && !isTyping && !isLoading
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 