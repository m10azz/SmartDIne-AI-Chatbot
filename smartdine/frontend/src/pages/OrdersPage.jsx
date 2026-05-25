import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PackageOpen, Clock, CheckCircle2, ChevronRight, Receipt } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get(`/orders/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return { color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={16} />, barWidth: '33%', barColor: 'bg-yellow-400' };
      case 'preparing': return { color: 'bg-blue-100 text-blue-700', icon: <PackageOpen size={16} />, barWidth: '66%', barColor: 'bg-blue-500' };
      case 'delivered': return { color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={16} />, barWidth: '100%', barColor: 'bg-green-500' };
      default: return { color: 'bg-gray-100 text-gray-700', icon: <Clock size={16} />, barWidth: '0%', barColor: 'bg-gray-400' };
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-8"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-48 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Receipt size={48} className="text-[#FF6B35]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            You haven't placed any orders. Hungry? Check out our menu!
          </p>
          <Link to="/menu" className="inline-flex items-center gap-2 bg-[#FF6B35] text-white px-8 py-3 rounded-full font-bold hover:bg-[#e85a2b] transition-colors shadow-lg shadow-orange-200">
            Explore Menu <ChevronRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            // Items are stored as JSON in DB, parse if needed
            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Order #{order.id.toString().padStart(6, '0')}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${statusConfig.color}`}>
                    {statusConfig.icon}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>

                {/* Body: Items & Price */}
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex-grow">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</h4>
                    <ul className="space-y-3">
                      {items && items.map((item, i) => (
                        <li key={i} className="flex justify-between items-start text-sm">
                          <div className="flex gap-3">
                            <span className="font-medium text-gray-900">{item.quantity}x</span>
                            <span className="text-gray-700">{item.name}</span>
                          </div>
                          <span className="text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="w-full md:w-48 flex-shrink-0 bg-gray-50 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Paid</span>
                    <span className="text-2xl font-extrabold text-[#FF6B35]">₹{Number(order.total_price).toFixed(2)}</span>
                  </div>
                </div>

                {/* Footer: Progress Bar */}
                <div className="bg-gray-50 px-6 py-4">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 px-1">
                    <span>Received</span>
                    <span>Preparing</span>
                    <span>Delivered</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: statusConfig.barWidth }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${statusConfig.barColor}`}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}