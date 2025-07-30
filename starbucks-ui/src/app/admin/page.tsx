"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  ArrowLeft, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Plus,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
  shippingAddress: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  rating: number;
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    products: [
      { name: "Premium Black Pepper", quantity: 2, price: 15000 },
      { name: "Organic Cinnamon", quantity: 1, price: 18000 }
    ],
    totalAmount: 48000,
    status: "pending",
    orderDate: "2024-01-15",
    shippingAddress: "123 Main St, City, Country"
  },
  {
    id: "ORD-002",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    products: [
      { name: "Gourmet Nutmeg", quantity: 3, price: 22000 },
      { name: "Cardamom Supreme", quantity: 1, price: 28000 }
    ],
    totalAmount: 94000,
    status: "processing",
    orderDate: "2024-01-14",
    shippingAddress: "456 Oak Ave, Town, Country"
  },
  {
    id: "ORD-003",
    customerName: "Mike Wilson",
    customerEmail: "mike@example.com",
    products: [
      { name: "Saffron Gold", quantity: 1, price: 55000 }
    ],
    totalAmount: 55000,
    status: "shipped",
    orderDate: "2024-01-13",
    shippingAddress: "789 Pine Rd, Village, Country"
  },
  {
    id: "ORD-004",
    customerName: "Emily Davis",
    customerEmail: "emily@example.com",
    products: [
      { name: "Premium Black Pepper", quantity: 5, price: 15000 },
      { name: "Organic Cinnamon", quantity: 3, price: 18000 },
      { name: "Gourmet Nutmeg", quantity: 2, price: 22000 }
    ],
    totalAmount: 141000,
    status: "delivered",
    orderDate: "2024-01-12",
    shippingAddress: "321 Elm St, City, Country"
  }
];

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Black Pepper",
    description: "High-quality black pepper from Rwanda",
    price: 15000,
    image: "/1.png",
    stock: 150,
    category: "Pepper",
    rating: 4.8
  },
  {
    id: "2",
    name: "Organic Cinnamon",
    description: "Pure organic cinnamon from Rwanda's highlands",
    price: 18000,
    image: "/2.png",
    stock: 89,
    category: "Cinnamon",
    rating: 4.9
  },
  {
    id: "3",
    name: "Gourmet Nutmeg",
    description: "Premium nutmeg from Rwanda's fertile valleys",
    price: 22000,
    image: "/3.png",
    stock: 67,
    category: "Nutmeg",
    rating: 4.7
  },
  {
    id: "4",
    name: "Cardamom Supreme",
    description: "Elite cardamom from Rwanda's volcanic soil",
    price: 28000,
    image: "/4.png",
    stock: 45,
    category: "Cardamom",
    rating: 4.9
  },
  {
    id: "5",
    name: "Saffron Gold",
    description: "Premium saffron from Rwanda's high-altitude farms",
    price: 55000,
    image: "/5.png",
    stock: 23,
    category: "Saffron",
    rating: 5.0
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

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: ShoppingCart,
  delivered: CheckCircle,
  cancelled: AlertTriangle
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddProduct, setShowAddProduct] = useState(false);



  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const lowStockProducts = mockProducts.filter(product => product.stock < 50);

  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(order => order.status === "pending").length;
  const averageRating = mockProducts.reduce((sum, product) => sum + product.rating, 0) / mockProducts.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Enhanced Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-md border-b border-purple-200"
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
                <Link href="/" className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
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
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center"
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
              </div>
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Users className="w-6 h-6 text-purple-600" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Tab Navigation */}
        <motion.div 
          className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-xl p-1 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "orders", label: "Orders", icon: ShoppingCart },
            { id: "products", label: "Products", icon: Package }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "overview" | "orders" | "products")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white text-purple-600 shadow-lg"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Enhanced Stats Cards */}
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  { label: "Total Revenue", value: `${totalRevenue.toLocaleString()} RWF`, icon: TrendingUp, color: "green" },
                  { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingCart, color: "blue" },
                  { label: "Pending Orders", value: pendingOrders.toString(), icon: Clock, color: "yellow" },
                  { label: "Avg Rating", value: averageRating.toFixed(1), icon: Star, color: "purple" }
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.05,
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                        className={`p-3 rounded-full bg-${stat.color}-100`}
                      >
                        <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced Low Stock Alert */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg mb-8"
              >
                <motion.h3 
                  className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span>Low Stock Alert</span>
                </motion.h3>
                <motion.div 
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {lowStockProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
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
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-yellow-600">Stock: {product.stock}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Enhanced Search and Filter */}
              <motion.div 
                className="flex flex-col md:flex-row gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div 
                  className="relative flex-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </motion.div>
                <motion.select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </motion.select>
              </motion.div>

              {/* Enhanced Orders List */}
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredOrders.map((order, index) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <motion.div
                      key={order.id}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.02,
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <motion.div
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                            className={`p-2 rounded-full ${statusColors[order.status]}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
                            <p className="text-sm text-gray-500">{order.customerEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{order.totalAmount.toLocaleString()} RWF</p>
                          <p className="text-sm text-gray-500">{order.orderDate}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {order.products.map((product, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + idx * 0.05 }}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">{product.name} × {product.quantity}</span>
                            <span className="text-gray-900">{(product.price * product.quantity).toLocaleString()} RWF</span>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">{order.shippingAddress}</p>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}

          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Add Product Button */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.button
                  onClick={() => setShowAddProduct(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New Product</span>
                </motion.button>
              </motion.div>
              {/* Enhanced Products Grid */}
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {mockProducts.map((product) => (
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
                        className="relative w-full h-32"
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
                         className="text-xl font-bold text-purple-600"
                         whileHover={{ scale: 1.1 }}
                         transition={{ duration: 0.2 }}
                       >
                         {product.price.toLocaleString()} RWF
                       </motion.span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">Category: {product.category}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        product.stock > 50 
                          ? "bg-green-100 text-green-700" 
                          : product.stock > 20
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-2 px-4 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        <Edit className="w-4 h-4 inline mr-2" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New Product</h3>
                <motion.button
                  onClick={() => setShowAddProduct(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter product description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (RWF)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select category</option>
                    <option value="pepper">Pepper</option>
                    <option value="cinnamon">Cinnamon</option>
                    <option value="nutmeg">Nutmeg</option>
                    <option value="cardamom">Cardamom</option>
                    <option value="saffron">Saffron</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                    <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    Add Product
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 