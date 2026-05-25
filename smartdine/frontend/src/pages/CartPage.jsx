import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, CheckCircle2, Ticket } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleApplyCoupon = () => {
    // Dummy coupon logic
    if (couponCode.toUpperCase() === 'SMART10') {
      setDiscount(total * 0.10);
      setError('');
    } else {
      setDiscount(0);
      setError('Invalid coupon code');
    }
  };

  const finalTotal = total - discount;

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Map cartItems to what the backend expects (menu_item_id instead of id)
      const formattedItems = cartItems.map(item => ({
        ...item,
        menu_item_id: item.id
      }));

      await api.post('/orders', {
        items: formattedItems,
        total_price: finalTotal
      });

      setSuccess(true);
      setTimeout(() => {
        clearCart();
        navigate('/orders');
      }, 2000);

    } catch (err) {
      setError('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  const getCategoryColor = (cat) => {
    if (cat === 'Veg') return 'bg-green-100 text-green-700';
    if (cat === 'Non-Veg') return 'bg-red-100 text-red-700';
    if (cat === 'Vegan') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  // Success Animation Overlay
  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white p-10 rounded-3xl shadow-xl flex flex-col items-center text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 size={80} className="text-green-500 mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-6">Your delicious food is being prepared.</p>
          <div className="w-12 h-1 bg-[#FF6B35] rounded-full animate-pulse"></div>
        </motion.div>
      </div>
    );
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-[#FF6B35]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Discover our delicious menu items!
          </p>
          <Link 
            to="/menu" 
            className="inline-flex items-center gap-2 bg-[#FF6B35] text-white px-8 py-3 rounded-full font-bold hover:bg-[#e85a2b] transition-colors shadow-lg shadow-orange-200"
          >
            Explore Menu <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items List */}
          <div className="flex-grow space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center"
                >
                  <img 
                    src={item.image_url || `https://source.unsplash.com/100x100/?food,${item.category}`} 
                    alt={item.name} 
                    className="w-24 h-24 object-cover rounded-xl"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80'; }}
                  />
                  
                  <div className="flex-grow flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">{item.calories} kcal</span>
                    </div>
                    <span className="font-extrabold text-[#FF6B35]">₹{item.price}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-gray-500 hover:text-[#FF6B35] transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-gray-500 hover:text-[#FF6B35] transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-gray-900">₹{total.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span className="font-medium text-gray-900">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-[#FF6B35]">₹{finalTotal.toFixed(2)}</span>
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Promo Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="SMART10"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all uppercase text-sm"
                    />
                  </div>
                  <button 
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {error && error !== 'Failed to place order. Please try again.' && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
                {discount > 0 && (
                  <p className="text-green-500 text-xs mt-1 font-medium">Coupon applied successfully!</p>
                )}
              </div>

              {error === 'Failed to place order. Please try again.' && (
                <div className="mb-4 text-red-500 text-sm font-medium text-center">{error}</div>
              )}

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-[#FF6B35] hover:bg-[#e85a2b] text-white py-4 rounded-xl font-bold transition-all shadow-md shadow-orange-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Place Order (₹${finalTotal.toFixed(2)})`}
              </button>

              {!user && (
                <p className="text-xs text-center text-gray-500 mt-4">
                  You will be redirected to log in first.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}