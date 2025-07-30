"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard, 
  User, 
  Phone, 
  MapPin, 
  MessageCircle,
  MessageSquare,
  Sparkles,
  BarChart3,
  Target,
  Zap,
  Star,
  TrendingUp,
  Heart,
  Filter,
  Search
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Chatbot from "../components/Chatbot";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Premium Black Pepper",
    description: "High-quality black pepper sourced from the finest farms in Rwanda",
    price: 15000,
    image: "/1.png",
    rating: 4.8,
    reviews: 124,
    inStock: true
  },
  {
    id: "2",
    name: "Organic Cinnamon",
    description: "Pure organic cinnamon from Rwanda's highlands",
    price: 18000,
    image: "/2.png",
    rating: 4.9,
    reviews: 89,
    inStock: true
  },
  {
    id: "3",
    name: "Gourmet Nutmeg",
    description: "Premium nutmeg from Rwanda's fertile valleys",
    price: 22000,
    image: "/3.png",
    rating: 4.7,
    reviews: 67,
    inStock: true
  },
  {
    id: "4",
    name: "Cardamom Supreme",
    description: "Elite cardamom from Rwanda's volcanic soil",
    price: 28000,
    image: "/4.png",
    rating: 4.9,
    reviews: 156,
    inStock: true
  },
  {
    id: "5",
    name: "Saffron Gold",
    description: "Premium saffron from Rwanda's high-altitude farms",
    price: 55000,
    image: "/5.png",
    rating: 5.0,
    reviews: 203,
    inStock: true
  }
];

export default function ClientPortal() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: ""
  });
  const [showLiveChat, setShowLiveChat] = useState(false);

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 0) {
        newCart[productId] -= 1;
        if (newCart[productId] === 0) {
          delete newCart[productId];
        }
      }
      return newCart;
    });
  };

  const removeFromCartCompletely = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return sum + (product?.price || 0) * quantity;
    }, 0);
  };

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Please fill in all required fields: Name, Phone, and Address");
      return;
    }
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    
    alert("Payment processed successfully! Order placed.");
    setCart({});
    setShowCart(false);
    setShowCheckout(false);
    setCustomerInfo({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: ""
    });
  };

  const openWhatsApp = () => {
    const message = `Hello! I'm interested in ordering spices from Emmy Spices. Can you help me?`;
    const whatsappUrl = `https://wa.me/250123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const isValidOrder = getTotalItems() >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-green-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-2 text-green-600 hover:text-green-700">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Emmy Spices Logo"
                  width={56}
                  height={56}
                  className="rounded-full"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Emmy Spices</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <button
                    onClick={() => setShowCart(true)}
                    className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg"
                  >
                    <ShoppingCart className="w-6 h-6" />
                  </button>
                  {getTotalItems() > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    >
                      {getTotalItems()}
                    </motion.div>
                  )}
                </motion.div>
                <span className="text-sm text-gray-600">
                  {getTotalItems()} items • {getTotalPrice().toLocaleString()} RWF
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Spices Collection</h2>
          <p className="text-xl text-gray-600">Discover the finest spices from Rwanda and around the world</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 bg-gradient-to-br from-green-50 to-emerald-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm text-gray-600">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{product.price.toLocaleString()} RWF</span>
                </div>
                
                <motion.button
                  onClick={() => addToCart(product.id)}
                  disabled={!product.inStock}
                  whileHover={product.inStock ? { scale: 1.02 } : {}}
                  whileTap={product.inStock ? { scale: 0.98 } : {}}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    product.inStock
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCart(false)}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Shopping Cart</h3>
                  <motion.button
                    onClick={() => setShowCart(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  {getTotalItems() === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(cart).map(([productId, quantity]) => {
                        const product = products.find(p => p.id === productId);
                        if (!product) return null;
                        
                        return (
                          <div
                            key={productId}
                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="relative w-12 h-12">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-500">{product.price.toLocaleString()} RWF</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <motion.button
                                onClick={() => removeFromCart(product.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </motion.button>
                              <span className="w-8 text-center font-semibold">
                                {quantity}
                              </span>
                              <motion.button
                                onClick={() => addToCart(product.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </motion.button>
                              <motion.button
                                onClick={() => removeFromCartCompletely(product.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="ml-2 p-1 text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {getTotalItems() > 0 && (
                  <div className="border-t border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-green-600">{getTotalPrice().toLocaleString()} RWF</span>
                    </div>
                    
                    {!isValidOrder && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-yellow-800 text-sm">
                          ⚠️ Minimum order requirement: 3 items
                        </p>
                      </div>
                    )}
                    
                    <motion.button
                      onClick={() => {
                        setShowCheckout(true);
                        setShowCart(false);
                      }}
                      disabled={!isValidOrder || isProcessing}
                      whileHover={isValidOrder && !isProcessing ? { scale: 1.02 } : {}}
                      whileTap={isValidOrder && !isProcessing ? { scale: 0.98 } : {}}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                        isValidOrder && !isProcessing
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Proceed to Checkout</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Form */}
      <AnimatePresence>
        {showCheckout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCheckout(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900">Checkout</h3>
                  <motion.button
                    onClick={() => setShowCheckout(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </motion.button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Customer Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Customer Information
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter your email"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address *
                          </label>
                          <textarea
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter your full address"
                            rows={3}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              value={customerInfo.city}
                              onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              value={customerInfo.postalCode}
                              onChange={(e) => setCustomerInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Postal Code"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Order Summary
                      </h4>
                      
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="space-y-4">
                          {Object.entries(cart).map(([productId, quantity]) => {
                            const product = products.find(p => p.id === productId);
                            if (!product) return null;
                            
                            return (
                              <div key={productId} className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-gray-900">{product.name}</p>
                                  <p className="text-sm text-gray-600">Qty: {quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                  {(product.price * quantity).toLocaleString()} RWF
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="border-t border-gray-200 mt-6 pt-6">
                          <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                            <span>Total:</span>
                            <span>{getTotalPrice().toLocaleString()} RWF</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 p-6">
                  <motion.button
                    onClick={handleCheckout}
                    disabled={isProcessing || !customerInfo.name || !customerInfo.phone || !customerInfo.address}
                    whileHover={!isProcessing ? { scale: 1.02 } : {}}
                    whileTap={!isProcessing ? { scale: 0.98 } : {}}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                      !isProcessing && customerInfo.name && customerInfo.phone && customerInfo.address
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Pay with Flutterwave</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
} 