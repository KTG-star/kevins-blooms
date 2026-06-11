import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  { name: 'Sarah J.', city: 'Lagos', quote: "The most beautiful bouquet I've ever received! The roses lasted for over a week." },
  { name: 'David O.', city: 'Abuja', quote: "Fast delivery and excellent customer service. Kelvin's Blooms is my go-to now." },
  { name: 'Amaka E.', city: 'Enugu', quote: "The bento grid selection made it so easy to pick the perfect flowers for my mom." },
  { name: 'Chioma A.', city: 'Port Harcourt', quote: "I ordered for my anniversary and the arrangement was breathtaking. Thank you!" },
  { name: 'Tunde B.', city: 'Ibadan', quote: "Same-day delivery in Ibadan! I was amazed by the freshness and the beautiful packaging." },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const slideVariant = {
    enter: (dir: number) => ({ x: dir * 120, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -120, opacity: 0 }),
  };

  const item = testimonials[current];

  return (
    <div className="relative max-w-2xl mx-auto">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariant}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="p-8 rounded-3xl bg-white/5 border border-white/10"
        >
          <div className="flex gap-1 mb-6 justify-center">
            {[...Array(5)].map((_, idx) => (
              <Star key={idx} size={18} fill="#f2c4ce" color="#f2c4ce" />
            ))}
          </div>
          <p className="italic mb-8 text-xl md:text-2xl font-cormorant leading-relaxed text-center">
            &ldquo;{item.quote}&rdquo;
          </p>
          <div className="text-center">
            <p className="font-bold text-bloom-pink text-lg">{item.name}</p>
            <p className="text-xs uppercase tracking-widest opacity-40">{item.city}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => goTo((current - 1 + testimonials.length) % testimonials.length)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === current
                  ? 'bg-bloom-pink w-6'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => goTo((current + 1) % testimonials.length)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
