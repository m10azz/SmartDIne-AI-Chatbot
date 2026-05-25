import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Star, Plus, Filter } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(500);
  const [maxCalories, setMaxCalories] = useState(1000);
  const [dietType, setDietType] = useState('All');
  
  // Mobile sidebar toggle
  const [showFilters, setShowFilters] = useState(false);

  // Favorites state (local for UI purposes)
  const [favorites, setFavorites] = useState(new Set());

  const categories = ['All', 'Veg', 'Non-Veg', 'Vegan', 'Dessert', 'Drinks'];
  const dietTypes = ['All', 'Veg', 'Non-Veg', 'Vegan'];

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== 'All') params.category = category;
        if (maxPrice < 500) params.maxPrice = maxPrice;
        if (maxCalories < 1000) params.maxCalories = maxCalories;
        if (dietType !== 'All') params.dietType = dietType;

        const res = await api.get('/menu', { params });
        console.log('API response:', res.data);
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch menu items", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the fetch slightly to avoid rapid requests while sliding
    const timeoutId = setTimeout(() => {
      fetchMenu();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [category, maxPrice, maxCalories, dietType]);

  // Frontend filter for search term
  const displayedItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) newFavs.delete(id);
      else newFavs.add(id);
      return newFavs;
    });
  };

  const getCategoryColor = (cat) => {
    if (cat === 'Veg') return 'bg-green-100 text-green-700';
    if (cat === 'Non-Veg') return 'bg-red-100 text-red-700';
    if (cat === 'Vegan') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden p-4 bg-white border-b flex gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search menu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 border rounded-lg bg-gray-50 text-gray-700 flex items-center gap-2"
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 lg:w-72 bg-white border-r border-gray-200 p-6 flex-shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto`}>
        <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>

        {/* Search - Desktop */}
        <div className="hidden md:block relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search menu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  category === cat 
                    ? 'bg-[#FF6B35] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Max Price</h3>
            <span className="text-[#FF6B35] font-bold">₹{maxPrice}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="500" 
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#FF6B35]"
          />
        </div>

        {/* Calories Slider */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Max Calories</h3>
            <span className="text-[#FF6B35] font-bold">{maxCalories} kcal</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            step="50"
            value={maxCalories}
            onChange={(e) => setMaxCalories(Number(e.target.value))}
            className="w-full accent-[#FF6B35]"
          />
        </div>

        {/* Dietary Preference */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 mb-3">Dietary Preference</h3>
          <div className="flex flex-col gap-2">
            {dietTypes.map(diet => (
              <label key={diet} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="diet" 
                  checked={dietType === diet}
                  onChange={() => setDietType(diet)}
                  className="w-4 h-4 text-[#FF6B35] focus:ring-[#FF6B35] accent-[#FF6B35]"
                />
                <span className={`text-sm ${dietType === diet ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                  {diet === 'All' ? 'Any' : `${diet} Only`}
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
          <p className="text-gray-500 mt-1">Discover our delicious offerings</p>
        </div>

        {loading ? (
          // Skeleton Loader
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm h-96 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                <div className="p-4 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedItems.length === 0 ? (
          // Empty State
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 bg-orange-100 text-[#FF6B35] rounded-full flex items-center justify-center mb-4">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 max-w-sm">
              We couldn't find any dishes matching your current filters. Try adjusting your search or resetting filters.
            </p>
            <button 
              onClick={() => {
                setSearchTerm(''); setCategory('All'); setMaxPrice(500); setMaxCalories(1000); setDietType('All');
              }}
              className="mt-6 px-6 py-2 bg-[#FF6B35] text-white rounded-full font-medium hover:bg-[#e85a2b] transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          // Menu Grid
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {displayedItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col group relative"
                >
                  {/* Favorite Button */}
                  <button 
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart size={20} className={favorites.has(item.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
                  </button>

                  {/* Image */}
                  <div className="h-48 overflow-hidden relative bg-gray-100">
                    <img 
                      src={item.image_url || `https://source.unsplash.com/400x300/?food,${item.category}`} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'; // Fallback
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <div className="flex items-center text-xs font-bold text-gray-500">
                        <Star size={12} className="mr-1 text-orange-400 fill-orange-400" />
                        {Number(item.rating).toFixed(1)}
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 mb-4 font-medium flex items-center gap-1">
                      <span>🔥 {item.calories} kcal</span>
                    </div>

                    {/* Macros */}
                    <div className="flex gap-2 mb-4 mt-auto">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100">
                        P: {Number(item.protein)}g
                      </span>
                      <span className="text-[10px] font-bold bg-yellow-50 text-yellow-600 px-2 py-1 rounded-md border border-yellow-100">
                        C: {Number(item.carbs)}g
                      </span>
                      <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-1 rounded-md border border-red-100">
                        F: {Number(item.fats)}g
                      </span>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="font-extrabold text-2xl text-gray-900">₹{item.price}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e85a2b] text-white px-4 py-2 rounded-xl font-semibold transition-all active:scale-95 shadow-md shadow-orange-200"
                      >
                        <Plus size={18} />
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}