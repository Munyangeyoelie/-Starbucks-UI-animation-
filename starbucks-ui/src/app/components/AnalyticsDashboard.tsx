"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Users, 
  Globe, 
  ShoppingCart, 
  Star, 
  Eye,
  Download,
  Share2,
  DollarSign,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Compass
} from "lucide-react";

interface LocationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  userType: "client" | "distributor";
  purchaseCount: number;
  totalRevenue: number;
  rating: number;
  lastOrder: string;
  status: "active" | "inactive" | "new";
  coverage: number;
}

interface ActivityData {
  type: string;
  message: string;
  time: string;
  amount: number;
}

interface AnalyticsData {
  totalCustomers: number;
  totalRevenue: number;
  totalOrders: number;
  averageRating: number;
  growthRate: number;
  topLocations: LocationData[];
  recentActivity: ActivityData[];
}

const locations: LocationData[] = [
  {
    id: "1",
    name: "Kigali, Rwanda",
    lat: -1.9441,
    lng: 30.0619,
    userType: "client",
    purchaseCount: 1247,
    totalRevenue: 18500000,
    rating: 4.8,
    lastOrder: "2 hours ago",
    status: "active",
    coverage: 95
  },
  {
    id: "2",
    name: "Nairobi, Kenya",
    lat: -1.2921,
    lng: 36.8219,
    userType: "distributor",
    purchaseCount: 892,
    totalRevenue: 15600000,
    rating: 4.9,
    lastOrder: "1 hour ago",
    status: "active",
    coverage: 88
  },
  {
    id: "3",
    name: "Dar es Salaam, Tanzania",
    lat: -6.8235,
    lng: 39.2695,
    userType: "client",
    purchaseCount: 567,
    totalRevenue: 8900000,
    rating: 4.7,
    lastOrder: "3 hours ago",
    status: "active",
    coverage: 72
  },
  {
    id: "4",
    name: "Kampala, Uganda",
    lat: 0.3476,
    lng: 32.5825,
    userType: "distributor",
    purchaseCount: 423,
    totalRevenue: 6700000,
    rating: 4.6,
    lastOrder: "5 hours ago",
    status: "active",
    coverage: 65
  },
  {
    id: "5",
    name: "Addis Ababa, Ethiopia",
    lat: 9.0320,
    lng: 38.7636,
    userType: "client",
    purchaseCount: 298,
    totalRevenue: 4500000,
    rating: 4.5,
    lastOrder: "1 day ago",
    status: "new",
    coverage: 45
  },
  {
    id: "6",
    name: "Lagos, Nigeria",
    lat: 6.5244,
    lng: 3.3792,
    userType: "distributor",
    purchaseCount: 156,
    totalRevenue: 2300000,
    rating: 4.4,
    lastOrder: "2 days ago",
    status: "inactive",
    coverage: 38
  }
];

const analyticsData: AnalyticsData = {
  totalCustomers: 15420,
  totalRevenue: 52000000,
  totalOrders: 3587,
  averageRating: 4.7,
  growthRate: 23.5,
  topLocations: locations.slice(0, 5),
  recentActivity: [
    { type: "order", message: "New order from Kigali", time: "2 min ago", amount: 45000 },
    { type: "customer", message: "New customer registered", time: "5 min ago", amount: 0 },
    { type: "payment", message: "Payment received from Nairobi", time: "12 min ago", amount: 89000 },
    { type: "shipping", message: "Order shipped to Dar es Salaam", time: "1 hour ago", amount: 67000 },
    { type: "review", message: "5-star review from Kampala", time: "2 hours ago", amount: 0 }
  ]
};

export default function AnalyticsDashboard() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "client" | "distributor">("all");
  const [sortBy, setSortBy] = useState<string>("revenue");
  const [timeRange, setTimeRange] = useState<string>("7d");

  const filteredLocations = locations
    .filter(location => filterType === "all" || location.userType === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case "revenue":
          return b.totalRevenue - a.totalRevenue;
        case "orders":
          return b.purchaseCount - a.purchaseCount;
        case "rating":
          return b.rating - a.rating;
        case "coverage":
          return b.coverage - a.coverage;
        default:
          return b.totalRevenue - a.totalRevenue;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your business performance and coverage areas</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Total Customers",
              value: analyticsData.totalCustomers.toLocaleString(),
              icon: Users,
              color: "from-blue-500 to-blue-600",
              change: "+12.5%",
              trend: "up"
            },
            {
              title: "Total Revenue",
              value: `${(analyticsData.totalRevenue / 1000000).toFixed(1)}M RWF`,
              icon: DollarSign,
              color: "from-green-500 to-green-600",
              change: "+23.5%",
              trend: "up"
            },
            {
              title: "Total Orders",
              value: analyticsData.totalOrders.toLocaleString(),
              icon: ShoppingCart,
              color: "from-purple-500 to-purple-600",
              change: "+18.2%",
              trend: "up"
            },
            {
              title: "Average Rating",
              value: analyticsData.averageRating.toFixed(1),
              icon: Star,
              color: "from-yellow-500 to-yellow-600",
              change: "+0.3",
              trend: "up"
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {metric.trend === "up" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span>{metric.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600">{metric.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as "all" | "client" | "distributor")}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="client">Clients Only</option>
                <option value="distributor">Distributors Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="revenue">Sort by Revenue</option>
                <option value="orders">Sort by Orders</option>
                <option value="rating">Sort by Rating</option>
                <option value="coverage">Sort by Coverage</option>
              </select>

              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            <motion.button
              onClick={() => setShowMap(!showMap)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>{showMap ? "Hide Map" : "Show Map"}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Coverage Map */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg mb-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Coverage Areas
              </h3>
              
              <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl relative overflow-hidden">
                {/* Simulated Map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Compass className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Interactive Coverage Map</p>
                    <p className="text-sm text-gray-500">Showing {filteredLocations.length} locations</p>
                  </div>
                </div>
                
                {/* Location Pins */}
                {filteredLocations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`absolute w-4 h-4 rounded-full cursor-pointer ${
                      location.userType === "distributor" 
                        ? "bg-blue-500 border-2 border-blue-600" 
                        : "bg-green-500 border-2 border-green-600"
                    }`}
                    style={{
                      left: `${20 + (location.lng + 180) / 360 * 60}%`,
                      top: `${50 - (location.lat) / 180 * 40}%`
                    }}
                    onClick={() => setSelectedLocation(location)}
                    whileHover={{ scale: 1.5 }}
                  >
                    <div className="absolute -top-8 -left-8 bg-white rounded-lg shadow-lg p-2 text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                      <p className="font-medium">{location.name}</p>
                      <p className="text-gray-600">{location.userType}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Top Locations
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLocations.map((location, index) => (
                  <motion.tr
                    key={location.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8">
                          <div className={`w-8 h-8 rounded-full ${
                            location.userType === "distributor" ? "bg-blue-100" : "bg-green-100"
                          } flex items-center justify-center`}>
                            <MapPin className={`w-4 h-4 ${
                              location.userType === "distributor" ? "text-blue-600" : "text-green-600"
                            }`} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.lastOrder}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        location.userType === "distributor" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {location.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.purchaseCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(location.totalRevenue / 1000000).toFixed(1)}M RWF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-900">{location.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${location.coverage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">{location.coverage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        location.status === "active" 
                          ? "bg-green-100 text-green-800"
                          : location.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {location.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Location Details Modal */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedLocation(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Location Details</h3>
                  <button onClick={() => setSelectedLocation(null)}>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full ${
                      selectedLocation.userType === "distributor" ? "bg-blue-100" : "bg-green-100"
                    } flex items-center justify-center`}>
                      <MapPin className={`w-6 h-6 ${
                        selectedLocation.userType === "distributor" ? "text-blue-600" : "text-green-600"
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedLocation.name}</h4>
                      <p className="text-sm text-gray-600">{selectedLocation.userType}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Orders</p>
                      <p className="text-lg font-bold text-gray-900">{selectedLocation.purchaseCount.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-lg font-bold text-gray-900">{(selectedLocation.totalRevenue / 1000000).toFixed(1)}M RWF</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Rating</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-bold">{selectedLocation.rating}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Coverage</p>
                      <p className="text-lg font-bold text-gray-900">{selectedLocation.coverage}%</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Export Data
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 