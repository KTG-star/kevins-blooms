import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Heart, ArrowLeft, Truck, RefreshCw, ShieldCheck, Star, ChevronRight, Plus, Minus, Loader2, MessageSquare, User } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FlowerImage from '../components/FlowerImage';
import { Flower } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { user, wishlist, toggleWishlist } = useAuth();
  const [flower, setFlower] = useState<any>(null);
  const [related, setRelated] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' });

  const fetchFlower = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/flowers/${id}`);
      if (data.success) {
        setFlower(data.data);
        const relatedRes = await axios.get(`${API_URL}/flowers?category=${data.data.category}&limit=4`);
        setRelated(relatedRes.data.data.flowers.filter((f: Flower) => f._id !== id));
      }
    } catch (error) {
      console.error("Fetch flower failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlower();
    window.scrollTo(0, 0);
  }, [id]);

  const isLiked = id ? wishlist?.includes(id) : false;

  const handleAddToCart = () => {
    if (flower) {
      addToCart(flower, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmittingReview(true);
    setReviewMessage({ type: '', text: '' });
    
    try {
      const { data } = await axios.post(`${API_URL}/flowers/${id}/reviews`, 
        { rating, comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      if (data.success) {
        setReviewMessage({ type: 'success', text: 'Thank you! Your review has been added.' });
        setComment('');
        setRating(5);
        fetchFlower(); // Refresh to show new review
      }
    } catch (error: any) {
      setReviewMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to add review. Make sure you have purchased this item.' 
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="pt-32 flex justify-center h-screen bg-bloom-cream dark:bg-dark-bg">
      <Loader2 className="animate-spin text-bloom-green" size={48} />
    </div>
  );

  if (!flower) return (
    <div className="pt-32 text-center h-screen bg-bloom-cream dark:bg-dark-bg">
      <h2 className="text-3xl font-cormorant text-bloom-green dark:text-white">Flower not found</h2>
      <Link to="/shop" className="text-bloom-pink font-bold mt-4 inline-block">Back to Shop</Link>
    </div>
  );

  return (
    <div className="pt-32 pb-24 px-6 bg-bloom-cream dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-bloom-green/60 dark:text-white/40 mb-12">
          <Link to="/" className="hover:text-bloom-pink transition-colors">Home</Link>
          <ChevronRight size={10} className="opacity-40" />
          <Link to="/shop" className="hover:text-bloom-pink transition-colors">Collection</Link>
          <ChevronRight size={10} className="opacity-40" />
          <span className="text-bloom-green/40 dark:text-white/20">{flower.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <FlowerImage 
              flowerName={flower.name}
              photoIds={flower.photoIds || []}
              originalImage={flower.image}
              alt={flower.name}
              className="absolute inset-0 w-full h-full"
            />
            <button
              onClick={() => toggleWishlist(flower._id)}
              className={`absolute top-8 right-8 p-4 rounded-full backdrop-blur-md transition-all shadow-lg ${
                isLiked ? 'bg-bloom-pink text-white' : 'bg-white/40 text-bloom-green hover:bg-white/60'
              }`}
            >
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-bloom-pink mb-4">{flower.category}</span>
            <h1 className="text-5xl md:text-7xl font-cormorant text-bloom-green dark:text-white mb-6 leading-tight">{flower.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-bloom-gold">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    fill={i < Math.round(flower.averageRating || 0) ? "currentColor" : "none"} 
                    className={i < Math.round(flower.averageRating || 0) ? "" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-bloom-green/40 dark:text-white/40">({flower.numReviews || 0} Reviews)</span>
            </div>

            <p className="text-3xl font-cormorant font-bold text-bloom-green dark:text-white mb-8">₦{flower.price.toLocaleString()}</p>
            
            <p className="text-bloom-green/60 dark:text-white/60 leading-relaxed text-lg mb-10 italic">
              "{flower.description}"
            </p>

            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <div className="flex items-center border border-bloom-green/10 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-dark-card h-16">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-6 h-full hover:bg-bloom-green hover:text-white dark:text-white transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center font-bold text-xl dark:text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(flower.stockQuantity, quantity + 1))}
                  className="px-6 h-full hover:bg-bloom-green hover:text-white dark:text-white transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={flower.stockQuantity === 0}
                className={`flex-1 h-16 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl transition-all ${
                  added 
                    ? 'bg-bloom-green text-white shadow-bloom-green/20' 
                    : flower.stockQuantity === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-bloom-green text-white hover:bg-bloom-deep shadow-bloom-green/20'
                }`}
              >
                {added ? (
                  <>Added to Bag! 🌸</>
                ) : flower.stockQuantity === 0 ? (
                  'Out of Stock'
                ) : (
                  <><ShoppingBag size={20} /> Add to Bag</>
                )}
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-bloom-green/5 dark:border-white/5">
              <div className="flex flex-col items-center text-center gap-3">
                <Truck className="text-bloom-pink" size={24} />
                <span className="text-[10px] uppercase tracking-widest font-bold dark:text-white/60">Same Day Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <RefreshCw className="text-bloom-gold" size={24} />
                <span className="text-[10px] uppercase tracking-widest font-bold dark:text-white/60">Freshness Guarantee</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <ShieldCheck className="text-bloom-green" size={24} />
                <span className="text-[10px] uppercase tracking-widest font-bold dark:text-white/60">Secure Checkout</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-cormorant text-bloom-green dark:text-white mb-12 flex items-center gap-4">
              Customer <span className="italic">Reviews</span>
              <span className="text-sm bg-bloom-pink/10 text-bloom-pink px-3 py-1 rounded-full">{flower.numReviews || 0}</span>
            </h2>

            <div className="space-y-8">
              {flower.reviews?.length > 0 ? (
                flower.reviews.map((review: any) => (
                  <div key={review._id} className="glass p-8 rounded-[2rem] border border-bloom-green/5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-bloom-pink/20 flex items-center justify-center text-bloom-pink">
                          <User size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-bloom-green dark:text-white">{review.fullName}</h4>
                          <div className="flex text-bloom-gold">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-bloom-green/40 uppercase font-bold tracking-widest">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-bloom-green/60 dark:text-white/60 italic leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="glass p-12 rounded-[2rem] text-center">
                  <MessageSquare size={48} className="mx-auto text-bloom-green/10 mb-4" />
                  <p className="text-bloom-green/40 italic">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="glass p-10 rounded-[2.5rem] sticky top-32">
              <h3 className="text-2xl font-cormorant font-bold text-bloom-green dark:text-white mb-6">Write a Review</h3>
              
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  {reviewMessage.text && (
                    <div className={`p-4 rounded-xl text-xs border ${
                      reviewMessage.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {reviewMessage.text}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-bloom-green/40 ml-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-2 transition-all ${rating >= star ? 'text-bloom-gold scale-110' : 'text-gray-300'}`}
                        >
                          <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-bloom-green/40 ml-2">Your Experience</label>
                    <textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="How were the flowers?"
                      rows={4}
                      className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-dark-card border border-bloom-green/10 dark:border-white/10 dark:text-white focus:outline-none focus:border-bloom-pink transition-all"
                    />
                  </div>

                  <button
                    disabled={submittingReview}
                    className="w-full bg-bloom-green text-white py-4 rounded-xl font-bold shadow-lg shadow-bloom-green/20 hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submittingReview ? <Loader2 className="animate-spin" size={20} /> : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-bloom-green/60 mb-6 italic">Please log in to leave a review.</p>
                  <Link to="/login">
                    <button className="bg-bloom-green text-white px-8 py-3 rounded-xl font-bold">Log In</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-32">
            <h2 className="text-4xl font-cormorant text-bloom-green dark:text-white mb-12">You Might Also <span className="italic">Love</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map(f => (
                <ProductCard key={f._id} flower={f} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
