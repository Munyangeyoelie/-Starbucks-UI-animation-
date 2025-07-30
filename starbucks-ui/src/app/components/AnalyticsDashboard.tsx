"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package,
  Eye,
  Clock,
  Star,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  X
} from "lucide-react";

interface Metric {
  id: string;
  title: string;
  value: number;
  change: number;
  icon: any;
  color: string;
  trend: 'up' | 'down';
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

export default function AnalyticsDashboard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      id: "1",
      title: "Total Sales",
      value: 2450000,
      change: 12.5,
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      trend: 'up'
    },
    {
      id: "2",
      title: "Orders",
      value: 156,
      change: 8.2,
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-600",
      trend: 'up'
    },
    {
      id: "3",
      title: "Customers",
      value: 89,
      change: -2.1,
      icon: Users,
      color: "from-purple-500 to-pink-600",
      trend: 'down'
    },
    {
      id: "4",
      title: "Products Sold",
      value: 423,
      change: 15.7,
      icon: Package,
      color: "from-orange-500 to-red-600",
      trend: 'up'
    }
  ]);

  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + Math.floor(Math.random() * 1000),
        change: metric.change + (Math.random() - 0.5) * 2
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const chartData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)'
      },
      {
        label: 'Orders',
        data: [8, 12, 10, 15, 13, 18, 16],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)'
      }
    ]
  };

  const topProducts = [
    { name: "Premium Black Pepper", sales: 45000, units: 3 },
    { name: "Organic Cinnamon", sales: 38000, units: 2 },
    { name: "Saffron Gold", sales: 55000, units: 1 },
    { name: "Cardamom Supreme", sales: 28000, units: 1 },
    { name: "Gourmet Nutmeg", sales: 22000, units: 1 }
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Sarah Johnson", amount: 45000, status: "Delivered", time: "2 hours ago" },
    { id: "ORD-002", customer: "Michael Chen", amount: 73000, status: "Processing", time: "4 hours ago" },
    { id: "ORD-003", customer: "Amina Hassan", amount: 28000, status: "Shipped", time: "6 hours ago" },
    { id: "ORD-004", customer: "David Kim", amount: 55000, status: "Pending", time: "8 hours ago" }
  ];

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
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                    <p className="text-gray-300">Real-time insights and performance metrics</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
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
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center`}>
                        <metric.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center space-x-1 text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{Math.abs(metric.change).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{formatValue(metric.value)}</p>
                      <p className="text-gray-600 text-sm">{metric.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Charts and Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Sales</span>
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Orders</span>
                    </div>
                  </div>
                  
                  {/* Simple Chart Visualization */}
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {chartData.datasets[0].data.map((value, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div className="w-8 bg-green-500 rounded-t" style={{ height: `${(value / 30000) * 200}px` }}></div>
                        <span className="text-xs text-gray-500">{chartData.labels[index]}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Top Products */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h3>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <motion.div
                        key={product.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-green-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.units} units sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{product.sales.toLocaleString()} RWF</p>
                          <p className="text-xs text-gray-500">{product.units} units</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                          <td className="py-3 px-4 text-gray-700">{order.customer}</td>
                          <td className="py-3 px-4 font-semibold text-gray-900">{order.amount.toLocaleString()} RWF</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-sm">{order.time}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 