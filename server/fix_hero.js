const fs = require('fs');
const content = `import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const petals = Array.from({ length: isMobile ? 8 : 15 });

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden aurora-bg hero py-12 md:py-0">
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
            left: \`\${Math.random() * 100}%\`,
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

      <div className="relative z-20 text-center px-4 md:px-6 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-bloom-green/70 dark:text-bloom-pink font-cormorant italic text-xl md:text-3xl mb-4 drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(242,196,206,0.4)]">  
            Nature's Poetry in Every Petal
          </h2>
          <h1 className="text-[clamp(2.5rem,10vw,5rem)] md:text-8xl font-cormorant text-bloom-green leading-tight mb-8">
            Fresh Flowers, <br />
            <span className="italic">Delivered With Love</span>
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-12 w-full max-w-md mx-auto md:max-w-none">
            <Link to="/shop" className="w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-bloom-green text-bloom-cream px-8 py-4 rounded-full flex items-center justify-center gap-2 font-medium hover:bg-bloom-deep transition-colors"
              >
                Explore Collection <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link to="/register" className="w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white/40 backdrop-blur-md border border-white/40 text-bloom-green px-8 py-4 rounded-full font-medium hover:bg-white/60 transition-colors"
              >
                Sign Up Free
              </motion.button>
            </Link>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="grid grid-cols-3 md:flex justify-center gap-4 md:gap-16 pt-12 border-t border-bloom-green/10"
          >
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-cormorant text-bloom-green">500+</p>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-bloom-green/60">Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-cormorant text-bloom-green">50+</p>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-bloom-green/60">Varieties</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-cormorant text-bloom-green">24h</p>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-bloom-green/60">Delivery</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-bloom-cream to-transparent z-10 hero-bg" />
    </section>
  );
};

export default Hero;`;
fs.writeFileSync('../src/sections/Hero.tsx', content, 'utf8');
