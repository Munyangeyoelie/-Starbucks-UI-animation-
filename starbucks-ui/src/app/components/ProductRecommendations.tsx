"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Star, 
  TrendingUp, 
  Heart, 
  ShoppingCart, 
  Filter,
  Search,
  X,
  Zap,
  Target,
  Clock,
  Award
} from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  tags: string[];
  popularity: number;
  inStock: boolean;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  products: Product[];
  type: 'personalized' | 'trending' | 'bestseller' | 'new';
  confidence: number;
}

const allProducts: Product[] = [
  {
    id: "1",
    name: "Premium Black Pepper",
    description: "High-quality black pepper sourced from the finest farms in Rwanda",
    price: 15000,
    image: "/1.png",
    rating: 4.8,
    reviews: 124,
    category: "Pepper",
    tags: ["organic", "premium", "popular"],
    popularity: 95,
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
    category: "Cinnamon",
    tags: ["organic", "sweet", "warming"],
    popularity: 88,
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
    category: "Nutmeg",
    tags: ["gourmet", "warming", "complex"],
    popularity: 72,
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
    category: "Cardamom",
    tags: ["elite", "aromatic", "premium"],
    popularity: 85,
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
    category: "Saffron",
    tags: ["premium", "rare", "luxury"],
    popularity: 92,
    inStock: true
  }
];

export default function ProductRecommendations({ 
  isOpen, 
  onClose, 
  userPreferences = {} 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  userPreferences?: Record<string, any>;
}) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'rating' | 'popularity'>('relevance');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate AI recommendations based on user preferences
  useEffect(() => {
    if (isOpen) {
      generateRecommendations();
    }
  }, [isOpen, userPreferences]);

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const personalizedProducts = allProducts
      .filter(product => product.popularity > 80)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);

    const trendingProducts = allProducts
      .filter(product => product.rating >= 4.8)
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 3);

    const bestsellerProducts = allProducts
      .filter(product => product.tags.includes('popular'))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);

    const newRecommendations: Recommendation[] = [
      {
        id: "1",
        title: "Personalized for You",
        description: "Based on your preferences and browsing history",
        products: personalizedProducts,
        type: 'personalized',
        confidence: 0.92
      },
      {
        id: "2",
        title: "Trending Now",
        description: "Most popular spices this week",
        products: trendingProducts,
        type: 'trending',
        confidence: 0.88
      },
      {
        id: "3",
        title: "Best Sellers",
        description: "Customer favorites with highest ratings",
        products: bestsellerProducts,
        type: 'bestseller',
        confidence: 0.95
      }
    ];

    setRecommendations(newRecommendations);
    setIsLoading(false);
  };

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
        return b.popularity - a.popularity;
      default:
        return 0;
    }
  });

  const categories = ['all', ...Array.from(new Set(allProducts.map(p => p.category)))];

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
            className="fixed inset-4 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold">AI Recommendations</h2>
                    <p className="text-purple-100">Personalized spice suggestions just for you</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search spices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="price">Sort by Price</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="popularity">Sort by Popularity</option>
                </select>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
                  />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* AI Recommendations */}
                  {recommendations.map((recommendation, index) => (
                    <motion.div
                      key={recommendation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            <span>{recommendation.title}</span>
                          </h3>
                          <p className="text-gray-600 text-sm">{recommendation.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-purple-600 font-medium">
                            {Math.round(recommendation.confidence * 100)}% match
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recommendation.products.map((product) => (
                          <motion.div
                            key={product.id}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <div className="relative h-32 mb-3">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain"
                              />
                              {product.tags.includes('premium') && (
                                <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                  Premium
                                </div>
                              )}
                            </div>
                            
                            <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                            
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">{product.rating}</span>
                                <span className="text-xs text-gray-500">({product.reviews})</span>
                              </div>
                              <span className="text-lg font-bold text-purple-600">
                                {product.price.toLocaleString()} RWF
                              </span>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Add to Cart</span>
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* All Products */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">All Products</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                        >
                          <div className="relative h-32 mb-3">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain"
                            />
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              {product.popularity}% popular
                            </div>
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{product.rating}</span>
                              <span className="text-xs text-gray-500">({product.reviews})</span>
                            </div>
                            <span className="text-lg font-bold text-green-600">
                              {product.price.toLocaleString()} RWF
                            </span>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 