import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function MagneticWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.12;
    setPos({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 12, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [animate, setAnimate] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate) return;
    setCount(0);
    let start: number;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [animate, value]);

  return (
    <motion.div
      onViewportEnter={() => setAnimate(true)}
      viewport={{ once: true, margin: "-100px" }}
      className="text-center"
    >
      <p className="text-3xl font-cormorant text-bloom-green dark:text-bloom-gold">
        {count}{suffix}
      </p>
      <p className="text-xs uppercase tracking-widest text-bloom-green/60 dark:text-white/50">{label}</p>
    </motion.div>
  );
}

const Hero = () => {
  const petals = Array.from({ length: 15 });

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden aurora-bg hero">
      {/* Aurora Orbs - only visible in dark mode via CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="aurora-orb absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20" />
        <div className="aurora-orb absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-600/20" />
        <div className="aurora-orb absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-rose-600/20" />
      </div>
      {/* Animated Petals */}
      {petals.map((_, i) => (
        <motion.div
          key={i}
          className="petal text-2xl"
          initial={{ 
            top: -50, 
            left: `${Math.random() * 100}%`,
            opacity: 0,
            rotate: 0
          }}
          animate={{ 
            top: '110vh',
            opacity: [0, 1, 1, 0],
            rotate: 360,
            x: [0, Math.random() * 100 - 50, 0]
          }}
          transition={{ 
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        >
          🌸
        </motion.div>
      ))}

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-bloom-green/70 dark:text-bloom-pink font-cormorant italic text-lg sm:text-xl md:text-3xl mb-4 drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(242,196,206,0.4)]">
            Nature's Poetry in Every Petal
          </h2>
          <h1 className="text-3xl sm:text-4xl md:text-8xl font-cormorant text-bloom-green leading-tight mb-8">
            Fresh Flowers, <br />
            <span className="italic">Delivered With Love</span>
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
            <Link to="/shop">
              <MagneticWrap>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-bloom-green text-bloom-cream px-8 py-4 rounded-full flex items-center gap-2 font-medium hover:bg-bloom-deep transition-colors cursor-pointer"
                >
                  Explore Collection <ArrowRight size={20} />
                </motion.button>
              </MagneticWrap>
            </Link>
            <Link to="/register">
              <MagneticWrap>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/40 backdrop-blur-md border border-white/40 text-bloom-green px-8 py-4 rounded-full font-medium hover:bg-white/60 transition-colors cursor-pointer"
                >
                  Sign Up Free
                </motion.button>
              </MagneticWrap>
            </Link>
          </div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 pt-12 border-t border-bloom-green/10"
          >
            <AnimatedStat value={500} suffix="+" label="Customers" />
            <AnimatedStat value={50} suffix="+" label="Varieties" />
            <div className="text-center">
              <p className="text-3xl font-cormorant text-bloom-green dark:text-bloom-gold">Same-Day</p>
              <p className="text-xs uppercase tracking-widest text-bloom-green/60 dark:text-white/50">Delivery</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-bloom-cream to-transparent z-10 hero-bg" />
    </section>
  );
};

export default Hero;
