"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard, 
  User, 
  MessageCircle,
  Sparkles,
  Star,
  TrendingUp,
  Heart,
  Filter,
  Search,
  Eye,
  Share2,
  Flame,
  Users,
  MapPin as MapPinIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Chatbot from "../components/Chatbot";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  purchaseCount: number;
  location: string;
  userType: "client" | "distributor";
  coordinates: { lat: number; lng: number };
  discount: number;
  isHot: boolean;
  isNew: boolean;
  category: string;
  tags: string[];
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

// Generate random data for products
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
    description: "High-quality black pepper sourced from the finest farms in Rwanda",
    price: 12000, // Discounted price
    originalPrice: 15000,
    image: "/1.png",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    purchaseCount: 0,
    location: "",
    userType: "client",
    coordinates: { lat: 0, lng: 0 },
    discount: 20,
    isHot: true,
    isNew: false,
    category: "Pepper",
    tags: ["organic", "premium", "hot"]
  },
  {
    id: "2",
    name: "Organic Cinnamon",
    description: "Pure organic cinnamon from Rwanda's highlands",
    price: 14400, // Discounted price
    originalPrice: 18000,
    image: "/2.png",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    purchaseCount: 0,
    location: "",
    userType: "client",
    coordinates: { lat: 0, lng: 0 },
    discount: 20,
    isHot: false,
    isNew: true,
    category: "Cinnamon",
    tags: ["organic", "sweet", "new"]
  },
  {
    id: "3",
    name: "Gourmet Nutmeg",
    description: "Premium nutmeg from Rwanda's fertile valleys",
    price: 17600, // Discounted price
    originalPrice: 22000,
    image: "/3.png",
    rating: 4.7,
    reviews: 67,
    inStock: true,
    purchaseCount: 0,
    location: "",
    userType: "client",
    coordinates: { lat: 0, lng: 0 },
    discount: 20,
    isHot: true,
    isNew: false,
    category: "Nutmeg",
    tags: ["premium", "warm", "hot"]
  },
  {
    id: "4",
    name: "Cardamom Supreme",
    description: "Elite cardamom from Rwanda's volcanic soil",
    price: 22400, // Discounted price
    originalPrice: 28000,
    image: "/4.png",
    rating: 4.9,
    reviews: 156,
    inStock: true,
    purchaseCount: 0,
    location: "",
    userType: "client",
    coordinates: { lat: 0, lng: 0 },
    discount: 20,
    isHot: false,
    isNew: true,
    category: "Cardamom",
    tags: ["elite", "aromatic", "new"]
  },
  {
    id: "5",
    name: "Saffron Gold",
    description: "Premium saffron from Rwanda's high-altitude farms",
    price: 44000, // Discounted price
    originalPrice: 55000,
    image: "/5.png",
    rating: 5.0,
    reviews: 203,
    inStock: true,
    purchaseCount: 0,
    location: "",
    userType: "client",
    coordinates: { lat: 0, lng: 0 },
    discount: 20,
    isHot: true,
    isNew: false,
    category: "Saffron",
    tags: ["premium", "golden", "hot"]
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

  const [purchaseCounts, setPurchaseCounts] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews - a.reviews;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

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

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search spices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Sort by Rating</option>
                <option value="reviews">Sort by Reviews</option>
              </select>

              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-xl p-4 shadow-lg"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-green-600" />
                    <span className="text-sm">Hot Items</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-green-600" />
                    <span className="text-sm">New Arrivals</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-green-600" />
                    <span className="text-sm">Organic</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-green-600" />
                    <span className="text-sm">Premium</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-48 bg-gradient-to-br from-green-50 to-emerald-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Product badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {product.isHot && (
                    <motion.div
                      className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Flame className="w-3 h-3" />
                      <span>Hot</span>
                    </motion.div>
                  )}
                  {product.isNew && (
                    <motion.div
                      className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>New</span>
                    </motion.div>
                  )}
                  <motion.div
                    className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>-{product.discount}%</span>
                  </motion.div>
                </div>

                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Heart className="w-4 h-4 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                  <span className="text-sm text-gray-500">{product.category}</span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                {/* Rating and reviews */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>

                {/* Purchase count and location */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{purchaseCounts[product.id] || product.purchaseCount} bought</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{product.location}</span>
                  </div>
                </div>
                
                {/* Price display */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <motion.span 
                      className="text-2xl font-bold text-green-600"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {product.price.toLocaleString()} RWF
                    </motion.span>
                    <motion.span 
                      className="text-lg text-gray-400 line-through"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {product.originalPrice.toLocaleString()} RWF
                    </motion.span>
                  </div>
                  <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                    -{product.discount}%
                  </span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <motion.button
                  onClick={() => addToCart(product.id)}
                  disabled={!product.inStock}
                  whileHover={product.inStock ? { scale: 1.02 } : {}}
                  whileTap={product.inStock ? { scale: 0.98 } : {}}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    product.inStock
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
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
                          <motion.div
                            key={productId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="relative w-12 h-12">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain"
                              />
                              {/* Discount badge */}
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                -{product.discount}%
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{product.name}</h4>
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-bold text-green-600">{product.price.toLocaleString()} RWF</p>
                                <p className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()} RWF</p>
                              </div>
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
                              </div>
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
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {getTotalItems() > 0 && (
                  <div className="border-t border-gray-200 p-6">
                    {/* Savings calculation */}
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Original Total:</span>
                        <span className="text-gray-400 line-through">
                          {Object.entries(cart).reduce((sum, [productId, quantity]) => {
                            const product = products.find(p => p.id === productId);
                            return sum + (product?.originalPrice || 0) * quantity;
                          }, 0).toLocaleString()} RWF
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 font-medium">You Save:</span>
                        <span className="text-green-600 font-bold">
                          {Object.entries(cart).reduce((sum, [productId, quantity]) => {
                            const product = products.find(p => p.id === productId);
                            return sum + ((product?.originalPrice || 0) - (product?.price || 0)) * quantity;
                          }, 0).toLocaleString()} RWF
                        </span>
                      </div>
                    </div>

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
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-sm font-bold text-green-600">{product.price.toLocaleString()} RWF</span>
                                    <span className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()} RWF</span>
                                    <span className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">-{product.discount}%</span>
                                  </div>
                                </div>
                                <p className="font-semibold text-gray-900">
                                  {(product.price * quantity).toLocaleString()} RWF
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="text-gray-400 line-through">
                              {Object.entries(cart).reduce((sum, [productId, quantity]) => {
                                const product = products.find(p => p.id === productId);
                                return sum + (product?.originalPrice || 0) * quantity;
                              }, 0).toLocaleString()} RWF
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-green-600 font-medium">Discount:</span>
                            <span className="text-green-600 font-bold">
                              -{Object.entries(cart).reduce((sum, [productId, quantity]) => {
                                const product = products.find(p => p.id === productId);
                                return sum + ((product?.originalPrice || 0) - (product?.price || 0)) * quantity;
                              }, 0).toLocaleString()} RWF
                            </span>
                          </div>
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

      {/* Enhanced Floating Action Buttons */}
      <motion.div
        className="fixed bottom-8 right-8 z-50 flex flex-col space-y-4"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        {/* WhatsApp support button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-green-500/50 transition-all duration-300 animate-float"
          onClick={openWhatsApp}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          >
            💬
          </motion.div>
        </motion.button>
        
        {/* Live chat button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/50 transition-all duration-300 animate-float"
          onClick={() => {}}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.div>
        </motion.button>
        
        {/* Scroll to top button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-purple-500/50 transition-all duration-300 animate-float"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ↑
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
} 