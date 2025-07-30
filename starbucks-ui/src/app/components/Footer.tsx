"use client";

import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Clock, Heart, Star, Shield, Truck, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  const quickLinks = [
    { href: "/client", label: "Shop Now" },
    { href: "/distributor", label: "Become a Distributor" },
    { href: "/international-shipping", label: "International Shipping" },
    { href: "/admin", label: "Admin Portal" }
  ];

  const features = [
    { icon: Star, title: "Premium Quality", description: "Finest spices from around the world" },
    { icon: Shield, title: "Secure Payments", description: "Safe transactions with Flutterwave" },
    { icon: Truck, title: "Fast Delivery", description: "Quick and reliable shipping" },
    { icon: Globe, title: "Global Reach", description: "Serving customers worldwide" }
  ];

  return (
    <motion.footer 
      className="bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-white relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-500/10 rounded-full blur-lg"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.4, 0.1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <motion.div 
                className="flex items-center space-x-3 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Emmy Spices Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <h3 className="text-2xl font-bold">Emmy Spices</h3>
              </motion.div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Premium spice distribution platform connecting the world's finest spices with discerning customers. 
                Quality, authenticity, and global reach define our mission.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.2, 
                      y: -3,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-300 group"
                  >
                    <social.icon className="w-5 h-5 text-white group-hover:text-white" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-xl font-semibold mb-6 text-green-400">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.label}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <motion.div
                        className="w-1 h-1 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                      />
                      <span>{link.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Features */}
            <motion.div variants={itemVariants}>
              <h4 className="text-xl font-semibold mb-6 text-green-400">Why Choose Us</h4>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <motion.li
                    key={feature.title}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start space-x-3"
                  >
                    <motion.div
                      className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center mt-1"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="w-4 h-4 text-green-400" />
                    </motion.div>
                    <div>
                      <h5 className="font-medium text-white mb-1">{feature.title}</h5>
                      <p className="text-sm text-gray-300">{feature.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h4 className="text-xl font-semibold mb-6 text-green-400">Contact Info</h4>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Address</p>
                    <p className="text-sm text-gray-300">Kigali, Rwanda</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <p className="text-sm text-gray-300">+250 123 456 789</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-sm text-gray-300">info@emmyspices.com</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Hours</p>
                    <p className="text-sm text-gray-300">Mon-Fri: 8AM-6PM</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div 
          className="border-t border-white/10 py-8"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4 text-green-400">Stay Updated</h4>
              <p className="text-gray-300 mb-6">Get the latest updates on new products and special offers</p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  Subscribe
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-white/10 py-6"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <motion.p 
                className="text-gray-300 text-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                © 2024 Emmy Spices. All rights reserved.
              </motion.p>
              
              <motion.div 
                className="flex items-center space-x-6 text-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Cookie Policy
                </Link>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-2 text-sm text-gray-300"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span>in Rwanda</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer; 