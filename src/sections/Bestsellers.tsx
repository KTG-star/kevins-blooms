import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { Flower } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import localFlowers from '../data/flowers.json';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Bestsellers = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/flowers?limit=8&sort=Most Popular`);
        if (data.success) {
          setFlowers(data.data.flowers);
        }
      } catch (error) {
        console.error("Error fetching bestsellers, using local data", error);
        setFlowers(localFlowers.slice(0, 8).map((f: any) => ({ ...f, _id: f.id })) as Flower[]);
      }
    };
    fetchBestsellers();
  }, []);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  return (
    <section
      id="bestsellers"
      className="py-16 md:py-24 bg-bloom-cream dark:bg-dark-bg overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 md:px-12 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-bloom-green dark:text-green-400 font-dmsans mb-3">
            ✦ Our Collection
          </p>
          <h2 className="text-4xl md:text-7xl font-cormorant text-bloom-green dark:text-white">
            Curated <span className="italic text-bloom-pink">Bestsellers</span>
          </h2>
          <p className="text-bloom-green/60 dark:text-white/50 font-dmsans mt-3 max-w-xl text-base md:text-lg">
            Our most-loved arrangements, handpicked to bring elegance to your space.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Arrow buttons — desktop only */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                canScrollLeft
                  ? 'border-bloom-green text-bloom-green hover:bg-bloom-green hover:text-white'
                  : 'border-bloom-green/20 text-bloom-green/20 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                canScrollRight
                  ? 'border-bloom-green text-bloom-green hover:bg-bloom-green hover:text-white'
                  : 'border-bloom-green/20 text-bloom-green/20 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <Link
            to="/shop"
            className="text-bloom-pink dark:text-bloom-pink font-bold text-base hover:text-bloom-green transition-colors"
          >
            View All →
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-bloom-cream dark:from-dark-bg to-transparent z-10 pointer-events-none" />
        
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-bloom-cream dark:from-dark-bg to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 pl-4 md:pl-12 pr-4 md:pr-12 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {flowers.map((flower) => (
            <div
              key={flower._id}
              className="flex-shrink-0 w-[260px] sm:w-[300px] md:w-[380px] snap-start"
            >
              <ProductCard flower={flower} />
            </div>
          ))}

          {/* CTA Card at the end */}
          <div className="flex-shrink-0 w-[220px] md:w-[320px] snap-start flex flex-col items-center justify-center text-center px-6 md:px-10">
            <p className="text-bloom-green/40 font-dmsans uppercase tracking-[0.3em] text-xs mb-4">
              Discovery
            </p>
            <h3 className="text-2xl md:text-3xl font-cormorant text-bloom-green dark:text-white mb-6">
              Looking for something unique?
            </h3>
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-bloom-green text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-sm md:text-base"
              >
                Browse All
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="flex justify-center mt-4 md:hidden">
        <p className="text-xs text-bloom-green/40 font-dmsans">
          ← Swipe to explore →
        </p>
      </div>
    </section>
  );
};

export default Bestsellers;