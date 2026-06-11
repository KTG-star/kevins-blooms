import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, LogOut, Menu, X, Heart, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-4 glass border-b border-white/10' 
          : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {!isHome && (
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-full bg-white shadow-sm text-bloom-green hover:bg-bloom-pink hover:text-white transition-all group"
              title="Go Back"
            >
              <ArrowLeft size={18} className="group-active:-translate-x-1 transition-transform" />
            </button>
          )}
          {/* Logo */}
          <Link to="/" className="relative z-50 group nav-logo">
            <h1 className="text-2xl md:text-3xl font-cormorant font-bold text-bloom-green">
              Kelvin's <span className="text-bloom-pink group-hover:text-bloom-gold transition-colors">Blooms</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          {[
            { label: 'Shop All', path: '/shop' },
            { label: 'Bestsellers', path: '/shop?sort=Most Popular' },
            { label: 'Collections', path: '/shop' },
            { label: 'Occasions', path: '/shop' },
          ].map((item) => (
            <Link 
              key={item.label}
              to={item.path}
              className="relative text-[10px] font-bold uppercase tracking-widest text-bloom-green/60 hover:text-bloom-pink transition-colors group"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 w-0 h-[1.5px] bg-bloom-pink transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              theme === 'dark' 
                ? 'theme-toggle-dark' 
                : 'bg-white shadow-sm text-bloom-green'
            }`}
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <Link to="/dashboard?tab=wishlist" className="relative group text-bloom-green hover:text-bloom-pink transition-colors">
            <Heart size={24} />
          </Link>

          <Link to="/cart" className="relative group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={totalItems > 0 ? { scale: [1, 1.2, 1] } : {}}
              className="text-bloom-green hover:text-bloom-pink transition-colors"
            >
              <ShoppingBag size={24} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-bloom-pink text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                className="hidden md:flex items-center gap-2 group"
              >
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.fullName} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-bloom-pink/20 group-hover:border-bloom-pink transition-all"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-bloom-pink/20 flex items-center justify-center text-bloom-pink group-hover:bg-bloom-pink group-hover:text-white transition-all">
                    <User size={18} />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-bloom-green/80 leading-none">{user.fullName.split(' ')[0]}</span>
                  {user.role === 'admin' && <span className="text-[10px] font-bold text-bloom-pink uppercase tracking-tighter">Admin</span>}
                </div>
              </Link>
              <button 
                onClick={logout}
                className="text-bloom-green/60 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-bloom-green text-bloom-cream px-6 py-2 rounded-full text-sm font-medium uppercase tracking-widest"
              >
                Login
              </motion.button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-bloom-green"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bloom-cream border-t border-bloom-green/10 overflow-hidden"
          >
            <div className="p-8 flex flex-col gap-6">
              {[
                { label: 'Shop All', path: '/shop' },
                { label: 'Bestsellers', path: '/shop?sort=Most Popular' },
                { label: 'Collections', path: '/shop' },
                { label: 'Occasions', path: '/shop' },
              ].map((item) => (
                <Link 
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-cormorant text-bloom-green hover:text-bloom-pink transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-bloom-green/10">
                {user ? (
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-cormorant text-bloom-green">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-cormorant text-bloom-green">
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
