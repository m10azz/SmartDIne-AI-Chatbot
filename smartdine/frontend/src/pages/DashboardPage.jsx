import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Settings, Heart, Receipt, IndianRupee, Calendar, Clock, Plus, Star } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function DashboardPage() {
  const { user, logout } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [dietPref, setDietPref] = useState('No Preference');
  const [savingMsg, setSavingMsg] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const [profileRes, ordersRes, menuRes] = await Promise.all([
          api.get('/auth/profile'),
          api.get(`/orders/${user.id}`),
          api.get('/menu')
        ]);

        setProfile(profileRes.data);
        setOrders(ordersRes.data);
        
        if (profileRes.data.preferences?.diet) {
          setDietPref(profileRes.data.preferences.diet);
        }

        // Get 4 random or top-rated items for recommendations
        const topItems = menuRes.data.sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 4);
        setRecommendations(topItems);
        
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSavePreferences = async () => {
    try {
      setSavingMsg('Saving...');
      await api.put('/auth/profile', {
        preferences: { diet: dietPref }
      });
      setSavingMsg('Saved successfully!');
      setTimeout(() => setSavingMsg(''), 2000);
    } catch (err) {
      setSavingMsg('Failed to save.');
      setTimeout(() => setSavingMsg(''), 2000);
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
  const memberSince = profile ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
  const recentOrders = orders.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Here is a summary of your SmartDine activity.</p>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Stat 1: Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Receipt size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>

          {/* Stat 2: Favorites */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center">
              <Heart size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Favorites</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>

          {/* Stat 3: Spent */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <IndianRupee size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toFixed(2)}</p>
            </div>
          </div>

          {/* Stat 4: Member Since */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Member Since</p>
              <p className="text-xl font-bold text-gray-900 truncate">{memberSince}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Recent Orders */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <Link to="/orders" className="text-sm font-semibold text-[#FF6B35] hover:text-[#e85a2b]">View All</Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p>You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map(order => {
                    let itemsPreview = '';
                    const parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                    if (parsedItems && parsedItems.length > 0) {
                      itemsPreview = parsedItems.map(i => `${i.quantity}x ${i.name}`).join(', ');
                    }

                    return (
                      <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-100 text-[#FF6B35] rounded-lg flex items-center justify-center">
                            <Receipt size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Order #{order.id.toString().padStart(6, '0')}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-xs">{itemsPreview}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-extrabold text-gray-900">₹{Number(order.total_price).toFixed(2)}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'preparing' ? 'bg-blue-100 text-blue-700' : 
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Recommendations */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended For You</h2>
              <div className="flex overflow-x-auto pb-6 gap-6 snap-x hide-scrollbar">
                {recommendations.map(item => (
                  <div key={item.id} className="min-w-[280px] bg-white rounded-2xl shadow-sm border border-gray-100 p-4 snap-start shrink-0 flex flex-col">
                    <div className="h-32 rounded-xl overflow-hidden mb-4 bg-gray-100">
                      <img 
                        src={item.image_url || `https://source.unsplash.com/300x200/?food,${item.category}`} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 truncate pr-2">{item.name}</h3>
                      <div className="flex items-center text-xs font-bold text-orange-500">
                        <Star size={12} className="fill-current mr-0.5" /> {Number(item.rating).toFixed(1)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">{item.calories} kcal</p>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <span className="font-extrabold text-lg text-gray-900">₹{item.price}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="bg-gray-100 hover:bg-[#FF6B35] hover:text-white p-2 rounded-lg transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Sidebar / Profile Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings size={20} className="text-gray-400" />
                Profile Settings
              </h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Name</label>
                  <p className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{profile?.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email</label>
                  <p className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{profile?.email}</p>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Diet Preference</label>
                  <select 
                    value={dietPref}
                    onChange={(e) => setDietPref(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:outline-none text-gray-900 font-medium"
                  >
                    <option value="No Preference">No Preference</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${savingMsg.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                  {savingMsg}
                </span>
                <button 
                  onClick={handleSavePreferences}
                  className="bg-[#FF6B35] hover:bg-[#e85a2b] text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
                >
                  Save
                </button>
              </div>
            </div>

            <button 
              onClick={() => logout()}
              className="w-full bg-white hover:bg-red-50 text-red-500 border border-red-100 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <LogOut size={18} />
              Sign Out
            </button>

          </motion.div>

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}