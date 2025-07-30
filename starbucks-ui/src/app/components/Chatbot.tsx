"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Package, 
  ShoppingCart, 
  Truck, 
  Star,
  Heart,
  Clock,
  CheckCircle,
  Mic,
  MicOff,
  Volume2
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "product" | "quick-reply";
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

const quickReplies = [
  { text: "🛒 Shop Now", action: "shop" },
  { text: "📦 Track Order", action: "track" },
  { text: "❓ Product Info", action: "products" },
  { text: "💰 Pricing", action: "pricing" },
  { text: "🚚 Shipping", action: "shipping" },
  { text: "💬 Contact Support", action: "support" }
];

const products = [
  {
    id: "1",
    name: "Premium Black Pepper",
    price: 15000,
    image: "/1.png"
  },
  {
    id: "2", 
    name: "Organic Cinnamon",
    price: 18000,
    image: "/2.png"
  },
  {
    id: "3",
    name: "Gourmet Nutmeg", 
    price: 22000,
    image: "/3.png"
  },
  {
    id: "4",
    name: "Cardamom Supreme",
    price: 28000,
    image: "/4.png"
  },
  {
    id: "5",
    name: "Saffron Gold",
    price: 55000,
    image: "/5.png"
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 👋 I'm Emmy, your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1000 + Math.random() * 1000);
  };

  const addMessage = (text: string, sender: "user" | "bot", type: "text" | "product" | "quick-reply" = "text", product?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type,
      product
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleQuickReply = (action: string) => {
    const replyText = quickReplies.find(r => r.action === action)?.text || "";
    addMessage(replyText, "user");

    simulateTyping(() => {
      switch (action) {
        case "shop":
          addMessage("Great! Let me show you our amazing products. You can browse our full catalog at /client. Here are some of our bestsellers:", "bot");
          products.slice(0, 3).forEach(product => {
            addMessage("", "bot", "product", product);
          });
          break;
        case "track":
          addMessage("To track your order, please provide your order number. You can also check your order status in your account dashboard.", "bot");
          break;
        case "products":
          addMessage("We offer premium spices from Rwanda including Black Pepper, Cinnamon, Nutmeg, Cardamom, and Saffron. Each product is carefully sourced and quality-tested.", "bot");
          break;
        case "pricing":
          addMessage("Our prices range from 15,000 RWF for Premium Black Pepper to 55,000 RWF for Saffron Gold. We also offer bulk discounts for distributors. Check out our pricing at /distributor", "bot");
          break;
        case "shipping":
          addMessage("We offer fast delivery across Rwanda and international shipping to over 100 countries. Standard delivery takes 2-3 business days. For international shipping, visit /international-shipping", "bot");
          break;
        case "support":
          addMessage("Our support team is available 24/7! You can reach us via WhatsApp at +250 123 456 789 or email at support@emmyspices.com", "bot");
          break;
      }
    });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addMessage(inputValue, "user");
    const userInput = inputValue.toLowerCase();
    setInputValue("");

    simulateTyping(() => {
      if (userInput.includes("hello") || userInput.includes("hi")) {
        addMessage("Hello! 👋 How can I assist you today? Feel free to ask about our products, shipping, or any other questions!", "bot");
      } else if (userInput.includes("price") || userInput.includes("cost")) {
        addMessage("Our premium spices range from 15,000 RWF to 55,000 RWF. For bulk orders and distributor pricing, visit our distributor portal!", "bot");
      } else if (userInput.includes("shipping") || userInput.includes("delivery")) {
        addMessage("🚚 We offer fast delivery across Rwanda (2-3 days) and international shipping to 100+ countries. For international orders, visit our shipping page!", "bot");
      } else if (userInput.includes("quality") || userInput.includes("premium")) {
        addMessage("✨ All our spices are premium quality, sourced from the finest farms in Rwanda. We have 99.9% customer satisfaction rate!", "bot");
      } else if (userInput.includes("order") || userInput.includes("track")) {
        addMessage("To track your order, please provide your order number. You can also check your order status in your account dashboard.", "bot");
      } else if (userInput.includes("contact") || userInput.includes("support")) {
        addMessage("📞 Our support team is here 24/7! WhatsApp: +250 123 456 789 | Email: support@emmyspices.com", "bot");
      } else if (userInput.includes("thank")) {
        addMessage("You're welcome! 😊 Is there anything else I can help you with?", "bot");
      } else if (userInput.includes("spice") || userInput.includes("product")) {
        addMessage("Here are our premium spices! Each one is carefully sourced and tested for quality. Which one interests you most?", "bot");
        // Show product recommendations
        setTimeout(() => {
          products.slice(0, 2).forEach(product => {
            addMessage("", "bot", "product", product);
          });
        }, 500);
      } else if (userInput.includes("bulk") || userInput.includes("distributor")) {
        addMessage("For bulk orders and distributor pricing, visit our distributor portal at /distributor. We offer special discounts for large orders!", "bot");
      } else if (userInput.includes("international") || userInput.includes("global")) {
        addMessage("We ship internationally to over 100 countries! Visit our international shipping page at /international-shipping for details and customs handling.", "bot");
      } else if (userInput.includes("payment") || userInput.includes("pay")) {
        addMessage("We accept Flutterwave payments, mobile money (MTN, Airtel), and cash on delivery. All online payments are secure and encrypted.", "bot");
      } else {
        addMessage("I'm here to help! You can ask me about our products, pricing, shipping, or use the quick reply buttons below.", "bot");
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        const voiceText = "I want to know about your premium spices";
        setInputValue(voiceText);
        setIsListening(false);
      }, 2000);
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 z-50 w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-green-500/50 transition-all duration-300 animate-float"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 left-8 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <motion.div 
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-t-2xl flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
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
                  <p className="text-xs text-green-100">Online • 24/7 Support</p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-xs ${message.sender === "user" ? "order-2" : "order-1"}`}>
                    {message.sender === "bot" && (
                      <motion.div
                        className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Bot className="w-4 h-4 text-green-600" />
                      </motion.div>
                    )}
                    
                                         <div className={`rounded-2xl px-4 py-2 ${
                       message.sender === "user" 
                         ? "bg-green-600 text-white" 
                         : "bg-gray-100 text-gray-800"
                     }`}>
                       {message.type === "product" && message.product ? (
                         <div className="flex items-center space-x-3">
                           <img 
                             src={message.product.image} 
                             alt={message.product.name}
                             className="w-12 h-12 rounded-lg object-cover"
                           />
                           <div>
                             <p className="font-medium">{message.product.name}</p>
                             <p className="text-sm text-green-600">{message.product.price.toLocaleString()} RWF</p>
                           </div>
                         </div>
                       ) : (
                         <div className="flex items-center justify-between">
                           <p className="text-sm">{message.text}</p>
                           {message.sender === "bot" && (
                             <motion.button
                               onClick={() => speakMessage(message.text)}
                               whileHover={{ scale: 1.1 }}
                               whileTap={{ scale: 0.9 }}
                               className="ml-2 p-1 text-gray-500 hover:text-green-600 transition-colors"
                             >
                               {isSpeaking ? (
                                 <motion.div
                                   animate={{ scale: [1, 1.2, 1] }}
                                   transition={{ duration: 0.5, repeat: Infinity }}
                                 >
                                   <Volume2 className="w-3 h-3" />
                                 </motion.div>
                               ) : (
                                 <Volume2 className="w-3 h-3" />
                               )}
                             </motion.button>
                           )}
                         </div>
                       )}
                     </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl px-4 py-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickReplies.map((reply, index) => (
                  <motion.button
                    key={reply.action}
                    onClick={() => handleQuickReply(reply.action)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {reply.text}
                  </motion.button>
                ))}
              </div>

                             {/* Input */}
               <div className="flex space-x-2">
                 <input
                   ref={inputRef}
                   type="text"
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyPress={handleKeyPress}
                   placeholder="Type your message..."
                   className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                 />
                 <motion.button
                   onClick={toggleVoiceInput}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className={`p-2 rounded-xl transition-colors ${
                     isListening 
                       ? "bg-red-500 text-white hover:bg-red-600" 
                       : "bg-blue-500 text-white hover:bg-blue-600"
                   }`}
                 >
                   {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                 </motion.button>
                 <motion.button
                   onClick={handleSendMessage}
                   disabled={!inputValue.trim()}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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