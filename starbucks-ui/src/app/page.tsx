
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Shield, Package, ChevronLeft, ChevronRight, Star, Award, Users, TrendingUp, ArrowRight, CheckCircle, Globe, Truck, Shield as ShieldIcon, Zap, Mail, MapPin, Eye, Heart, Share2, Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  bgColor: string;
  textColor: string;
  purchaseCount: number;
  location: string;
  userType: "client" | "distributor";
  coordinates: { lat: number; lng: number };
  discount: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  isHot: boolean;
  isNew: boolean;
}

// Generate random purchase counts and locations
const generateRandomData = () => {
  const locations = [
    "Kigali, Rwanda", "Nairobi, Kenya", "Dar es Salaam, Tanzania", 
    "Kampala, Uganda", "Addis Ababa, Ethiopia", "Lagos, Nigeria",
    "Cairo, Egypt", "Johannesburg, South Africa", "Casablanca, Morocco",
    "Accra, Ghana", "Dakar, Senegal", "Abidjan, Ivory Coast"
  ];
  
  const coordinates = [
    { lat: -1.9441, lng: 30.0619 }, // Kigali
    { lat: -1.2921, lng: 36.8219 }, // Nairobi
    { lat: -6.8235, lng: 39.2695 }, // Dar es Salaam
    { lat: 0.3476, lng: 32.5825 }, // Kampala
    { lat: 9.0320, lng: 38.7636 }, // Addis Ababa
    { lat: 6.5244, lng: 3.3792 }, // Lagos
    { lat: 30.0444, lng: 31.2357 }, // Cairo
    { lat: -26.2041, lng: 28.0473 }, // Johannesburg
    { lat: 33.5731, lng: -7.5898 }, // Casablanca
    { lat: 5.5600, lng: -0.2057 }, // Accra
    { lat: 14.7167, lng: -17.4677 }, // Dakar
    { lat: 5.3600, lng: -4.0083 } // Abidjan
  ];

  return {
    purchaseCount: Math.floor(Math.random() * 500) + 50,
    location: locations[Math.floor(Math.random() * locations.length)],
    userType: Math.random() > 0.7 ? "distributor" : "client" as "client" | "distributor",
    coordinates: coordinates[Math.floor(Math.random() * coordinates.length)],
    rating: (Math.random() * 0.5 + 4.5).toFixed(1),
    reviews: Math.floor(Math.random() * 200) + 50
  };
};

const products: Product[] = [
  {
    id: "1",
    name: "Premium Black Pepper",
    description: "High-quality black pepper sourced from the finest farms in Rwanda. Perfect for enhancing any dish with its rich, aromatic flavor.",
    price: 12000, // Discounted price
    originalPrice: 15000,
    image: "/1.png",
    bgColor: "from-amber-50 to-orange-100",
    textColor: "text-amber-800",
    purchaseCount: 0,
    location: "",
    userType: "client",
    coordinates: { lat: 0, lng: 0 },
    discount: 20,
    rating: 0,
    reviews: 0,
    inStock: true,
    isHot: true,
    isNew: false
  },
  {
    id: "2",
    name: "Organic Cinnamon",
    description: "Pure organic cinnamon from Rwanda's highlands. Sweet and warming spice that adds depth to both sweet and savory dishes.",
    price: 14400, // Discounted price
    originalPrice: 18000,
    image: "/2.png",
    bgColor: "from-red-50 to-pink-100",
    textColor: "text-red-800",
    purchaseCount: 0,
    location: "",
    userType: "client",
    coordinates: { lat: 0, lng: 0 },
    discount: 20,
    rating: 0,
    reviews: 0,
    inStock: true,
    isHot: false,
    isNew: true
  },
  {
    id: "3",
    name: "Gourmet Nutmeg",
    description: "Premium nutmeg from Rwanda's fertile valleys. A versatile spice that brings warmth and complexity to your culinary creations.",
    price: 17600, // Discounted price
    originalPrice: 22000,
    image: "/3.png",
    bgColor: "from-yellow-50 to-amber-100",
    textColor: "text-yellow-800",
    purchaseCount: 0,
    location: "",
    userType: "client",
    coordinates: { lat: 0, lng: 0 },
    discount: 20,
    rating: 0,
    reviews: 0,
    inStock: true,
    isHot: true,
    isNew: false
  },
  {
    id: "4",
    name: "Cardamom Supreme",
    description: "Elite cardamom from Rwanda's volcanic soil. Known as the 'Queen of Spices' for its distinctive sweet and aromatic flavor.",
    price: 22400, // Discounted price
    originalPrice: 28000,
    image: "/4.png",
    bgColor: "from-green-50 to-emerald-100",
    textColor: "text-green-800",
    purchaseCount: 0,
    location: "",
    userType: "client",
    coordinates: { lat: 0, lng: 0 },
    discount: 20,
    rating: 0,
    reviews: 0,
    inStock: true,
    isHot: false,
    isNew: true
  },
  {
    id: "5",
    name: "Saffron Gold",
    description: "Premium saffron from Rwanda's high-altitude farms. The world's most precious spice, adding golden color and unique flavor to your dishes.",
    price: 44000, // Discounted price
    originalPrice: 55000,
    image: "/5.png",
    bgColor: "from-purple-50 to-indigo-100",
    textColor: "text-purple-800",
    purchaseCount: 0,
    location: "",
    userType: "client",
    coordinates: { lat: 0, lng: 0 },
    discount: 20,
    rating: 0,
    reviews: 0,
    inStock: true,
    isHot: true,
    isNew: false
  }
];

// Initialize products with random data
products.forEach(product => {
  const randomData = generateRandomData();
  product.purchaseCount = randomData.purchaseCount;
  product.location = randomData.location;
  product.userType = randomData.userType;
  product.coordinates = randomData.coordinates;
  product.rating = parseFloat(randomData.rating);
  product.reviews = randomData.reviews;
});

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

// Enhanced entrance animations for each product with advanced color grading
const productImageVariants = {
  // Product 1: Black Pepper - Spiral entrance with golden glow
  "1": {
    hidden: { 
      opacity: 0, 
      scale: 0.3, 
      rotateY: -180,
      rotateZ: 360,
      filter: "blur(15px) brightness(0.5) sepia(0.3)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      rotateZ: 0,
      filter: "blur(0px) brightness(1.1) sepia(0.1) saturate(1.2)"
    },
    hover: {
      scale: 1.1,
      rotateY: 5,
      rotateZ: 5,
      filter: "brightness(1.2) saturate(1.3) contrast(1.1)"
    }
  },
  // Product 2: Cinnamon - Bounce entrance with warm tones
  "2": {
    hidden: { 
      opacity: 0, 
      scale: 0.2, 
      y: 100,
      rotateX: 45,
      filter: "blur(12px) brightness(0.6) hue-rotate(30deg)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px) brightness(1.05) hue-rotate(15deg) saturate(1.1)"
    },
    hover: {
      scale: 1.1,
      rotateY: 5,
      y: -5,
      filter: "brightness(1.15) saturate(1.2) contrast(1.05)"
    }
  },
  // Product 3: Nutmeg - Slide and flip entrance with amber tones
  "3": {
    hidden: { 
      opacity: 0, 
      scale: 0.4, 
      x: -200,
      rotateY: 90,
      filter: "blur(10px) brightness(0.7) sepia(0.2)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      rotateY: 0,
      filter: "blur(0px) brightness(1.08) sepia(0.1) saturate(1.15)"
    },
    hover: {
      scale: 1.1,
      rotateY: 5,
      x: 5,
      filter: "brightness(1.18) saturate(1.25) contrast(1.08)"
    }
  },
  // Product 4: Cardamom - Zoom and rotate entrance with green tones
  "4": {
    hidden: { 
      opacity: 0, 
      scale: 0.1, 
      rotateY: -90,
      rotateX: 90,
      filter: "blur(20px) brightness(0.5) hue-rotate(120deg)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      filter: "blur(0px) brightness(1.06) hue-rotate(60deg) saturate(1.1)"
    },
    hover: {
      scale: 1.1,
      rotateY: 5,
      rotateX: 2,
      filter: "brightness(1.16) saturate(1.2) contrast(1.06)"
    }
  },
  // Product 5: Saffron - Fade and glow entrance with golden tones
  "5": {
    hidden: { 
      opacity: 0, 
      scale: 0.6, 
      rotateY: 180,
      filter: "blur(8px) brightness(0.5) sepia(0.4) hue-rotate(45deg)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px) brightness(1.12) sepia(0.2) saturate(1.3)"
    },
    hover: {
      scale: 1.1,
      rotateY: 5,
      filter: "brightness(1.22) saturate(1.35) contrast(1.12)"
    }
  }
};

export default function Home() {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [purchaseCounts, setPurchaseCounts] = useState<Record<string, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize and update random purchase counts
  useEffect(() => {
    const updatePurchaseCounts = () => {
      const newCounts: Record<string, number> = {};
      products.forEach(product => {
        newCounts[product.id] = Math.floor(Math.random() * 500) + 50;
      });
      setPurchaseCounts(newCounts);
    };

    updatePurchaseCounts();
    const interval = setInterval(updatePurchaseCounts, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowSwipeHint(true);
        setTimeout(() => setShowSwipeHint(false), 3000);
      }
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

  // Enhanced touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientX);
    setIsDragging(true);
    // Pause auto-play on touch
    setIsAutoPlaying(false);
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
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/logo.png"
                  alt="Emmy Spices Logo"
                  width={56}
                  height={56}
                  className="rounded-full"
                />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900">Emmy Spices</h1>
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
              ].map((link) => (
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
                    variants={productImageVariants[currentProduct.id as keyof typeof productImageVariants]}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="relative w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                    transition={{
                      duration: currentProduct.id === "1" ? 1.5 : 
                               currentProduct.id === "2" ? 1.3 :
                               currentProduct.id === "3" ? 1.4 :
                               currentProduct.id === "4" ? 1.6 : 1.8,
                      ease: "easeOut"
                    }}
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
                    {/* Enhanced Glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 100 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 1
                      }}
                    />
                    {/* Additional sparkle effect */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{ 
                        background: [
                          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                          "radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
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
                {/* Product badges */}
                <motion.div 
                  className="flex justify-center lg:justify-start space-x-2 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {currentProduct.isHot && (
                    <motion.div
                      className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Flame className="w-4 h-4" />
                      <span>Hot</span>
                    </motion.div>
                  )}
                  {currentProduct.isNew && (
                    <motion.div
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>New</span>
                    </motion.div>
                  )}
                  <motion.div
                    className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>-{currentProduct.discount}% OFF</span>
                  </motion.div>
                </motion.div>

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

                {/* Enhanced price display with discount */}
                <motion.div
                  key={`price-${currentProductIndex}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="flex items-center justify-center lg:justify-start space-x-6 mb-6"
                >
                  <div className="flex items-center space-x-3">
                    <motion.span 
                      className="text-3xl font-bold text-green-600"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentProduct.price.toLocaleString()} RWF
                    </motion.span>
                    <motion.span 
                      className="text-xl text-gray-400 line-through"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                    >
                      {currentProduct.originalPrice.toLocaleString()} RWF
                    </motion.span>
                  </div>
                </motion.div>

                {/* Purchase count and location */}
                <motion.div
                  key={`stats-${currentProductIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 mb-8"
                >
                  <motion.div 
                    className="flex items-center space-x-2 text-sm text-gray-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Users className="w-4 h-4" />
                    <span>{purchaseCounts[currentProduct.id] || currentProduct.purchaseCount} people bought this</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-2 text-sm text-gray-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{currentProduct.location}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      currentProduct.userType === 'distributor' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {currentProduct.userType}
                    </span>
                  </motion.div>
                </motion.div>

                {/* Rating and reviews */}
                <motion.div
                  key={`rating-${currentProductIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  className="flex items-center justify-center lg:justify-start space-x-4 mb-8"
                >
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(currentProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {currentProduct.rating} ({currentProduct.reviews} reviews)
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  key={`actions-${currentProductIndex}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.7 }}
                  className="flex items-center justify-center lg:justify-start space-x-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href="/client"
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse-glow"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Shop Now</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Heart className="w-5 h-5 text-gray-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Enhanced Product Indicators */}
                <motion.div 
                  className="flex justify-center lg:justify-start space-x-2 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.9 }}
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

                {/* Enhanced Mobile swipe hint */}
                {isMobile && showSwipeHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg"
                  >
                    <p className="text-sm text-gray-600 font-medium">
                      ← Swipe to explore products →
                    </p>
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

        {/* Auto-play indicator for desktop */}
        {!isMobile && isAutoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="text-sm text-gray-600">Auto-playing</span>
            </div>
          </motion.div>
        )}
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-green-50">
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
            className="text-4xl font-bold text-center text-gray-900 mb-16"
          >
            Why Choose Emmy Spices
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
                description: "Finest spices sourced from around the world with rigorous quality control",
                icon: Star,
                color: "from-yellow-400 to-orange-500",
                bgColor: "bg-yellow-50"
              },
              {
                title: "Fast Delivery",
                description: "Quick and reliable shipping to your doorstep with real-time tracking",
                icon: Truck,
                color: "from-blue-400 to-cyan-500",
                bgColor: "bg-blue-50"
              },
              {
                title: "Secure Payments",
                description: "Safe transactions with Flutterwave integration and 256-bit encryption",
                icon: ShieldIcon,
                color: "from-green-400 to-emerald-500",
                bgColor: "bg-green-50"
              },
              {
                title: "Global Shipping",
                description: "International shipping available worldwide with customs handling",
                icon: Globe,
                color: "from-purple-400 to-pink-500",
                bgColor: "bg-purple-50"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className={`text-center p-8 rounded-2xl ${feature.bgColor} hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-200`}
              >
                <motion.div 
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  whileHover={{ 
                    rotate: 360, 
                    scale: 1.1,
                    transition: { duration: 0.6 }
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Animated checkmark */}
                <motion.div
                  className="mt-6 flex justify-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Additional feature highlights */}
          <motion.div 
            className="mt-16 grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {[
              {
                title: "24/7 Support",
                description: "Round-the-clock customer service",
                icon: Zap
              },
              {
                title: "Quality Guarantee",
                description: "100% satisfaction or money back",
                icon: Award
              },
              {
                title: "Bulk Discounts",
                description: "Special pricing for large orders",
                icon: TrendingUp
              }
            ].map((highlight, index) => (
              <motion.div
                key={highlight.title}
                className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <highlight.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{highlight.title}</h4>
                  <p className="text-sm text-gray-600">{highlight.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Loading Animation with Spice Bottle */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Spice Bottle Dropping Animation */}
          <motion.div 
            className="relative h-32 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {/* Bottle */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2"
              animate={{ 
                y: [0, 100, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-8 h-16 bg-amber-600 rounded-t-full border-2 border-amber-800">
                <div className="w-6 h-12 bg-amber-500 rounded-t-full mx-1 mt-1"></div>
                <div className="w-4 h-2 bg-amber-800 rounded-full mx-2 mt-1"></div>
              </div>
              {/* Spice particles dropping */}
              <motion.div
                className="absolute top-16 left-1/2 transform -translate-x-1/2"
                animate={{ 
                  y: [0, 50],
                  opacity: [1, 0]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5
                }}
              >
                <div className="flex space-x-1">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 bg-amber-400 rounded-full"
                      animate={{ 
                        y: [0, 30],
                        opacity: [1, 0],
                        scale: [1, 0.5]
                      }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
            
            {/* Ground/Container */}
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-amber-200 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          </motion.div>
          
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
            Yurusenda rwisuka arii drops
          </motion.p>
        </div>
      </motion.div>

      {/* New: Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Emmy Spices by the Numbers
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Happy Customers", icon: Users },
              { number: "100+", label: "Countries Served", icon: Globe },
              { number: "99.9%", label: "Quality Rating", icon: Star },
              { number: "24/7", label: "Customer Support", icon: Award }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="w-8 h-8" />
                </motion.div>
                <motion.div
                  className="text-3xl md:text-4xl font-bold mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.div>
                <p className="text-green-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* New: Testimonials Section */}
      <section className="py-20 bg-white">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What Our Customers Say
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Chef, Le Gourmet",
                content: "Emmy Spices has transformed my kitchen. The quality is unmatched and delivery is always on time. My customers love the authentic flavors!",
                rating: 5,
                avatar: "👩‍🍳"
              },
              {
                name: "Michael Chen",
                role: "Restaurant Owner",
                content: "The best spice supplier I've ever worked with. Their international shipping is reliable and the product quality is consistently excellent.",
                rating: 5,
                avatar: "👨‍💼"
              },
              {
                name: "Amina Hassan",
                role: "Home Chef",
                content: "I love how easy it is to order from Emmy Spices. The website is beautiful and the spices are always fresh. Highly recommended!",
                rating: 5,
                avatar: "👩‍🍳"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* New: Product Categories Section */}
      <section className="py-20 bg-white">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Explore Our Spice Categories
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Pepper Varieties",
                description: "From black to white, pink to green",
                image: "/1.png",
                count: "12 Products",
                color: "from-amber-500 to-orange-600"
              },
              {
                title: "Cinnamon Collection",
                description: "Sweet and aromatic varieties",
                image: "/2.png",
                count: "8 Products",
                color: "from-red-500 to-pink-600"
              },
              {
                title: "Nutmeg & Mace",
                description: "Warm and complex flavors",
                image: "/3.png",
                count: "6 Products",
                color: "from-yellow-500 to-amber-600"
              },
              {
                title: "Cardamom Supreme",
                description: "The queen of spices",
                image: "/4.png",
                count: "4 Products",
                color: "from-green-500 to-emerald-600"
              },
              {
                title: "Saffron Gold",
                description: "The world's most precious spice",
                image: "/5.png",
                count: "3 Products",
                color: "from-purple-500 to-indigo-600"
              },
              {
                title: "Specialty Blends",
                description: "Custom spice combinations",
                image: "/ren.png",
                count: "15 Products",
                color: "from-blue-500 to-cyan-600"
              }
            ].map((category, index) => (
              <motion.div
                key={category.title}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="relative h-64">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <p className="text-sm mb-3 opacity-90">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.count}</span>
                      <motion.div
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* New: Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <motion.div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Culinary Experience?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-green-100 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of satisfied customers who trust Emmy Spices for their premium spice needs.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/client"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Start Shopping</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/distributor"
                className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-green-600 transition-all duration-300"
              >
                <Package className="w-5 h-5" />
                <span>Become a Distributor</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <motion.div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Mail className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Stay Spiced Up!
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Get exclusive access to new spice releases, cooking tips, and special offers delivered to your inbox.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </motion.button>
            </motion.div>
            
            <motion.p 
              className="text-sm text-gray-500 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              🔒 We respect your privacy. Unsubscribe at any time.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Enhanced Floating Action Buttons */}
      <motion.div
        className="fixed bottom-8 right-8 z-50 flex flex-col space-y-4"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        {/* Scroll to top button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-green-500/50 transition-all duration-300 animate-float"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ↑
          </motion.div>
        </motion.button>
        
        {/* Quick shop button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-purple-500/50 transition-all duration-300 animate-float"
          onClick={() => window.location.href = '/client'}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <ShoppingCart className="w-6 h-6" />
          </motion.div>
        </motion.button>
        
        {/* WhatsApp support button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-green-500/50 transition-all duration-300 animate-float"
          onClick={() => {
            const message = `Hello! I'm interested in Emmy Spices. Can you help me?`;
            const whatsappUrl = `https://wa.me/250123456789?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          >
            💬
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
}
