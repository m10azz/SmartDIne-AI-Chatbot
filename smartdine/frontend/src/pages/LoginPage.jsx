import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, UtensilsCrossed, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Both email and password are required');
    }

    if (!validateEmail(email)) {
      return setError('Please enter a valid email address');
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      
      // Save token and user to context
      login(res.data.user, res.data.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="p-8">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
              <UtensilsCrossed size={32} className="text-[#FF6B35]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your SmartDine account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-start gap-2 border border-red-100">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 px-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs font-semibold text-[#FF6B35] hover:text-[#e85a2b]">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#FF6B35] hover:bg-[#e85a2b] text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-orange-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : "Login"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#FF6B35] hover:text-[#e85a2b] transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}