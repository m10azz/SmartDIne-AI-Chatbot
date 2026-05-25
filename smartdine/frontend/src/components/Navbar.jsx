import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, UtensilsCrossed, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <UtensilsCrossed className="text-[#FF6B35]" size={32} />
            <span className="font-bold text-xl tracking-tight">Smart<span className="text-[#FF6B35]">Dine</span></span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-[#FF6B35] font-medium transition-colors">Home</Link>
            <Link to="/menu" className="text-gray-600 hover:text-[#FF6B35] font-medium transition-colors">Menu</Link>
            <Link to="/reservation" className="text-gray-600 hover:text-[#FF6B35] font-medium transition-colors">Reserve Table</Link>
            <Link to="/chatbot" className="text-gray-600 hover:text-[#FF6B35] font-medium transition-colors">AI Assistant</Link>
            {user && (
              <Link to="/orders" className="text-gray-600 hover:text-[#FF6B35] font-medium transition-colors">My Orders</Link>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            
            {/* Cart Icon */}
            <Link to="/cart" className="relative text-gray-600 hover:text-[#FF6B35] transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF6B35] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="hidden md:flex items-center gap-1 text-gray-600 hover:text-[#FF6B35] font-medium transition-colors">
                  <User size={18} />
                  <span>{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-500 font-medium transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-[#FF6B35] font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-[#FF6B35] hover:bg-[#e85a2b] text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
