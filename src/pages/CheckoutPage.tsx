import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle2, ArrowLeft, Send, ShoppingBag } from 'lucide-react';
import FlowerImage from '../components/FlowerImage';
import { usePaystackPayment } from 'react-paystack';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key';

const CheckoutPage = () => {
  const { cart, subtotal, deliveryFee, city, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    deliveryAddress: '',
    deliveryDate: '',
    timeSlot: 'Morning (8AM - 12PM)',
    giftMessage: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalAmount = subtotal + deliveryFee;

  // Generate fresh reference each time
  const getConfig = useCallback(() => ({
    reference: `kb_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`,
    email: user?.email || 'customer@kevinsblooms.com',
    amount: totalAmount * 100,
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: 'NGN',
  }), [totalAmount, user?.email]);

  const [config, setConfig] = useState(getConfig);
  const initializePayment = usePaystackPayment(config);

  const onSuccess = useCallback(async (reference: any) => {
    setLoading(true);
    setError('');
    try {
      const verifyRes = await axios.get(
        `${API_URL}/payment/verify/${reference.reference}`,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (verifyRes.data.success) {
        const orderData = {
          items: cart.map(item => ({ flowerId: item._id, quantity: item.quantity })),
          recipientName: formData.recipientName,
          recipientPhone: formData.recipientPhone,
          deliveryAddress: formData.deliveryAddress,
          city: city,
          deliveryDate: formData.deliveryDate,
          timeSlot: formData.timeSlot,
          giftMessage: formData.giftMessage,
          paymentReference: reference.reference,
          paymentStatus: 'paid'
        };

        const { data } = await axios.post(`${API_URL}/orders`, orderData, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });

        if (data.success) {
          setOrderRef(data.data._id.slice(-6).toUpperCase());
          setSuccess(true);
          clearCart();
        }
      }
    } catch (err: any) {
      setError('Payment verified but order creation failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  }, [cart, city, formData, user, clearCart]);

  const onClose = useCallback(() => {
    setError('Payment was cancelled. Please try again.');
    // Reset config for next attempt
    setConfig(getConfig());
  }, [getConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!city) {
      setError('Please select a city on the cart page first.');
      return;
    }

    if (!user?.email) {
      setError('Please log in to complete your purchase.');
      return;
    }

    if (!formData.recipientName || !formData.recipientPhone || !formData.deliveryAddress || !formData.deliveryDate) {
      setError('Please fill in all required delivery details.');
      return;
    }

    if (totalAmount <= 0) {
      setError('Invalid order amount. Please add items to cart.');
      return;
    }

    // Generate fresh config before payment
    const freshConfig = getConfig();
    setConfig(freshConfig);

    // Small delay to ensure config is updated before payment opens
    setTimeout(() => {
      initializePayment({ onSuccess, onClose });
    }, 150);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bloom-cream dark:bg-dark-bg px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-8 md:p-12 rounded-[3rem] text-center max-w-lg w-full relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 flex justify-around">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, 400], opacity: [1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="w-2 h-2 rounded-full bg-bloom-pink"
              />
            ))}
          </div>

          <div className="w-24 h-24 bg-bloom-green text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-bloom-green/30 relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <CheckCircle2 size={48} />
            </motion.div>
          </div>

          <h2 className="text-4xl md:text-5xl font-cormorant text-bloom-green dark:text-white mb-4">
            Payment Successful! 🌸
          </h2>
          <p className="text-bloom-green/60 text-lg mb-2">
            Order Reference: <span className="font-bold text-bloom-green dark:text-white">#{orderRef}</span>
          </p>
          <p className="text-bloom-green/80 font-medium mb-8 italic">
            "Your flowers are on their way!"
          </p>

          <div className="bg-bloom-green/5 p-6 rounded-2xl mb-10 text-left border border-bloom-green/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase tracking-widest text-bloom-green/40 font-bold">
                Estimated Delivery
              </span>
              <span className="text-sm font-bold text-bloom-green">{formData.deliveryDate}</span>
            </div>
            <p className="text-sm text-bloom-green/60 italic">
              Our florists are hand-picking the freshest stems for your arrangement right now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white border-2 border-bloom-green/10 text-bloom-green py-4 rounded-xl font-bold hover:bg-bloom-green hover:text-white transition-all"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="bg-bloom-green text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-bloom-green/20"
            >
              Back to Shop
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 md:px-6 bg-bloom-cream dark:bg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
          <Link
            to="/cart"
            className="p-3 rounded-full bg-white dark:bg-dark-card shadow-sm text-bloom-green hover:bg-bloom-pink hover:text-white transition-all group flex-shrink-0"
          >
            <ArrowLeft size={20} className="group-active:-translate-x-1 transition-transform" />
          </Link>
          <h1 className="text-3xl md:text-6xl font-cormorant text-bloom-green dark:text-white font-bold">
            Secure <span className="italic">Checkout</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Delivery Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-bloom-green/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <ShoppingBag size={120} />
              </div>

              <h3 className="text-2xl md:text-3xl font-cormorant font-bold text-bloom-green dark:text-white mb-6 md:mb-8">
                Delivery Details
              </h3>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 md:mb-8 p-4 md:p-5 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="relative">
                    <input
                      type="text"
                      name="recipientName"
                      required
                      value={formData.recipientName}
                      onChange={handleChange}
                      placeholder=" "
                      className="peer w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-bloom-green/10 bg-white dark:bg-dark-card dark:text-white focus:outline-none focus:border-bloom-pink transition-all pt-6 md:pt-7 text-bloom-green font-medium"
                    />
                    <label className="absolute left-4 md:left-5 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] font-bold">
                      Recipient Name *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      name="recipientPhone"
                      required
                      value={formData.recipientPhone}
                      onChange={handleChange}
                      placeholder=" "
                      className="peer w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-bloom-green/10 bg-white dark:bg-dark-card dark:text-white focus:outline-none focus:border-bloom-pink transition-all pt-6 md:pt-7 text-bloom-green font-medium"
                    />
                    <label className="absolute left-4 md:left-5 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] font-bold">
                      Recipient Phone *
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="deliveryAddress"
                    required
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-bloom-green/10 bg-white dark:bg-dark-card dark:text-white focus:outline-none focus:border-bloom-pink transition-all pt-6 md:pt-7 text-bloom-green font-medium"
                  />
                  <label className="absolute left-4 md:left-5 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] font-bold">
                    Delivery Address *
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="relative">
                    <input
                      type="date"
                      name="deliveryDate"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      className="peer w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-bloom-green/10 bg-white dark:bg-dark-card dark:text-white focus:outline-none focus:border-bloom-pink transition-all pt-6 md:pt-7 text-bloom-green font-medium"
                    />
                    <label className="absolute left-4 md:left-5 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 font-bold">
                      Delivery Date *
                    </label>
                  </div>
                  <div className="relative">
                    <select
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleChange}
                      className="peer w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-bloom-green/10 bg-white dark:bg-dark-card dark:text-white focus:outline-none focus:border-bloom-pink transition-all pt-6 md:pt-7 text-bloom-green font-medium appearance-none"
                    >
                      <option>Morning (8AM - 12PM)</option>
                      <option>Afternoon (12PM - 4PM)</option>
                      <option>Evening (4PM - 8PM)</option>
                    </select>
                    <label className="absolute left-4 md:left-5 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 font-bold">
                      Time Slot
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    name="giftMessage"
                    value={formData.giftMessage}
                    onChange={handleChange}
                    placeholder=" "
                    rows={3}
                    className="peer w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-bloom-green/10 bg-white dark:bg-dark-card dark:text-white focus:outline-none focus:border-bloom-pink transition-all pt-6 md:pt-7 text-bloom-green font-medium"
                  />
                  <label className="absolute left-4 md:left-5 top-2 text-[10px] uppercase tracking-widest text-bloom-green/40 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] font-bold">
                    Gift Message (Optional)
                  </label>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={loading}
                    type="submit"
                    className="w-full bg-bloom-green text-white py-5 md:py-6 rounded-[1.5rem] font-bold flex flex-col items-center justify-center gap-1 hover:opacity-90 transition-all shadow-2xl shadow-bloom-green/30 disabled:opacity-70 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    {loading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        <div className="flex items-center gap-3 relative z-10">
                          <Send size={20} />
                          <span className="text-lg md:text-xl uppercase tracking-tighter">
                            Pay ₦{totalAmount.toLocaleString()} Securely
                          </span>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] opacity-60 relative z-10">
                          Secure Payment via Paystack
                        </span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] lg:sticky lg:top-32 border border-white/40 shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-cormorant font-bold text-bloom-green dark:text-white mb-6 md:mb-8">
                Summary
              </h3>

              <div className="max-h-[300px] overflow-y-auto pr-2 mb-6 md:mb-8 space-y-4 md:space-y-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3 md:gap-4">
                      <FlowerImage
                        flowerName={item.name}
                        photoIds={item.photoIds || []}
                        originalImage={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl shadow-md flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-bloom-green dark:text-white text-sm md:text-lg leading-tight">
                          {item.name}
                        </p>
                        <p className="text-xs text-bloom-green/40 font-bold uppercase tracking-widest">
                          {item.quantity} x ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-bloom-green dark:text-white text-sm md:text-base flex-shrink-0">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-bloom-green/10">
                <div className="flex justify-between text-bloom-green/60 font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-bloom-green dark:text-white">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-bloom-green/60 font-medium">
                  <div className="flex flex-col">
                    <span>Delivery Fee</span>
                    <span className="text-[10px] uppercase font-bold text-bloom-pink tracking-wider">
                      {city}
                    </span>
                  </div>
                  <span className="font-bold text-bloom-gold">
                    ₦{deliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="pt-6 border-t-2 border-dashed border-bloom-green/10 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-bloom-green/30">
                      Total
                    </span>
                    <span className="text-lg md:text-2xl font-bold text-bloom-green dark:text-white">
                      Amount to Pay
                    </span>
                  </div>
                  <span className="text-3xl md:text-5xl font-cormorant font-bold text-bloom-green dark:text-white leading-none">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-bloom-green/5 flex items-center justify-center gap-4 opacity-40">
                <div className="h-px bg-bloom-green/20 flex-1" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                  Encrypted Checkout
                </span>
                <div className="h-px bg-bloom-green/20 flex-1" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;