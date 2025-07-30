/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Package, 
  ShoppingCart, 
  Truck, 
  Star,
  Mic,
  MicOff,
  Volume2,
  MapPin,
  Globe,
  Search,
  TrendingUp,
  Shield,
  CreditCard,
  Phone,
  Users,
  Target
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  discount: number;
  rating: number;
  reviews: number;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
  userType: "client" | "distributor";
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "product" | "quick-reply" | "location" | "voice" | "image" | "file";
  product?: Product;
  location?: Location;
  voiceUrl?: string;
  imageUrl?: string;
  fileUrl?: string;
}

interface UserLocation {
  lat: number;
  lng: number;
  address: string;
  userType: "client" | "distributor";
}

const quickReplies = [
  { text: "🛒 Shop Now", action: "shop", icon: ShoppingCart },
  { text: "📦 Track Order", action: "track", icon: Package },
  { text: "❓ Product Info", action: "products", icon: Search },
  { text: "💰 Pricing", action: "pricing", icon: TrendingUp },
  { text: "🚚 Shipping", action: "shipping", icon: Truck },
  { text: "💬 Contact Support", action: "support", icon: Phone },
  { text: "📍 My Location", action: "location", icon: MapPin },
  { text: "🌍 International", action: "international", icon: Globe },
  { text: "💳 Payment", action: "payment", icon: CreditCard },
  { text: "⭐ Reviews", action: "reviews", icon: Star },
  { text: "🎯 Bulk Orders", action: "bulk", icon: Target },
  { text: "🔒 Security", action: "security", icon: Shield }
];

const products: Product[] = [
  {
    id: "1",
    name: "Premium Black Pepper",
    price: 12000,
    originalPrice: 15000,
    image: "/1.png",
    discount: 20,
    rating: 4.8,
    reviews: 124
  },
  {
    id: "2", 
    name: "Organic Cinnamon",
    price: 14400,
    originalPrice: 18000,
    image: "/2.png",
    discount: 20,
    rating: 4.9,
    reviews: 89
  },
  {
    id: "3",
    name: "Gourmet Nutmeg", 
    price: 17600,
    originalPrice: 22000,
    image: "/3.png",
    discount: 20,
    rating: 4.7,
    reviews: 67
  },
  {
    id: "4",
    name: "Cardamom Supreme",
    price: 22400,
    originalPrice: 28000,
    image: "/4.png",
    discount: 20,
    rating: 4.9,
    reviews: 156
  },
  {
    id: "5",
    name: "Saffron Gold",
    price: 44000,
    originalPrice: 55000,
    image: "/5.png",
    discount: 20,
    rating: 5.0,
    reviews: 203
  }
];

const locations = [
  { lat: -1.9441, lng: 30.0619, address: "Kigali, Rwanda", userType: "client" as const },
  { lat: -1.2921, lng: 36.8219, address: "Nairobi, Kenya", userType: "distributor" as const },
  { lat: -6.8235, lng: 39.2695, address: "Dar es Salaam, Tanzania", userType: "client" as const },
  { lat: 0.3476, lng: 32.5825, address: "Kampala, Uganda", userType: "distributor" as const },
  { lat: 9.0320, lng: 38.7636, address: "Addis Ababa, Ethiopia", userType: "client" as const },
  { lat: 6.5244, lng: 3.3792, address: "Lagos, Nigeria", userType: "distributor" as const },
  { lat: 30.0444, lng: 31.2357, address: "Cairo, Egypt", userType: "client" as const },
  { lat: -26.2041, lng: 28.0473, address: "Johannesburg, South Africa", userType: "distributor" as const }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 👋 I&apos;m Emmy, your AI assistant. I can help you with products, pricing, shipping, and more. I can also detect your location to provide personalized service!",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Find nearest location from our list
          const nearestLocation = locations.reduce((nearest, location) => {
            const distance = Math.sqrt(
              Math.pow(latitude - location.lat, 2) + 
              Math.pow(longitude - location.lng, 2)
            );
            return distance < nearest.distance ? { ...location, distance } : nearest;
          }, { ...locations[0], distance: Infinity });
          
          setUserLocation(nearestLocation);
        },
        (error) => {
          console.log("Location detection failed:", error);
          // Set default location
          setUserLocation(locations[0]);
        }
      );
    } else {
      setUserLocation(locations[0]);
    }
  }, []);

  const simulateTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1000 + Math.random() * 1000);
  };

  const addMessage = (text: string, sender: "user" | "bot", type: "text" | "product" | "quick-reply" | "location" | "voice" | "image" | "file" = "text", data?: { product?: Product; location?: Location }) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type,
      ...data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleQuickReply = (action: string) => {
    const reply = quickReplies.find(r => r.action === action);
    if (!reply) return;
    
    addMessage(reply.text, "user", "quick-reply");

    simulateTyping(() => {
      switch (action) {
        case "shop":
          addMessage("Great! Let me show you our amazing products with current discounts:", "bot");
          setTimeout(() => {
            products.slice(0, 3).forEach(product => {
              addMessage("", "bot", "product", { product });
            });
          }, 500);
          break;
        case "track":
          addMessage("To track your order, please provide your order number. You can also check your order status in your account dashboard.", "bot");
          break;
        case "products":
          addMessage("We offer premium spices from Rwanda including Black Pepper, Cinnamon, Nutmeg, Cardamom, and Saffron. Each product is carefully sourced and quality-tested.", "bot");
          break;
        case "pricing":
          addMessage("Our prices range from 12,000 RWF for Premium Black Pepper to 44,000 RWF for Saffron Gold. All products have 20% discount! We also offer bulk discounts for distributors.", "bot");
          break;
        case "shipping":
          addMessage("🚚 We offer fast delivery across Rwanda (2-3 days) and international shipping to 100+ countries. For international orders, visit our shipping page!", "bot");
          break;
        case "support":
          addMessage("📞 Our support team is available 24/7! WhatsApp: +250 123 456 789 | Email: support@emmyspices.com", "bot");
          break;
        case "location":
          if (userLocation) {
            addMessage(`📍 I detected you're near ${userLocation.address}. You're registered as a ${userLocation.userType}. This helps me provide personalized recommendations!`, "bot", "location", { location: userLocation });
          } else {
            addMessage("📍 I'm trying to detect your location. Please allow location access for personalized service.", "bot");
          }
          break;
        case "international":
          addMessage("We ship internationally to over 100 countries! Visit our international shipping page for details and customs handling.", "bot");
          break;
        case "payment":
          addMessage("We accept Flutterwave payments, mobile money (MTN, Airtel), and cash on delivery. All online payments are secure and encrypted.", "bot");
          break;
        case "reviews":
          addMessage("Our customers love us! We have 4.8+ star ratings across all products. Check out our testimonials section for real customer reviews.", "bot");
          break;
        case "bulk":
          addMessage("For bulk orders and distributor pricing, visit our distributor portal. We offer special discounts for large orders!", "bot");
          break;
        case "security":
          addMessage("🔒 Your security is our priority. We use 256-bit encryption, secure payment gateways, and never store sensitive data.", "bot");
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
        addMessage("Our premium spices range from 12,000 RWF to 44,000 RWF with 20% discount on all products! For bulk orders and distributor pricing, visit our distributor portal!", "bot");
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
        addMessage("Here are our premium spices with current discounts! Each one is carefully sourced and tested for quality. Which one interests you most?", "bot");
        setTimeout(() => {
          products.slice(0, 2).forEach(product => {
            addMessage("", "bot", "product", { product });
          });
        }, 500);
      } else if (userInput.includes("bulk") || userInput.includes("distributor")) {
        addMessage("For bulk orders and distributor pricing, visit our distributor portal at /distributor. We offer special discounts for large orders!", "bot");
      } else if (userInput.includes("international") || userInput.includes("global")) {
        addMessage("We ship internationally to over 100 countries! Visit our international shipping page at /international-shipping for details and customs handling.", "bot");
      } else if (userInput.includes("payment") || userInput.includes("pay")) {
        addMessage("We accept Flutterwave payments, mobile money (MTN, Airtel), and cash on delivery. All online payments are secure and encrypted.", "bot");
      } else if (userInput.includes("location") || userInput.includes("where")) {
        if (userLocation) {
          addMessage(`📍 I detected you're near ${userLocation.address}. You're registered as a ${userLocation.userType}. This helps me provide personalized recommendations!`, "bot", "location", { location: userLocation });
        } else {
          addMessage("📍 I'm trying to detect your location. Please allow location access for personalized service.", "bot");
        }
      } else if (userInput.includes("discount") || userInput.includes("sale")) {
        addMessage("🎉 All our products have 20% discount! Premium Black Pepper: 12,000 RWF (was 15,000), Saffron Gold: 44,000 RWF (was 55,000). Limited time offer!", "bot");
      } else {
        addMessage("I'm here to help! You can ask me about our products, pricing, shipping, location services, or use the quick reply buttons below.", "bot");
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
        const voiceText = "I want to know about your premium spices and current discounts";
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

  const handleProductClick = (product: Product | undefined) => {
    if (product) {
      setSelectedProduct(product);
      setShowProductDetails(true);
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
                  <p className="text-xs text-green-100">Online • 24/7 Support • Location Aware</p>
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
                        <motion.div 
                          className="flex items-center space-x-3 cursor-pointer"
                          onClick={() => handleProductClick(message.product)}
                          whileHover={{ scale: 1.02 }}
                        >
                          <img 
                            src={message.product.image} 
                            alt={message.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{message.product.name}</p>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm text-green-600 font-bold">{message.product.price.toLocaleString()} RWF</p>
                              <p className="text-xs text-gray-500 line-through">{message.product.originalPrice.toLocaleString()} RWF</p>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">{message.product.rating} ({message.product.reviews})</span>
                            </div>
                          </div>
                        </motion.div>
                      ) : message.type === "location" && message.location ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">{message.location.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{message.location.userType}</span>
                          </div>
                          <button 
                            onClick={() => setShowLocationMap(true)}
                            className="text-xs text-green-600 hover:text-green-700 underline"
                          >
                            View on Map
                          </button>
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
              <div className="flex flex-wrap gap-2 mb-3 max-h-20 overflow-y-auto">
                {quickReplies.map((reply, index) => (
                  <motion.button
                    key={reply.action}
                    onClick={() => handleQuickReply(reply.action)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <reply.icon className="w-3 h-3" />
                    <span>{reply.text}</span>
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

      {/* Product Details Modal */}
      <AnimatePresence>
        {showProductDetails && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4"
            onClick={() => setShowProductDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Product Details</h3>
                <button onClick={() => setShowProductDetails(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-32 object-contain rounded-lg"
                />
                <h4 className="font-semibold text-gray-900">{selectedProduct.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-green-600">{selectedProduct.price.toLocaleString()} RWF</span>
                  <span className="text-sm text-gray-500 line-through">{selectedProduct.originalPrice.toLocaleString()} RWF</span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">-{selectedProduct.discount}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                  </span>
                </div>
                <button 
                  onClick={() => window.location.href = '/client'}
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Map Modal */}
      <AnimatePresence>
        {showLocationMap && userLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4"
            onClick={() => setShowLocationMap(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Coverage Area</h3>
                <button onClick={() => setShowLocationMap(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">{userLocation.address}</p>
                    <p className="text-sm text-gray-600">User Type: {userLocation.userType}</p>
                    <p className="text-xs text-gray-500 mt-1">Coordinates: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>📍 You&apos;re in our coverage area!</p>
                  <p>🚚 Fast delivery available</p>
                  <p>💳 Secure payment options</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 