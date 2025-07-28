"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Users, Shield, Package, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  bgColor: string;
  textColor: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Premium Black Pepper",
    description: "High-quality black pepper sourced from the finest farms in India. Perfect for enhancing any dish with its rich, aromatic flavor.",
    price: 12.99,
    image: "/1.png",
    bgColor: "from-amber-50 to-orange-100",
    textColor: "text-amber-800"
  },
  {
    id: "2",
    name: "Organic Cinnamon",
    description: "Pure organic cinnamon from Sri Lanka. Sweet and warming spice that adds depth to both sweet and savory dishes.",
    price: 15.99,
    image: "/2.png",
    bgColor: "from-red-50 to-pink-100",
    textColor: "text-red-800"
  },
  {
    id: "3",
    name: "Gourmet Nutmeg",
    description: "Premium nutmeg from Indonesia. A versatile spice that brings warmth and complexity to your culinary creations.",
    price: 18.99,
    image: "/3.png",
    bgColor: "from-yellow-50 to-amber-100",
    textColor: "text-yellow-800"
  },
  {
    id: "4",
    name: "Cardamom Supreme",
    description: "Elite cardamom from Guatemala. Known as the 'Queen of Spices' for its distinctive sweet and aromatic flavor.",
    price: 22.99,
    image: "/4.png",
    bgColor: "from-green-50 to-emerald-100",
    textColor: "text-green-800"
  },
  {
    id: "5",
    name: "Saffron Gold",
    description: "Premium saffron from Spain. The world's most precious spice, adding golden color and unique flavor to your dishes.",
    price: 45.99,
    image: "/5.png",
    bgColor: "from-purple-50 to-indigo-100",
    textColor: "text-purple-800"
  }
];

export default function Home() {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextProduct = () => {
    setCurrentProductIndex((prev) => (prev + 1) % products.length);
    setIsAutoPlaying(false);
  };

  const prevProduct = () => {
    setCurrentProductIndex((prev) => (prev - 1 + products.length) % products.length);
    setIsAutoPlaying(false);
  };

  const goToProduct = (index: number) => {
    setCurrentProductIndex(index);
    setIsAutoPlaying(false);
  };

  const currentProduct = products[currentProductIndex];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md border-b border-green-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Starbucks Spices</h1>
            </motion.div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/distributor" className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-1">
                <Package className="w-4 h-4" />
                <span>Distributor Portal</span>
              </Link>
              <Link href="/client" className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-1">
                <ShoppingCart className="w-4 h-4" />
                <span>Client Portal</span>
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
              <Link href="/international-shipping" className="text-gray-600 hover:text-green-600 transition-colors">
                International Shipping
              </Link>
            </nav>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Product Slider */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProductIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-br ${currentProduct.bgColor}`}
          />
        </AnimatePresence>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="relative w-full h-96 lg:h-[500px]">
                  <Image
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center lg:text-left"
              >
                <motion.h1 
                  key={`title-${currentProductIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                >
                  {currentProduct.name}
                </motion.h1>
                
                <motion.p 
                  key={`desc-${currentProductIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0"
                >
                  {currentProduct.description}
                </motion.p>

                <motion.div
                  key={`price-${currentProductIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center lg:justify-start space-x-6 mb-8"
                >
                  <span className="text-3xl font-bold text-green-600">${currentProduct.price}</span>
                  <Link 
                    href="/client"
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Shop Now</span>
                  </Link>
                </motion.div>

                {/* Product Indicators */}
                <div className="flex justify-center lg:justify-start space-x-2">
                  {products.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToProduct(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentProductIndex
                          ? "bg-green-600 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevProduct}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={nextProduct}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-3xl font-bold text-center text-gray-900 mb-12"
          >
            Why Choose Starbucks Spices
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Premium Quality",
                description: "Finest spices sourced from around the world",
                icon: "🌿"
              },
              {
                title: "Fast Delivery",
                description: "Quick and reliable shipping to your doorstep",
                icon: "🚚"
              },
              {
                title: "Secure Payments",
                description: "Safe transactions with Flutterwave integration",
                icon: "🔒"
              },
              {
                title: "Global Shipping",
                description: "International shipping available worldwide",
                icon: "🌍"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Loading Animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="py-12 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-500">Yurusenda rwisuka arii drops</p>
        </div>
      </motion.div>
    </div>
  );
}
