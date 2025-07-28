"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Package, ArrowLeft, Plus, Minus, X, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  boxSize: number;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: "1",
    name: "Premium Black Pepper",
    description: "High-quality black pepper from India - 24 pieces per box",
    price: 299.99,
    image: "/1.png",
    boxSize: 24,
    inStock: true
  },
  {
    id: "2",
    name: "Organic Cinnamon",
    description: "Pure organic cinnamon from Sri Lanka - 24 pieces per box",
    price: 379.99,
    image: "/2.png",
    boxSize: 24,
    inStock: true
  },
  {
    id: "3",
    name: "Gourmet Nutmeg",
    description: "Premium nutmeg from Indonesia - 24 pieces per box",
    price: 449.99,
    image: "/3.png",
    boxSize: 24,
    inStock: true
  },
  {
    id: "4",
    name: "Cardamom Supreme",
    description: "Elite cardamom from Guatemala - 24 pieces per box",
    price: 549.99,
    image: "/4.png",
    boxSize: 24,
    inStock: true
  },
  {
    id: "5",
    name: "Saffron Gold",
    description: "Premium saffron from Spain - 24 pieces per box",
    price: 1099.99,
    image: "/5.png",
    boxSize: 24,
    inStock: true
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0
  }
};

const imageVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.5, 
    rotateY: -90,
    filter: "blur(10px)"
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    filter: "blur(0px)"
  },
  hover: {
    scale: 1.05,
    rotateY: 5
  }
};

export default function DistributorPortal() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


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

  const getTotalBoxes = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return sum + (product?.price || 0) * quantity;
    }, 0);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    // Here you would integrate with Flutterwave
    alert("Payment processed successfully! Order placed.");
    setCart({});
    setShowCart(false);
  };

  const isValidOrder = getTotalBoxes() >= 1; // Minimum 1 box

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-md border-b border-blue-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Home</span>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center space-x-6"
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Package className="w-6 h-6 text-blue-600" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900">Distributor Portal</h1>
              </div>
              
              <motion.button
                onClick={() => setShowCart(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                {getTotalBoxes() > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {getTotalBoxes()}
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Bulk Order Portal
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-600"
          >
            Order high volumes of premium spices for your business. 
            Minimum order: 1 box (24 pieces) per product.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className="relative w-full h-48"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="relative w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                      style={{ 
                        transform: "translateZ(0)",
                        backfaceVisibility: "hidden"
                      }}
                    />
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 100 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 0
                      }}
                    />
                  </motion.div>
                </motion.div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <motion.span 
                  className="text-2xl font-bold text-blue-600"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  ${product.price}
                </motion.span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  product.inStock 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Box Size: {product.boxSize} pieces</span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2"
                >
                  <motion.button
                    onClick={() => removeFromCart(product.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </motion.button>
                  <motion.span 
                    className="w-8 text-center font-semibold"
                    key={cart[product.id] || 0}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {cart[product.id] || 0}
                  </motion.span>
                  <motion.button
                    onClick={() => addToCart(product.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 text-blue-600" />
                  </motion.button>
                </motion.div>
              </div>
              
              <motion.button
                onClick={() => addToCart(product.id)}
                disabled={!product.inStock}
                whileHover={product.inStock ? { scale: 1.02 } : {}}
                whileTap={product.inStock ? { scale: 0.98 } : {}}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  product.inStock
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Add Box to Cart
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Shopping Cart Sidebar */}
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
                <motion.div 
                  className="flex items-center justify-between p-6 border-b border-gray-200"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold text-gray-900">Bulk Order Cart</h3>
                  <motion.button
                    onClick={() => setShowCart(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </motion.div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  {getTotalBoxes() === 0 ? (
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Your cart is empty</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="space-y-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {Object.entries(cart).map(([productId, quantity], index) => {
                        const product = products.find(p => p.id === productId);
                        if (!product) return null;
                        
                        return (
                          <motion.div
                            key={productId}
                            variants={itemVariants}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <motion.div 
                              className="relative w-12 h-12"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain"
                              />
                            </motion.div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-500">${product.price} per box</p>
                              <p className="text-xs text-gray-400">{product.boxSize} pieces per box</p>
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
                              <motion.span 
                                className="w-8 text-center font-semibold"
                                key={quantity}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                {quantity}
                              </motion.span>
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
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
                
                {getTotalBoxes() > 0 && (
                  <motion.div 
                    className="border-t border-gray-200 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total Boxes:</span>
                      <span className="text-2xl font-bold text-blue-600">{getTotalBoxes()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total Price:</span>
                      <span className="text-2xl font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    
                    <AnimatePresence>
                      {!isValidOrder && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4"
                        >
                          <p className="text-yellow-800 text-sm">
                            ⚠️ Minimum order requirement: 1 box
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <motion.button
                      onClick={handleCheckout}
                      disabled={!isValidOrder || isProcessing}
                      whileHover={isValidOrder && !isProcessing ? { scale: 1.02 } : {}}
                      whileTap={isValidOrder && !isProcessing ? { scale: 0.98 } : {}}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                        isValidOrder && !isProcessing
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl"
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
                          <Truck className="w-5 h-5" />
                          <span>Place Bulk Order</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 