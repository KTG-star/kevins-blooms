import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CreditCard, CheckCircle, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import FlowerImage from '../components/FlowerImage';

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

const SHIPPING_RATES: Record<string, number> = {
  'Lagos': 15,
  'Abuja': 25,
  'Port Harcourt': 30,
  'Other': 40
};

const Checkout = () => {
  const { cart, clearCart } = useAppContext();
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: { city: 'Lagos' }
  });

  const selectedCity = watch('city');
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? SHIPPING_RATES[selectedCity] || 0 : 0;
  const total = subtotal + shipping;

  const onSubmit = (data: CheckoutFormData) => {
    console.log('Order Submitted:', { ...data, cart, total });
    setIsSuccess(true);
    clearCart();
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <section id="checkout" className="py-24 bg-bloom-cream min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-bloom-pink/10 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="text-bloom-pink w-10 h-10" />
          </div>
          <h2 className="text-4xl font-cormorant text-bloom-green">Your Cart is Empty</h2>
          <p className="text-bloom-green/60 max-w-xs mx-auto">Looks like you haven't picked any blooms yet.</p>
          <a href="#home" className="inline-block bg-bloom-green text-white px-10 py-4 rounded-full font-bold">Start Shopping</a>
        </div>
      </section>
    );
  }

  return (
    <section id="checkout" className="py-24 bg-bloom-cream min-h-screen">
      <div className="container px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-cormorant text-bloom-green mb-6">
            Complete Your <span className="italic text-bloom-pink">Order</span>
          </h2>
          <p className="text-bloom-green/60 font-dmsans">Almost there! Just a few details to get your blooms on the way.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 glass p-8 md:p-12 rounded-[3rem] border-bloom-pink/20">
            <div className="space-y-6">
              <h3 className="text-2xl font-cormorant text-bloom-green flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-bloom-gold" /> Delivery Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <input 
                    {...register("fullName", { required: "Full name is required" })}
                    placeholder="Full Name"
                    className={`w-full p-4 rounded-2xl bg-white border-2 focus:outline-none transition-all ${errors.fullName ? 'border-red-400' : 'border-bloom-pink/10 focus:border-bloom-pink'}`}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1 pl-2">{errors.fullName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input 
                      {...register("email", { 
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                      })}
                      placeholder="Email Address"
                      className={`w-full p-4 rounded-2xl bg-white border-2 focus:outline-none transition-all ${errors.email ? 'border-red-400' : 'border-bloom-pink/10 focus:border-bloom-pink'}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1 pl-2">{errors.email.message}</p>}
                  </div>
                  <div>
                    <input 
                      {...register("phone", { required: "Phone number is required" })}
                      placeholder="Phone Number"
                      className={`w-full p-4 rounded-2xl bg-white border-2 focus:outline-none transition-all ${errors.phone ? 'border-red-400' : 'border-bloom-pink/10 focus:border-bloom-pink'}`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1 pl-2">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <textarea 
                    {...register("address", { required: "Delivery address is required" })}
                    placeholder="Full Delivery Address"
                    className={`w-full p-4 h-32 rounded-2xl bg-white border-2 focus:outline-none transition-all resize-none ${errors.address ? 'border-red-400' : 'border-bloom-pink/10 focus:border-bloom-pink'}`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1 pl-2">{errors.address.message}</p>}
                </div>

                <div>
                  <select 
                    {...register("city")}
                    className="w-full p-4 rounded-2xl bg-white border-2 border-bloom-pink/10 focus:border-bloom-pink focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="Other">Other Cities</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-bloom-green text-white py-5 rounded-full font-bold text-lg hover:bg-bloom-gold transition-all shadow-xl"
            >
              Place Order Now — ${total}
            </button>
          </form>

          {/* Order Summary */}
          <div className="space-y-8">
            <h3 className="text-3xl font-cormorant text-bloom-green">Order Summary</h3>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center bg-bloom-pink/5 p-4 rounded-3xl border border-bloom-pink/10">
                  <FlowerImage 
                    flowerName={item.name}
                    photoIds={item.photoIds || []}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-2xl"
                  />
                  <div className="flex-1">
                    <h4 className="font-cormorant font-semibold text-bloom-green">{item.name}</h4>
                    <p className="text-sm text-bloom-green/60">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-bloom-green">${item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="p-8 bg-bloom-green text-white rounded-[2.5rem] space-y-4 shadow-2xl">
              <div className="flex justify-between text-sm opacity-80 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm opacity-80 uppercase tracking-widest">
                <span>Shipping ({selectedCity})</span>
                <span>${shipping}</span>
              </div>
              <div className="h-px bg-white/20 my-4" />
              <div className="flex justify-between items-center">
                <span className="text-xl font-cormorant">Total</span>
                <span className="text-3xl font-bold font-dmsans">${total}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border-2 border-dashed border-bloom-gold/30 rounded-2xl text-bloom-gold text-sm font-medium">
               <span className="text-2xl">✨</span>
               Free premium gift wrap included with every order this week!
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bloom-green/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              className="bg-white p-12 rounded-[3rem] max-w-lg w-full text-center relative overflow-hidden"
            >
              {/* Confetti effect placeholder */}
              <div className="absolute top-0 left-0 w-full h-2 flex justify-around">
                 {[...Array(20)].map((_, i) => (
                   <motion.div 
                    key={i}
                    initial={{ y: -20 }}
                    animate={{ y: 500, x: (Math.random() - 0.5) * 200, rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                    className="text-bloom-pink"
                   >
                     🌸
                   </motion.div>
                 ))}
              </div>

              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                 <CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-cormorant text-bloom-green mb-4">Order Confirmed!</h2>
              <p className="text-bloom-green/60 font-dmsans mb-10 leading-relaxed">
                Thank you for choosing Kelvin's Blooms. We're hand-selecting your flowers right now. 
                A confirmation email has been sent to your inbox.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="w-full bg-bloom-pink text-white py-5 rounded-full font-bold shadow-xl hover:bg-bloom-gold transition-all"
              >
                Back to Home
              </button>
              
              <button 
                onClick={() => setIsSuccess(false)}
                className="absolute top-8 right-8 text-bloom-green/20 hover:text-bloom-green transition-colors"
              >
                <X />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Checkout;
