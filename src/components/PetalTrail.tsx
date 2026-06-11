import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface Petal {
  id: number;
  x: number;
  y: number;
  angle: number;
  emoji: string;
}

const emojis = ['🌸', '🌷', '🌺', '🌻', '🌹'];

export default function PetalTrail() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    let lastSpawn = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawn < 60) return;
      lastSpawn = now;
      const id = idRef.current++;
      setPetals((prev) =>
        [...prev, { id, x: e.clientX, y: e.clientY, angle: Math.random() * 360, emoji: emojis[Math.floor(Math.random() * emojis.length)] }].slice(-40)
      );
      setTimeout(() => setPetals((prev) => prev.filter((p) => p.id !== id)), 1800);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {petals.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: p.x, y: p.y, opacity: 0.9, scale: 0.6, rotate: 0 }}
          animate={{
            x: p.x + (Math.random() - 0.5) * 100,
            y: p.y - 80 - Math.random() * 40,
            opacity: 0,
            scale: 0,
            rotate: 360,
          }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute text-base"
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}
