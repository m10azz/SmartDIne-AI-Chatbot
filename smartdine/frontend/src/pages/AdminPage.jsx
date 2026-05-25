import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Receipt, Utensils, Edit, Trash2, Plus, X, Search } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AdminPage() {
  const { user, authLoading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('menu');
  const [loading, setLoading] = useState(true);

  // Data states
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const initialFormState = {
    name: '', category: 'Veg', price: '', description: '', 
    calories: '', protein: '', carbs: '', fats: '', 
    image_url: '', is_available: true
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (!user || user.isAdmin !== true) return;
    fetchData(activeTab);
  }, [activeTab, user]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'menu') {
        const res = await api.get('/menu');
        setMenuItems(res.data);
      } else if (tab === 'orders') {
        const res = await api.get('/orders');
        setOrders(res.data);
      } else if (tab === 'users') {
        const res = await api.get('/users');
        setUsersList(res.data);
      }
    } catch (err) {
      console.error(`Failed to fetch ${tab}`, err);
    } finally {
      setLoading(false);
    }
  };

  // --- Auth Check ---
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.isAdmin !== true) {
    return <Navigate to="/dashboard" replace />;
  }

  // --- Menu Handlers ---
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name, category: item.category, price: item.price,
        description: item.description || '', calories: item.calories || '',
        protein: item.protein || '', carbs: item.carbs || '', fats: item.fats || '',
        image_url: item.image_url || '', is_available: item.is_available
      });
    } else {
      setEditingItem(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/menu/${editingItem.id}`, formData);
      } else {
        await api.post('/menu', formData);
      }
      setIsModalOpen(false);
      fetchData('menu');
    } catch (err) {
      console.error("Failed to save item", err);
      alert("Error saving item");
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/menu/${id}`);
        fetchData('menu');
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  // --- Order Handlers ---
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchData('orders'); // refresh
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-[calc(100vh-4rem)] p-6">
        <h2 className="text-xl font-extrabold text-gray-900 mb-8 uppercase tracking-wider">Admin Panel</h2>
        <nav className="space-y-2 flex flex-row md:flex-col overflow-x-auto pb-4 md:pb-0">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all shrink-0 ${activeTab === 'menu' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-[#FF6B35]'}`}
          >
            <Utensils size={20} /> Menu Items
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all shrink-0 ${activeTab === 'orders' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-[#FF6B35]'}`}
          >
            <Receipt size={20} /> Orders
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all shrink-0 ${activeTab === 'users' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-gray-600 hover:bg-orange-50 hover:text-[#FF6B35]'}`}
          >
            <Users size={20} /> Users
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">{activeTab} Management</h1>
            {activeTab === 'menu' && (
              <button 
                onClick={() => handleOpenModal()}
                className="bg-[#FF6B35] hover:bg-[#e85a2b] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus size={20} /> <span className="hidden sm:inline">Add New Item</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
              
              {/* TAB: MENU */}
              {activeTab === 'menu' && (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase tracking-wider text-gray-500">
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold">Calories</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {menuItems.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900">{item.name}</td>
                        <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">{item.category}</span></td>
                        <td className="p-4 font-bold text-gray-900">₹{item.price}</td>
                        <td className="p-4 text-gray-500">{item.calories}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.is_available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2 transition-colors"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TAB: ORDERS */}
              {activeTab === 'orders' && (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase tracking-wider text-gray-500">
                      <th className="p-4 font-semibold">Order ID</th>
                      <th className="p-4 font-semibold">Customer</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Total</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold text-gray-900">#{order.id.toString().padStart(6, '0')}</td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{order.user_name}</div>
                          <div className="text-xs text-gray-500">{order.user_email}</div>
                        </td>
                        <td className="p-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                        <td className="p-4 font-extrabold text-[#FF6B35]">₹{Number(order.total_price).toFixed(2)}</td>
                        <td className="p-4">
                          <select 
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`text-sm font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${
                              order.status === 'delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                              order.status === 'preparing' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                              'bg-yellow-50 border-yellow-200 text-yellow-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TAB: USERS */}
              {activeTab === 'users' && (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase tracking-wider text-gray-500">
                      <th className="p-4 font-semibold">User</th>
                      <th className="p-4 font-semibold">Diet Preference</th>
                      <th className="p-4 font-semibold">Member Since</th>
                      <th className="p-4 font-semibold text-center">Total Orders</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {usersList.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {u.name} {u.email === 'admin@smartdine.com' && <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Admin</span>}
                          </div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </td>
                        <td className="p-4 text-gray-700 text-sm">{u.preferences?.diet || 'None'}</td>
                        <td className="p-4 text-sm text-gray-500">{formatDate(u.created_at)}</td>
                        <td className="p-4 text-center font-bold text-gray-900">{u.total_orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </motion.div>
          )}

        </div>
      </main>

      {/* Menu Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900">{editingItem ? 'Edit Menu Item' : 'Add New Item'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-grow">
                <form id="menu-form" onSubmit={handleSaveItem} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                      <input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                      <select value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none bg-white">
                        <option value="Veg">Veg</option><option value="Non-Veg">Non-Veg</option>
                        <option value="Vegan">Vegan</option><option value="Dessert">Dessert</option>
                        <option value="Drinks">Drinks</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹) *</label>
                      <input required type="number" step="0.01" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Calories</label>
                      <input type="number" value={formData.calories} onChange={(e)=>setFormData({...formData, calories: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Protein (g)</label>
                      <input type="number" step="0.1" value={formData.protein} onChange={(e)=>setFormData({...formData, protein: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Carbs (g)</label>
                      <input type="number" step="0.1" value={formData.carbs} onChange={(e)=>setFormData({...formData, carbs: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Fats (g)</label>
                      <input type="number" step="0.1" value={formData.fats} onChange={(e)=>setFormData({...formData, fats: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                      <input type="text" value={formData.image_url} onChange={(e)=>setFormData({...formData, image_url: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none" placeholder="https://..." />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                      <textarea rows="3" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none" />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3 mt-2">
                      <input type="checkbox" id="is_available" checked={formData.is_available} onChange={(e)=>setFormData({...formData, is_available: e.target.checked})} className="w-5 h-5 text-[#FF6B35] rounded focus:ring-[#FF6B35] accent-[#FF6B35]" />
                      <label htmlFor="is_available" className="font-semibold text-gray-700 cursor-pointer">Item is Available</label>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                <button type="submit" form="menu-form" className="px-6 py-2 bg-[#FF6B35] hover:bg-[#e85a2b] text-white font-bold rounded-lg shadow-md transition-colors">Save Item</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
