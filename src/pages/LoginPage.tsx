import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { ArrowRight, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  // Fix mobile viewport height bug
  // Fix mobile viewport height bug & flashing layout compression
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Delay execution by one animation frame to let Tailwind styles settle first
    const rafId = requestAnimationFrame(() => {
      setVH();
    });

    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData.identifier, formData.password);
      if (data.success) {
        showToast(`Welcome back, ${data.data.fullName.split(' ')[0]}! 🌸`);
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
    <div
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
      className="fixed inset-0 w-screen h-screen m-0 p-0 flex flex-col md:flex-row bg-bloom-cream dark:bg-dark-bg overflow-y-auto overflow-x-hidden z-50"
    >
      {/* Left Side - Visual (desktop only) */}
      <div className="hidden md:flex md:w-1/2 aurora-bg relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative z-10 text-center text-bloom-green">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-cormorant mb-6"
          >
            Welcome <br />
            <span className="italic">Back</span>
          </motion.h2>
          <p className="opacity-60 italic max-w-sm mx-auto">
            Your favorite blooms are waiting for you. Log in to manage your orders and wishlist.
          </p>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 text-5xl"
        >
          🌻
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 left-1/4 text-5xl"
        >
          🌷
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:p-12 lg:p-24 relative">
        <Link
          to="/"
          className="absolute top-6 left-6 md:top-12 md:left-12 flex items-center gap-2 text-bloom-green/40 hover:text-bloom-green transition-all group font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Home
        </Link>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <h1 className="text-4xl font-cormorant text-bloom-green dark:text-white mb-2">
            Login
          </h1>
          <p className="text-bloom-green/60 dark:text-white/50 mb-8">
            Enter your credentials to access your account.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-500 text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                name="identifier"
                required
                value={formData.identifier}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full px-4 py-3 rounded-xl border border-bloom-green/10 bg-white dark:bg-dark-card dark:text-white dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-bloom-green/20 transition-all pt-6"
              />
              <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 dark:text-white/30 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">
                Email or Username
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full px-4 py-3 rounded-xl border border-bloom-green/10 bg-white dark:bg-dark-card dark:text-white dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-bloom-green/20 transition-all pt-6"
              />
              <label className="absolute left-4 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 dark:text-white/30 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-bloom-green/40 hover:text-bloom-green transition-colors mt-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-bloom-green/20 text-bloom-pink focus:ring-bloom-pink"
                />
                <span className="text-sm text-bloom-green/60 dark:text-white/50 group-hover:text-bloom-green transition-colors">
                  Remember Me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-bloom-pink font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-bloom-green text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-bloom-green/20 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Log In"}
              {!loading && <ArrowRight size={20} />}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-bloom-green/60 dark:text-white/40">
            Don't have an account?{' '}
            <Link to="/register" className="text-bloom-pink font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;