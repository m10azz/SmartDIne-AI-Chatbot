import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, MessageSquareText, Search, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

export default function HomePage() {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await api.get('/menu');
        // Sort by rating to show the best ones, taking top 4
        const items = res.data;
        const topItems = items.sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 4);
        setRecommended(topItems);
      } catch (err) {
        console.error("Failed to fetch recommended items", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommended();
  }, []);

  const categories = [
    { name: 'Veg', icon: '🥗', filter: 'Veg' },
    { name: 'Non-Veg', icon: '🍗', filter: 'Non-Veg' },
    { name: 'Vegan', icon: '🌱', filter: 'Vegan' },
    { name: 'Desserts', icon: '🍰', filter: 'Dessert' },
    { name: 'Drinks', icon: '🥤', filter: 'Drinks' },
  ];

  const steps = [
    { title: 'Tell us your preference', icon: <MessageSquareText size={40} className="text-white" />, desc: 'Chat with our AI about what you are craving, diet, or calories.' },
    { title: 'AI suggests dishes', icon: <Search size={40} className="text-white" />, desc: 'Get personalized recommendations instantly from our diverse menu.' },
    { title: 'You order and enjoy', icon: <ShoppingBag size={40} className="text-white" />, desc: 'Add to cart, place your order securely, and we handle the rest.' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-br from-[#FF6B35] to-[#ffb84d]">
        {/* Subtle pattern or overlay could go here */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            Smart Dining, <br className="hidden md:block"/> Personalized for You
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl text-xl text-orange-50 mx-auto mb-10"
          >
            Discover dishes tailored to your taste buds and dietary goals with our AI-powered restaurant assistant.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/menu" 
              className="px-8 py-4 bg-white text-[#FF6B35] rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Explore Menu
            </Link>
            <Link 
              to="/chatbot" 
              className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageSquareText size={20} />
              Try AI Chatbot
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Categories</h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/menu?category=${cat.filter}`)}
                className="flex flex-col items-center justify-center w-32 h-32 bg-orange-50 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md hover:border-[#FF6B35] transition-all cursor-pointer group"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="font-semibold text-gray-800">{cat.name}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Book a Table Promotional Section */}
      <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Book Your Table Today</h2>
              <p className="text-gray-300 text-lg mb-8">
                Experience the perfect ambiance with our curated menu. Reserve your spot now for an unforgettable culinary journey.
              </p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/reservation" 
                className="bg-[#FF6B35] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#e85a2b] transition-colors inline-flex items-center shadow-lg"
              >
                Reserve a Table <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Recommended for You Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Recommended for You</h2>
              <p className="text-gray-600 mt-2">Top-rated dishes loved by our customers.</p>
            </div>
            <Link to="/menu" className="hidden sm:flex items-center text-[#FF6B35] font-semibold hover:text-[#e85a2b]">
              See all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white h-80 rounded-2xl shadow-sm"></div>
              ))}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {recommended.map((item) => (
                <motion.div 
                  key={item.id} 
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden flex flex-col group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={item.image_url || `https://source.unsplash.com/400x300/?food,${item.category}`} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                      {item.category}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2">{item.name}</h3>
                      <div className="flex items-center bg-orange-100 px-2 py-1 rounded text-xs font-bold text-orange-600 ml-2">
                        <Star size={12} className="mr-1 fill-current" />
                        {Number(item.rating).toFixed(1)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">{item.calories} kcal</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-extrabold text-xl text-gray-900">₹{item.price}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="bg-gray-100 hover:bg-[#FF6B35] hover:text-white text-gray-800 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B35]"
                        aria-label="Add to cart"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* 5. How it works section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 z-0"></div>
            
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className="w-24 h-24 bg-[#FF6B35] rounded-full flex items-center justify-center shadow-lg shadow-orange-200 mb-6 relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}