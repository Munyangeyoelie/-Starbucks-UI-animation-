"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 45 : -45
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? 45 : -45
  })
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
    scale: 1.1,
    rotateY: 5
  }
};

export default function Home() {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-play only on desktop
  useEffect(() => {
    if (!isAutoPlaying || isMobile) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentProductIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isMobile]);

  const nextProduct = () => {
    setDirection(1);
    setCurrentProductIndex((prev) => (prev + 1) % products.length);
    setIsAutoPlaying(false);
  };

  const prevProduct = () => {
    setDirection(-1);
    setCurrentProductIndex((prev) => (prev - 1 + products.length) % products.length);
    setIsAutoPlaying(false);
  };

  const goToProduct = (index: number) => {
    setDirection(index > currentProductIndex ? 1 : -1);
    setCurrentProductIndex(index);
    setIsAutoPlaying(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const dragEnd = e.changedTouches[0].clientX;
    const dragDistance = dragStart - dragEnd;
    const minSwipeDistance = 50;

    if (Math.abs(dragDistance) > minSwipeDistance) {
      if (dragDistance > 0) {
        nextProduct();
      } else {
        prevProduct();
      }
    }
    
    setIsDragging(false);
  };

  const currentProduct = products[currentProductIndex];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navbar with enhanced animations */}
      <motion.nav 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-md border-b border-green-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center"
              >
                <span className="text-white font-bold text-xl">S</span>
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900">Emmy's Spices</h1>
            </motion.div>
            
            <motion.nav 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="hidden md:flex space-x-8"
            >
              {[
                { href: "/distributor", label: "Distributor Portal", icon: Package },
                { href: "/client", label: "Client Portal", icon: ShoppingCart },
                { href: "/admin", label: "Admin Dashboard", icon: Shield }
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-1 group"
                  >
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <link.icon className="w-4 h-4" />
                    </motion.div>
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Link href="/international-shipping" className="text-gray-600 hover:text-green-600 transition-colors">
                  International Shipping
                </Link>
              </motion.div>
            </motion.nav>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with enhanced product slider */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentProductIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.5 },
              rotateY: { duration: 0.6 }
            }}
            className={`absolute inset-0 bg-gradient-to-br ${currentProduct.bgColor}`}
          />
        </AnimatePresence>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Enhanced Product Image with complex animations */}
              <motion.div
                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.3,
                  ease: "easeOut"
                }}
                className="relative"
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <motion.div 
                  className="relative w-full h-96 lg:h-[500px] perspective-1000"
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
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      fill
                      className="object-contain"
                      priority
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
                        delay: 1
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Product Info with staggered animations */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.5,
                  ease: "easeOut"
                }}
                className="text-center lg:text-left"
              >
                <motion.h1 
                  key={`title-${currentProductIndex}`}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                >
                  {currentProduct.name}
                </motion.h1>
                
                <motion.p 
                  key={`desc-${currentProductIndex}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0"
                >
                  {currentProduct.description}
                </motion.p>

                <motion.div
                  key={`price-${currentProductIndex}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="flex items-center justify-center lg:justify-start space-x-6 mb-8"
                >
                  <motion.span 
                    className="text-3xl font-bold text-green-600"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    ${currentProduct.price}
                  </motion.span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href="/client"
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Shop Now</span>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Enhanced Product Indicators */}
                <motion.div 
                  className="flex justify-center lg:justify-start space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  {products.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => goToProduct(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentProductIndex
                          ? "bg-green-600 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </motion.div>

                {/* Mobile swipe hint */}
                {isMobile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="mt-4 text-sm text-gray-500"
                  >
                    ← Swipe to explore →
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Arrows - Hidden on mobile */}
        {!isMobile && (
          <>
            <motion.button
              onClick={prevProduct}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </motion.button>

            <motion.button
              onClick={nextProduct}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </motion.button>
          </>
        )}
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-12"
          >
            Why Choose Emmy's Spices
          </motion.h2>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
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
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <motion.div 
                  className="text-4xl mb-4"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Loading Animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            className="flex justify-center items-center space-x-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-green-500 rounded-full"
              />
            ))}
          </motion.div>
          <motion.p 
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Urusenda nyarwanda
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
