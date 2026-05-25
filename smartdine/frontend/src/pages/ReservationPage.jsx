import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, User, Phone, Mail, CheckCircle, Info } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ReservationPage() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    special_requests: ''
  });
  const [myReservations, setMyReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const timeSlots = ['12:00 PM', '1:00 PM', '2:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];

  useEffect(() => {
    if (user) {
      fetchMyReservations();
    }
  }, [user]);

  const fetchMyReservations = async () => {
    try {
      const res = await api.get('/reservations/my');
      setMyReservations(res.data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestChange = (delta) => {
    setFormData(prev => ({
      ...prev,
      guests: Math.max(1, Math.min(10, prev.guests + delta))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!user) {
      setError('Please log in to make a reservation');
      setLoading(false);
      return;
    }

    if (!formData.time) {
      setError('Please select a time slot');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/reservations', formData);
      setSuccess(res.data);
      fetchMyReservations();
      // Reset form (keep name/email)
      setFormData(prev => ({
        ...prev,
        phone: '',
        date: '',
        time: '',
        guests: 2,
        special_requests: ''
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to make reservation');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay' }}></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Book a Table
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Experience culinary excellence in our beautifully designed ambiance. Reserve your table for an unforgettable dining journey.
          </motion.p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Column */}
          <div className="lg:col-span-2">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-8">We've reserved a table for you. We look forward to hosting you.</p>
                
                <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto mb-8 border border-gray-100">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Booking Details</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-mono font-bold text-gray-800">{success.id.substring(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-800">{new Date(success.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium text-gray-800">{success.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium text-gray-800">{success.guests} People</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSuccess(null)}
                  className="bg-[#FF6B35] text-white px-8 py-3 rounded-full font-medium hover:bg-[#e85a25] transition-colors"
                >
                  Make Another Booking
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Reservation Details</h2>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start">
                    <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[#FF6B35] focus:border-[#FF6B35] bg-gray-50"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[#FF6B35] focus:border-[#FF6B35] bg-gray-50"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[#FF6B35] focus:border-[#FF6B35] bg-gray-50"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="date"
                          required
                          min={today}
                          value={formData.date}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[#FF6B35] focus:border-[#FF6B35] bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Available Time Slots
                      </div>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, time }))}
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                            formData.time === time 
                              ? 'bg-[#FF6B35] border-[#FF6B35] text-white' 
                              : 'bg-white border-gray-200 text-gray-700 hover:border-[#FF6B35] hover:text-[#FF6B35]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl w-48 p-1">
                      <button 
                        type="button"
                        onClick={() => handleGuestChange(-1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center font-bold text-gray-800 flex items-center justify-center">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        {formData.guests}
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleGuestChange(1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                    <textarea
                      name="special_requests"
                      rows="3"
                      value={formData.special_requests}
                      onChange={handleInputChange}
                      className="block w-full p-3 border border-gray-200 rounded-xl focus:ring-[#FF6B35] focus:border-[#FF6B35] bg-gray-50 resize-none"
                      placeholder="E.g., Anniversary dinner, window seating preferred..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !user}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all transform ${
                      loading || !user ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF6B35] hover:bg-[#e85a25] hover:shadow-lg active:scale-[0.98]'
                    }`}
                  >
                    {loading ? 'Processing...' : !user ? 'Login to Book Table' : 'Confirm Reservation'}
                  </button>
                </form>
              </motion.div>
            )}
          </div>

          {/* Right Column - My Reservations */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-[#FF6B35]" />
                My Reservations
              </h2>

              {!user ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Please log in to see your past reservations.</p>
                </div>
              ) : myReservations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500">You don't have any reservations yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {myReservations.map((res) => (
                    <div key={res.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-800">
                          {new Date(res.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          res.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                          res.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center mb-1">
                        <Clock className="w-3 h-3 mr-1.5" /> {res.time}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Users className="w-3 h-3 mr-1.5" /> {res.guests} Guests
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
