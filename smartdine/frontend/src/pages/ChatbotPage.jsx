import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, Search, Utensils } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: "Hi! I'm your SmartDine AI assistant. Tell me your diet preferences, budget, or cravings and I'll suggest the perfect dish for you! 🍽" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { addToCart } = useContext(CartContext);

  const suggestions = [
    "Low calorie meal",
    "High protein under ₹200",
    "Spicy veg food",
    "Best rated dessert",
    "Vegan options"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    // Add user message
    const userMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/chatbot', { message: textToSend });
      
      // Add bot message
      const botMessage = { 
        role: 'bot', 
        text: res.data.reply,
        items: res.data.items 
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "Sorry, I'm having trouble connecting right now. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const getCategoryColor = (cat) => {
    if (cat === 'Veg') return 'bg-green-100 text-green-700';
    if (cat === 'Non-Veg') return 'bg-red-100 text-red-700';
    if (cat === 'Vegan') return 'bg-blue-100 text-blue-700';
    if (cat === 'Dessert') return 'bg-purple-100 text-purple-700';
    if (cat === 'Drinks') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col items-center py-6 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="w-full max-w-3xl mb-6 flex items-center justify-center gap-3">
        <div className="w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center text-white shadow-md">
          <Utensils size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SmartDine AI</h1>
          <p className="text-sm text-gray-500">Your personal food concierge</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="w-full max-w-3xl flex-grow bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  {msg.role === 'bot' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-sm shadow-sm mt-1">
                      🍽
                    </div>
                  )}

                  {/* Message Content */}
                  <div>
                    <div 
                      className={`px-4 py-3 rounded-2xl whitespace-pre-wrap shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-[#FF6B35] text-white rounded-tr-sm' 
                          : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Render Mini Cards if items exist */}
                    {msg.items && msg.items.length > 0 && (
                      <div className="mt-4 flex flex-col gap-4">
                        {msg.items.map(item => (
                          <div key={item.id} className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl p-3 shadow-md flex gap-4 hover:shadow-lg transition-shadow group">
                            {/* Image */}
                            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                              <img 
                                src={item.image_url || `https://source.unsplash.com/400x300/?food,${item.category}`} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            
                            {/* Content */}
                            <div className="flex flex-col flex-grow">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-gray-900 leading-tight pr-2">{item.name}</h4>
                                <span className="flex items-center text-xs font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                                  ★ {Number(item.rating).toFixed(1)}
                                </span>
                              </div>
                              
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold self-start mb-2 ${getCategoryColor(item.category)}`}>
                                {item.category}
                              </span>
                              
                              {/* Macros */}
                              <div className="flex gap-2 text-[10px] text-gray-500 font-medium mb-2">
                                <span title="Calories">🔥 {item.calories} kcal</span>
                                <span title="Protein">🥩 {item.protein}g</span>
                                {item.carbs && <span title="Carbs">🌾 {item.carbs}g</span>}
                                {item.fats && <span title="Fats">🥑 {item.fats}g</span>}
                              </div>

                              <div className="flex justify-between items-end mt-auto">
                                <p className="font-extrabold text-[#FF6B35] text-lg leading-none">₹{item.price}</p>
                                <button 
                                  onClick={() => addToCart(item)}
                                  className="bg-[#FF6B35] text-white p-1.5 rounded-lg hover:bg-[#e85a2b] transition-colors shadow-sm active:scale-95"
                                  title="Add to Cart"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-sm shadow-sm">
                  🍽
                </div>
                <div className="bg-gray-100 px-4 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  <motion.div 
                    animate={{ y: [0, -5, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div 
                    animate={{ y: [0, -5, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div 
                    animate={{ y: [0, -5, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-6">
          
          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(suggestion)}
                  className="bg-white border border-[#FF6B35]/30 text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors shadow-sm flex items-center gap-1"
                >
                  <Search size={12} />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything about food..."
              className="flex-1 bg-white border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all shadow-sm"
              disabled={isTyping}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className={`p-3 rounded-full flex items-center justify-center transition-all ${
                input.trim() && !isTyping 
                  ? 'bg-[#FF6B35] text-white shadow-md hover:bg-[#e85a2b] hover:-translate-y-0.5' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={20} className={input.trim() && !isTyping ? "ml-1" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}