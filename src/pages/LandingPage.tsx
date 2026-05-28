import React, { useEffect, useState, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../sections/Hero';
import Bestsellers from '../sections/Bestsellers';
import MoodQuiz from '../sections/MoodQuiz';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Truck, ShieldCheck, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LandingPage = () => {
  const [featuredFlowers, setFeaturedFlowers] = useState([]);

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
    <div className="w-full bg-bloom-cream overflow-x-hidden min-h-screen flex flex-col">
      <Hero />
      <div className="section-divider" />

      {/* Featured Bento Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12 w-full">
          <div>
            <h2 className="text-4xl md:text-6xl font-cormorant text-bloom-green mb-4">Curated Collections</h2>
            <p className="text-bloom-green/60 max-w-md italic">Hand-picked selections for life's most beautiful moments.</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-bloom-pink font-medium hover:text-bloom-green transition-colors">
            View All Shop <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[800px] md:h-[600px] w-full">
          {/* Large Hero Cell */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 relative group rounded-3xl overflow-hidden shadow-lg"
          >
            <img src="https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Grand Bouquet" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-8 left-8 p-8 glass-dark rounded-2xl max-w-xs">
              <h3 className="text-3xl font-cormorant text-white mb-2">Grand Bouquets</h3>
              <p className="text-white/80 text-sm mb-4">Make a statement with our most luxurious arrangements.</p>
              <Link to="/shop?category=Bouquets" className="text-white font-medium flex items-center gap-2 group/btn">
                Shop Collection <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Medium Cell */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 relative group rounded-3xl overflow-hidden shadow-lg"
          >
            <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Roses" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-6 left-6 p-6 glass rounded-2xl">
              <h3 className="text-2xl font-cormorant text-bloom-green">Classic Roses</h3>
              <Link to="/shop?category=Roses" className="text-bloom-green/80 text-sm flex items-center gap-2">Explore <ArrowRight size={14} /></Link>
            </div>
          </motion.div>

          {/* Small Cells */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative group rounded-3xl overflow-hidden shadow-lg"
          >
            <img src="https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Sunflowers" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-4 left-4 p-4 glass rounded-xl">
              <h4 className="font-cormorant text-lg text-bloom-green">Seasonal Picks</h4>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative group rounded-3xl overflow-hidden shadow-lg"
          >
            <img src="https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Orchids" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-4 left-4 p-4 glass rounded-xl">
              <h4 className="font-cormorant text-lg text-bloom-green">Exotic Orchids</h4>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white/50 border-y border-bloom-green/5 w-full">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <h2 className="text-4xl md:text-5xl font-cormorant text-bloom-green text-center mb-16">The Bloom Experience</h2>
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
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-cormorant text-bloom-green mb-4">{item.title}</h3>
                <p className="text-bloom-green/60 text-sm leading-relaxed">{item.desc}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { name: "Sarah J.", city: "Lagos", quote: "The most beautiful bouquet I've ever received! The roses lasted for over a week." },
              { name: "David O.", city: "Abuja", quote: "Fast delivery and excellent customer service. Kevin's Blooms is my go-to now." },
              { name: "Amaka E.", city: "Enugu", quote: "The bento grid selection made it so easy to pick the perfect flowers for my mom." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="#f2c4ce" color="#f2c4ce" />)}
                </div>
                <p className="italic mb-8 text-lg font-cormorant leading-relaxed">"{item.quote}"</p>
                <div>
                  <p className="font-bold text-bloom-pink">{item.name}</p>
                  <p className="text-xs uppercase tracking-widest opacity-40">{item.city}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 bg-bloom-pink/20 w-full">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h2 className="text-4xl md:text-5xl font-cormorant text-bloom-green mb-6">Join the Bloom Club</h2>
          <p className="text-bloom-green/60 mb-10 max-w-lg mx-auto">Get exclusive offers, floral tips, and be the first to know about our seasonal collections.</p>
          <form className="flex flex-col md:flex-row gap-4 w-full">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-8 py-4 rounded-full border border-bloom-green/10 focus:outline-none focus:ring-2 focus:ring-bloom-green/20"
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