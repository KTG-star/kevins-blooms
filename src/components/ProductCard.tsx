import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowUpRight, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Flower } from '../types';

import FlowerImage from './FlowerImage';
import ImageLightbox from './ImageLightbox';

interface ProductCardProps {
  flower: Flower;
}

const ProductCard: React.FC<ProductCardProps> = ({ flower }) => {
  const { addToCart } = useCart();
  const { user, wishlist, toggleWishlist } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [showPetals, setShowPetals] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsTouch('ontouchstart' in window);
  }, []);

  const isLiked = wishlist?.includes(flower._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(flower, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setShowPetals(true);
    setTimeout(() => setShowPetals(false), 1000);
    await toggleWishlist(flower._id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group rounded-3xl overflow-hidden aspect-[4/5] bg-bloom-cream shadow-sm flower-card"
    >
        {/* Main Clickable Area */}
        <Link to={`/shop/${flower._id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View {flower.name}</span>
        </Link>

        <button
          onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
          className="absolute inset-0 w-full h-full z-20 cursor-zoom-in"
          aria-label={`View ${flower.name}`}
        >
          <FlowerImage 
            flowerName={flower.name}
            photoIds={flower.photoIds || []}
            originalImage={flower.image}
            alt={flower.name}
            className="w-full h-full transition-transform duration-700 group-hover:scale-110 pointer-events-none"
          />
        </button>

        {lightboxOpen && (
          <ImageLightbox
            src={flower.image || `https://images.unsplash.com/photo-${flower.photoIds?.[0] || '1508193638397-1c4234db14d8'}?w=1200`}
            alt={flower.name}
            onClose={() => setLightboxOpen(false)}
          />
        )}
        
        {/* Liked Petal Burst */}
        <AnimatePresence>
          {showPetals && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{ 
                    opacity: 0, 
                    scale: 1.5,
                    x: Math.cos(i * 60 * (Math.PI / 180)) * 50,
                    y: Math.sin(i * 60 * (Math.PI / 180)) * 50
                  }}
                  className="absolute text-xl"
                >
                  🌸
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Top Actions - High Z-Index to stay clickable over the Link */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={`p-3 rounded-full backdrop-blur-md transition-colors ${
              isLiked ? 'bg-bloom-pink text-white' : 'bg-white/40 text-bloom-green hover:bg-white/60'
            }`}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.8, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            </motion.div>
          </motion.button>
        </div>

        {/* Stock Badge */}
        {flower.stockQuantity <= 5 && flower.stockQuantity > 0 && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 rounded-full bg-orange-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest">
              Low Stock
            </span>
          </div>
        )}
        {flower.stockQuantity === 0 && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 rounded-full bg-red-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest">
              Out of Stock
            </span>
          </div>
        )}

        {/* Glass Panel */}
        <motion.div 
          animate={{ height: isHovered || isTouch ? '60%' : '35%' }}
          className="absolute bottom-0 left-0 w-full glass p-6 flex flex-col justify-end transition-all duration-500 z-20"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-bloom-green/60 block">
                  {flower.category}
                </span>
                {flower.averageRating !== undefined && flower.averageRating > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-bloom-gold font-bold">
                    <Star size={10} fill="currentColor" />
                    {flower.averageRating.toFixed(1)}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-cormorant font-bold leading-tight">
                {flower.name}
              </h3>
            </div>
            <p className="text-lg font-cormorant font-bold text-bloom-green flower-price">
              ₦{flower.price.toLocaleString()}
            </p>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered || isTouch ? 1 : 0 }}
            className="text-xs text-bloom-green/70 line-clamp-2 mb-4 font-dmsans"
          >
            {flower.description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered || isTouch ? 1 : 0, y: isHovered || isTouch ? 0 : 10 }}
            className="flex items-center justify-between"
          >
            <button
              disabled={flower.stockQuantity === 0}
              onClick={handleAddToCart}
              className={`flex-1 mr-3 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                added 
                  ? 'bg-bloom-green text-white' 
                  : flower.stockQuantity === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-bloom-green text-bloom-cream hover:bg-bloom-deep'
              }`}
            >
              {added ? (
                <>Added! 🌸</>
              ) : flower.stockQuantity === 0 ? (
                <>Out of Stock</>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Add to Cart
                </>
              )}
            </button>
            <div className="w-12 h-12 rounded-xl border border-bloom-green/20 flex items-center justify-center text-bloom-green hover:bg-bloom-green hover:text-white transition-colors">
              <ArrowUpRight size={20} />
            </div>
          </motion.div>
        </motion.div>
    </motion.div>
  );
};

export default ProductCard;
