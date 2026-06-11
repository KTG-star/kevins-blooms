import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from '../sections/Hero';
import Bestsellers from '../sections/Bestsellers';
import MoodQuiz from '../sections/MoodQuiz';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Truck, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import TestimonialCarousel from '../components/TestimonialCarousel';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Tilt3D({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotate({ x: (y - 0.5) * -20, y: (x - 0.5) * 20 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const LandingPage = () => {
  const [featuredFlowers, setFeaturedFlowers] = useState([]);
  const bentoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: bentoRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  // Synchronously handle layout calculations before any elements paint to screen.
  // This blocks route transition layout compression permanently.
  useLayoutEffect(() => {
    const forceRecalculate = () => {
      window.dispatchEvent(new Event('resize'));
    };
    
    // Trigger right before painting
    forceRecalculate();
    
    // Fallback delay to capture slower browser CSS engines
    const timer = setTimeout(forceRecalculate, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/flowers?limit=4&sort=Most Popular`);
        if (data.success) {
          setFeaturedFlowers(data.data.flowers);
        }
      } catch (error) {
        console.error("Error fetching featured flowers", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="w-full bg-bloom-cream dark:bg-dark-bg overflow-x-hidden min-h-screen flex flex-col">
      <SEO 
        title="Kelvin's Blooms | Premium Flower Delivery in Nigeria"
        description="Experience the magic of Kelvin's Blooms. Hand-crafted bouquets, same-day delivery in Lagos, Abuja, and more. The freshest flowers for your most beautiful moments."
      />
      <Hero />
      <div className="section-divider" />

      {/* Featured Bento Grid */}
      <section ref={bentoRef} className="py-24 px-6 max-w-7xl mx-auto w-full">
        <motion.div style={{ y: parallaxY }} className="flex justify-between items-end mb-12 w-full">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-bloom-pink font-bold mb-4 italic">The Collections</p>
            <h2 className="text-4xl md:text-6xl font-cormorant text-bloom-green dark:text-white mb-4">Curated Collections</h2>
            <p className="text-bloom-green/60 dark:text-white/60 max-w-md italic">Hand-picked selections for life's most beautiful moments.</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-bloom-pink font-medium hover:text-bloom-green dark:hover:text-white transition-colors group">
            View All Collections <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 md:h-[600px] w-full">
          {/* Large Hero Cell - Bouquets */}
          <Tilt3D className="md:col-span-2 md:row-span-2 h-[400px] md:h-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group rounded-3xl overflow-hidden shadow-lg w-full h-full"
            >
              <img src="https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Grand Bouquets" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 p-6 md:p-8 glass-dark rounded-2xl max-w-xs">
                <span className="text-[10px] uppercase tracking-widest text-bloom-pink font-bold mb-2 block">Premium</span>
                <h3 className="text-2xl md:text-3xl font-cormorant text-white mb-2">Grand Bouquets</h3>
                <p className="text-white/80 text-xs md:text-sm mb-4">Make a statement with our most luxurious arrangements.</p>
                <Link to="/shop?category=Bouquets" className="text-white font-medium flex items-center gap-2 group/btn">
                  Shop Collection <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </Tilt3D>

          {/* Medium Cell - Roses */}
          <Tilt3D className="md:col-span-2 h-[250px] md:h-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative group rounded-3xl overflow-hidden shadow-lg w-full h-full"
            >
              <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Roses" />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-6 left-6 p-6 glass rounded-2xl">
                <h3 className="text-2xl font-cormorant text-bloom-green mb-1">Classic Roses</h3>
                <Link to="/shop?category=Roses" className="text-bloom-green/80 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-bloom-pink transition-colors">
                  Explore Variety <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </Tilt3D>

          {/* Small Cell - Tropical */}
          <Tilt3D className="h-[200px] md:h-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group rounded-3xl overflow-hidden shadow-lg w-full h-full"
            >
              <img src="https://images.unsplash.com/photo-1544833058-e70f9ca25c17?w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Tropical" />
              <div className="absolute inset-0 bg-black/10" />
              <Link to="/shop?category=Tropical" className="absolute inset-0 flex items-end p-4">
                <div className="w-full glass py-3 px-4 rounded-xl flex items-center justify-between group/btn">
                  <h4 className="font-cormorant text-lg text-bloom-green font-bold">Tropical</h4>
                  <ArrowRight size={16} className="text-bloom-pink opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.div>
          </Tilt3D>

          {/* Small Cell - Exotic */}
          <Tilt3D className="h-[200px] md:h-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative group rounded-3xl overflow-hidden shadow-lg w-full h-full"
            >
              <img src="https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Exotic" />
              <div className="absolute inset-0 bg-black/10" />
              <Link to="/shop?category=Exotic" className="absolute inset-0 flex items-end p-4">
                <div className="w-full glass py-3 px-4 rounded-xl flex items-center justify-between group/btn">
                  <h4 className="font-cormorant text-lg text-bloom-green font-bold">Exotic</h4>
                  <ArrowRight size={16} className="text-bloom-pink opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.div>
          </Tilt3D>
        </div>

        <Link to="/shop" className="md:hidden flex items-center justify-center gap-2 text-bloom-pink font-medium mt-8 hover:text-bloom-green transition-colors group">
          View All Collections <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white/50 dark:bg-white/5 border-y border-bloom-green/5 w-full">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <h2 className="text-4xl md:text-5xl font-cormorant text-bloom-green dark:text-white text-center mb-16">The Bloom Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
            {[
              { icon: <Heart className="text-bloom-pink" />, title: "Crafted with Love", desc: "Every stem is hand-selected and arranged by our master florists." },
              { icon: <Truck className="text-bloom-gold" />, title: "Fast Delivery", desc: "Same-day delivery available in major cities. Freshness guaranteed." },
              { icon: <ShieldCheck className="text-bloom-green" />, title: "Secure Checkout", desc: "Safe and encrypted payments for your peace of mind." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-dark-card shadow-sm flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-cormorant text-bloom-green dark:text-white mb-4">{item.title}</h3>
                <p className="text-bloom-green/60 dark:text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Bestsellers />
      <div className="section-divider" />
      
      <MoodQuiz />
      <div className="section-divider" />

      {/* Testimonials */}
      <section className="py-24 px-6 bg-bloom-green text-bloom-cream overflow-hidden w-full">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-4xl md:text-5xl font-cormorant text-center mb-16">What Our Bloom Lovers Say</h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 bg-bloom-pink/20 w-full">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h2 className="text-4xl md:text-5xl font-cormorant text-bloom-green dark:text-white mb-6">Join the Bloom Club</h2>
          <p className="text-bloom-green/60 dark:text-white/60 mb-10 max-w-lg mx-auto">Get exclusive offers, floral tips, and be the first to know about our seasonal collections.</p>
          <form className="flex flex-col md:flex-row gap-4 w-full">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-8 py-4 rounded-full border border-bloom-green/10 dark:border-white/10 bg-white dark:bg-dark-card dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-green/20"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-bloom-green text-bloom-cream px-10 py-4 rounded-full font-medium"
            >
              Subscribe
            </motion.button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
