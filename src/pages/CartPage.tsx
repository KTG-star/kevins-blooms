import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import FlowerImage from '../components/FlowerImage';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, deliveryFee, city, setCity } = useCart();

  const cities = ['Lagos', 'Abuja', 'Port Harcourt', 'Owerri', 'Enugu', 'Other'];

  return (
    <div className="pt-32 pb-24 px-6 bg-bloom-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-6">
            <Link to="/shop" className="p-3 rounded-full bg-white shadow-sm text-bloom-green hover:bg-bloom-green hover:text-white transition-all">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl md:text-6xl font-cormorant text-bloom-green">Your Shopping <span className="italic">Bag</span></h1>
          </div>
          <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-bloom-pink hover:text-bloom-green transition-all flex items-center gap-2 group">
             Continue Shopping <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 glass rounded-3xl"
          >
            <ShoppingBag size={64} className="mx-auto text-bloom-green/20 mb-6" />
            <p className="text-2xl font-cormorant text-bloom-green mb-8">Your bag is currently empty.</p>
            <Link to="/shop">
              <button className="bg-bloom-green text-white px-10 py-4 rounded-full font-bold hover:bg-bloom-deep transition-all">
                Start Shopping
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div 
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass p-6 rounded-3xl flex items-center gap-6"
                  >
                    <FlowerImage 
                      flowerName={item.name}
                      photoIds={item.photoIds || []}
                      originalImage={item.image}
                      alt={item.name}
                      width={128}
                      height={128}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-2xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-cormorant font-bold text-bloom-green mb-1">{item.name}</h3>
                      <p className="text-bloom-pink font-bold mb-4">₦{item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-bloom-green/10 rounded-xl overflow-hidden bg-white/50">
                          <button 
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-bloom-green hover:text-white transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, Math.min(item.stockQuantity, item.quantity + 1))}
                            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-bloom-green hover:text-white transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xl font-cormorant font-bold text-bloom-green">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="glass p-8 rounded-3xl sticky top-32">
                <h3 className="text-2xl font-cormorant font-bold text-bloom-green mb-8">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-bloom-green/60">
                    <span>Subtotal</span>
                    <span className="font-bold">₦{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-bloom-green/40">Select City for Delivery Fee</label>
                    <select 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white/50 border border-bloom-green/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-green/20"
                    >
                      <option value="">Select City</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="flex justify-between text-bloom-green/60">
                    <span>Delivery Fee</span>
                    <span className="font-bold">{deliveryFee > 0 ? `₦${deliveryFee.toLocaleString()}` : '—'}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-bloom-green/10 mb-8 flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-cormorant font-bold text-bloom-green">
                    ₦{(subtotal + deliveryFee).toLocaleString()}
                  </span>
                </div>

                <Link to="/checkout">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={cart.length === 0 || !city}
                    className="w-full bg-bloom-green text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-bloom-deep transition-all shadow-lg shadow-bloom-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Checkout <ArrowRight size={20} />
                  </motion.button>
                </Link>
                
                {!city && cart.length > 0 && (
                  <p className="text-[10px] text-center mt-4 text-bloom-pink uppercase tracking-widest font-bold">
                    Please select a city to proceed
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
