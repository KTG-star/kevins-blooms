import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import PetalTrail from './components/PetalTrail';
import PageTransition from './components/PageTransition';
import LandingPage from './pages/LandingPage';
import { Instagram, Phone, Mail, MessageCircle } from 'lucide-react';
import ChatBot from './components/ChatBot';

const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[100] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-bloom-pink via-bloom-gold to-bloom-green transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-bloom-cream">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-bloom-pink border-t-transparent rounded-full animate-spin" />
      <p className="font-cormorant text-bloom-green italic text-xl">
        Cultivating your experience...
      </p>
    </div>
  </div>
);

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingFallback />;
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function AppLayout() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] font-dmsans text-[var(--text-primary)] transition-colors duration-400">
      <CustomCursor />
      <PetalTrail />
      <BackToTop />
      <Navbar />

      <main>
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
              <Route path="/shop" element={<PageTransition><ShopPage /></PageTransition>} />
              <Route path="/shop/:id" element={<PageTransition><ProductPage /></PageTransition>} />
              <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
              <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
              <Route path="/verify-email" element={<PageTransition><VerifyEmailPage /></PageTransition>} />
              <Route
                path="/tracking/:id"
                element={
                  <ProtectedRoute>
                    <PageTransition><OrderTrackingPage /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <PageTransition><CheckoutPage /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PageTransition><UserDashboard /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <PageTransition><AdminDashboard /></PageTransition>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <footer className="bg-bloom-green text-bloom-cream py-24 px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-left">
          <div className="md:col-span-1">
            <h3 className="font-cormorant text-3xl mb-8">
              Kelvin's{' '}
              <span className="text-bloom-pink">Blooms</span>
            </h3>
            <p className="text-bloom-cream/60 leading-relaxed max-w-sm text-sm">
              We believe every flower tells a story. Since 2026, we have
              been creating premium floral experiences that elevate the
              everyday.
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-bloom-pink">
              Experience
            </h4>
            <ul className="space-y-4 text-sm text-bloom-cream/80">
              <li>
                <Link to="/shop" className="hover:text-bloom-pink transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-bloom-pink transition-colors">
                  Care Guide
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-bloom-pink">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-bloom-cream/80">
              <li>
                <a href="mailto:umunnakweemeka95@gmail.com" className="hover:text-bloom-pink transition-colors flex items-center gap-2">
                  <Mail size={16} /> umunnakweemeka95@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:07033699729" className="hover:text-bloom-pink transition-colors flex items-center gap-2">
                  <Phone size={16} /> 07033699729
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/theeprettyboy_kelvin" target="_blank" rel="noopener noreferrer" className="hover:text-bloom-pink transition-colors flex items-center gap-2">
                  <Instagram size={16} /> @theeprettyboy_kelvin
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-bloom-pink">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-bloom-cream/80">
              <li>
                <a href="#" className="hover:text-bloom-pink transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="https://wa.me/2347033699729" target="_blank" rel="noopener noreferrer" className="hover:text-bloom-pink transition-colors flex items-center gap-2 font-bold">
                  <MessageCircle size={16} /> WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-bloom-cream/40">
            2026 Kelvin's Blooms. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/theeprettyboy_kelvin" target="_blank" rel="noopener noreferrer" className="text-bloom-cream/40 hover:text-bloom-pink transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://wa.me/2347033699729" target="_blank" rel="noopener noreferrer" className="text-bloom-cream/40 hover:text-bloom-pink transition-colors">
              <MessageCircle size={20} />
            </a>
            <a href="mailto:umunnakweemeka95@gmail.com" className="text-bloom-cream/40 hover:text-bloom-pink transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <ChatBot />

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/2347033699729?text=Hi%20Kelvin's%20Blooms!%20I'd%20like%20to%20place%20an%20order." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[50] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-bloom-green px-4 py-2 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with Kelvin 🌸
        </span>
      </a>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppProvider>
            <Router>
              <ScrollToTop />
              <ScrollProgress />
              <AppLayout />
            </Router>
          </AppProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
