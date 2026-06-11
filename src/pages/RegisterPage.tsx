import React, { useState, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { ArrowRight, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  useLayoutEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      showToast('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await register(formData);
      if (data.success) {
        showToast('Account created successfully! 🌸');
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-bloom-cream dark:bg-dark-bg" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Left Side - Visual */}
      <div className="hidden md:flex md:w-1/2 aurora-bg relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-cormorant text-bloom-green dark:text-white mb-6"
          >
            Start Your <br />
            <span className="italic">Floral Journey</span>
          </motion.h2>
          <p className="text-bloom-green/60 dark:text-white/50 italic max-w-sm mx-auto">Join the Bloom Club and get access to exclusive seasonal collections and rewards.</p>
        </div>
        
        {/* Floating elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 text-4xl"
        >
          🌸
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 text-4xl"
        >
          🌹
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 lg:p-24 relative overflow-hidden">
        {/* Floating flowers */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-10 text-2xl opacity-20 dark:opacity-10"
        >🌷</motion.div>
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-10 text-2xl opacity-20 dark:opacity-10"
        >🌺</motion.div>
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 right-5 text-xl opacity-10 dark:opacity-5"
        >🌻</motion.div>

        <Link to="/" className="absolute top-12 left-12 flex items-center gap-2 text-bloom-green/40 dark:text-white/30 hover:text-bloom-green dark:hover:text-white transition-all group font-bold text-xs uppercase tracking-widest">
           <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Home
        </Link>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <h1 className="text-4xl font-cormorant text-bloom-green dark:text-white mb-2">Create Account</h1>
          <p className="text-bloom-green/60 dark:text-white/50 mb-8">Join the Kelvin's Blooms family today.</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-bloom-pink/30 dark:text-bloom-pink/20 text-sm opacity-0 group-focus-within:opacity-100 transition-opacity">🌸</div>
              <input 
                type="text" 
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full pl-4 pr-4 py-3 rounded-xl border border-bloom-green/10 dark:border-white/10 bg-white dark:bg-dark-card dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-pink/30 focus:border-bloom-pink/40 transition-all pt-6"
              />
              <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 dark:text-bloom-pink/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-bloom-pink dark:peer-focus:text-bloom-pink">
                Full Name
              </label>
            </div>

            <div className="relative group">
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-bloom-pink/30 dark:text-bloom-pink/20 text-sm opacity-0 group-focus-within:opacity-100 transition-opacity">🌿</div>
              <input 
                type="text" 
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full pl-4 pr-4 py-3 rounded-xl border border-bloom-green/10 dark:border-white/10 bg-white dark:bg-dark-card dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-pink/30 focus:border-bloom-pink/40 transition-all pt-6"
              />
              <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 dark:text-bloom-pink/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-bloom-pink dark:peer-focus:text-bloom-pink">
                Username
              </label>
            </div>

            <div className="relative group">
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-bloom-pink/30 dark:text-bloom-pink/20 text-sm opacity-0 group-focus-within:opacity-100 transition-opacity">🌹</div>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full pl-4 pr-4 py-3 rounded-xl border border-bloom-green/10 dark:border-white/10 bg-white dark:bg-dark-card dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-pink/30 focus:border-bloom-pink/40 transition-all pt-6"
              />
              <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 dark:text-bloom-pink/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-bloom-pink dark:peer-focus:text-bloom-pink">
                Email Address
              </label>
            </div>

            <div className="relative group">
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-bloom-pink/30 dark:text-bloom-pink/20 text-sm opacity-0 group-focus-within:opacity-100 transition-opacity">🔒</div>
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full pl-4 pr-12 py-3 rounded-xl border border-bloom-green/10 dark:border-white/10 bg-white dark:bg-dark-card dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-pink/30 focus:border-bloom-pink/40 transition-all pt-6"
              />
              <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 dark:text-bloom-pink/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-bloom-pink dark:peer-focus:text-bloom-pink">
                Password
              </label>
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-bloom-green/40 dark:text-white/30 hover:text-bloom-green dark:hover:text-white transition-colors mt-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative group">
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-bloom-pink/30 dark:text-bloom-pink/20 text-sm opacity-0 group-focus-within:opacity-100 transition-opacity">🔒</div>
              <input 
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full pl-4 pr-4 py-3 rounded-xl border border-bloom-green/10 dark:border-white/10 bg-white dark:bg-dark-card dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-pink/30 focus:border-bloom-pink/40 transition-all pt-6"
              />
              <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 dark:text-bloom-pink/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-bloom-pink dark:peer-focus:text-bloom-pink">
                Confirm Password
              </label>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-bloom-green text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-bloom-deep transition-all shadow-lg shadow-bloom-green/20 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
              {!loading && <ArrowRight size={20} />}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-bloom-green/60 dark:text-white/40">
            Already have an account? {' '}
            <Link to="/login" className="text-bloom-pink font-bold hover:underline">Log In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
