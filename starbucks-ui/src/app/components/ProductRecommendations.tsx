"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Star, 
  Package, 
  Eye, 
  Share2,
  MapPin,
  Users
} from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  discount: number;
  category: string;
  tags: string[];
  purchaseCount: number;
  location: string;
  userType: "client" | "distributor";
  inStock: boolean;
}

interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: "1",
    name: "Premium Black Pepper",
    description: "High-quality black pepper sourced from the finest farms in Rwanda",
    price: 12000,
    originalPrice: 15000,
    image: "/1.png",
    rating: 4.8,
    reviews: 124,
    discount: 20,
    category: "Pepper",
    tags: ["organic", "premium", "hot"],
    purchaseCount: 1247,
    location: "Kigali, Rwanda",
    userType: "client",
    inStock: true
  },
  {
    id: "2",
    name: "Organic Cinnamon",
    description: "Pure organic cinnamon from Rwanda's highlands",
    price: 14400,
    originalPrice: 18000,
    image: "/2.png",
    rating: 4.9,
    reviews: 89,
    discount: 20,
    category: "Cinnamon",
    tags: ["organic", "sweet", "new"],
    purchaseCount: 892,
    location: "Nairobi, Kenya",
    userType: "distributor",
    inStock: true
  },
  {
    id: "3",
    name: "Gourmet Nutmeg",
    description: "Premium nutmeg from Rwanda's fertile valleys",
    price: 17600,
    originalPrice: 22000,
    image: "/3.png",
    rating: 4.7,
    reviews: 67,
    discount: 20,
    category: "Nutmeg",
    tags: ["premium", "warm", "hot"],
    purchaseCount: 567,
    location: "Dar es Salaam, Tanzania",
    userType: "client",
    inStock: true
  },
  {
    id: "4",
    name: "Cardamom Supreme",
    description: "Elite cardamom from Rwanda's volcanic soil",
    price: 22400,
    originalPrice: 28000,
    image: "/4.png",
    rating: 4.9,
    reviews: 156,
    discount: 20,
    category: "Cardamom",
    tags: ["elite", "aromatic", "new"],
    purchaseCount: 423,
    location: "Kampala, Uganda",
    userType: "distributor",
    inStock: true
  },
  {
    id: "5",
    name: "Saffron Gold",
    description: "Premium saffron from Rwanda's high-altitude farms",
    price: 44000,
    originalPrice: 55000,
    image: "/5.png",
    rating: 5.0,
    reviews: 203,
    discount: 20,
    category: "Saffron",
    tags: ["premium", "golden", "hot"],
    purchaseCount: 298,
    location: "Addis Ababa, Ethiopia",
    userType: "client",
    inStock: true
  }
];

export default function ProductRecommendations() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 100000],
    rating: 0,
    inStock: true
  });

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesRating = product.rating >= filters.rating;
      const matchesStock = !filters.inStock || product.inStock;
      return matchesCategory && matchesPrice && matchesRating && matchesStock;
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
        case "popularity":
          return b.purchaseCount - a.purchaseCount;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Recommendations</h1>
          <p className="text-xl text-gray-600">Discover our finest spices with personalized recommendations</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Sort by Rating</option>
                <option value="reviews">Sort by Reviews</option>
                <option value="popularity">Sort by Popularity</option>
              </select>
            </div>

            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Advanced Filters
            </motion.button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [parseInt(e.target.value), prev.priceRange[1]] }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Min"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={0}>Any Rating</option>
                      <option value={4.0}>4.0+ Stars</option>
                      <option value={4.5}>4.5+ Stars</option>
                      <option value={4.8}>4.8+ Stars</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                        className="rounded text-green-600"
                      />
                      <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Product Grid */}
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
                  <motion.div
                    className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Package className="w-3 h-3" />
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
                    <Eye className="w-4 h-4 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Share2 className="w-4 h-4 text-gray-600" />
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
                    <span>{product.purchaseCount} bought</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 