import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import axios from 'axios';
import { CheckCircle2, Package, Truck, Home, ArrowLeft, Loader2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const STAGES = [
  { id: 'Confirmed', label: 'Order Confirmed', icon: <CheckCircle2 />, description: 'We have received your order.' },
  { id: 'Preparing', label: 'Preparing Your Bouquet', icon: <Package />, description: 'Our florists are hand-picking the freshest stems.' },
  { id: 'Out for Delivery', label: 'Out for Delivery', icon: <Truck />, description: 'Your bouquet is on its way to you!' },
  { id: 'Delivered', label: 'Delivered', icon: <Home />, description: 'Enjoy your beautiful blooms!' }
];

const OrderTrackingPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (data.success) {
          setOrder(data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    const socket = io(SOCKET_URL);
    socket.emit('joinOrder', id);

    socket.on('orderStatusUpdate', ({ status }) => {
      setOrder((prevOrder: any) => ({ ...prevOrder, status }));
    });

    return () => {
      socket.disconnect();
    };
  }, [id, user?.token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bloom-cream dark:bg-dark-bg">
        <Loader2 className="animate-spin text-bloom-pink" size={48} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bloom-cream dark:bg-dark-bg px-6">
        <div className="glass p-12 rounded-[3rem] text-center max-w-md">
          <h2 className="text-3xl font-cormorant text-bloom-green dark:text-white mb-4">Oops!</h2>
          <p className="text-bloom-green/60 mb-8">{error || 'Order not found.'}</p>
          <Link to="/dashboard">
            <button className="bg-bloom-green text-white px-8 py-3 rounded-xl font-bold">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex(s => s.id === order.status);
  const activeIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  return (
    <div className="pt-32 pb-24 px-6 bg-bloom-cream dark:bg-dark-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
          <Link to="/dashboard" className="p-3 rounded-full bg-white dark:bg-dark-card shadow-sm text-bloom-green hover:bg-bloom-pink hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-cormorant text-bloom-green dark:text-white font-bold">
              Track <span className="italic">Order</span>
            </h1>
            <p className="text-bloom-green/40 font-bold uppercase tracking-widest text-xs">
              Order #{id?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="glass p-8 md:p-16 rounded-[3rem] relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between gap-12 relative z-10">
            {STAGES.map((stage, index) => {
              const isCompleted = index < activeIndex;
              const isActive = index === activeIndex;
              
              return (
                <div key={stage.id} className="flex-1 relative">
                  {/* Connector Line */}
                  {index < STAGES.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-bloom-green/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: isCompleted ? '100%' : '0%' }}
                        className="h-full bg-bloom-green"
                      />
                    </div>
                  )}

                  <div className="flex md:flex-col items-center gap-6 md:text-center relative z-10">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isCompleted || isActive 
                          ? 'bg-bloom-green text-white shadow-xl shadow-bloom-green/20' 
                          : 'bg-white dark:bg-dark-card text-bloom-green/20'
                      }`}
                    >
                      {React.cloneElement(stage.icon as React.ReactElement, { size: 32 })}
                    </motion.div>
                    
                    <div>
                      <h3 className={`font-bold mb-1 ${isCompleted || isActive ? 'text-bloom-green dark:text-white' : 'text-bloom-green/20'}`}>
                        {stage.label}
                      </h3>
                      <p className={`text-xs md:max-w-[150px] mx-auto ${isActive ? 'text-bloom-green/60 dark:text-white/60' : 'text-bloom-green/20'}`}>
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 pt-12 border-t border-bloom-green/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-xs uppercase tracking-[0.3em] text-bloom-pink font-bold italic">Order Details</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-bloom-green dark:text-white/80">
                    <Package size={20} className="text-bloom-gold" />
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-40">Status</p>
                      <p className="font-medium">{order.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-bloom-green dark:text-white/80">
                    <Clock size={20} className="text-bloom-gold" />
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-40">Delivery Slot</p>
                      <p className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()} • {order.timeSlot}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-bloom-green dark:text-white/80">
                    <Home size={20} className="text-bloom-gold" />
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-40">Delivery Address</p>
                      <p className="font-medium">{order.deliveryAddress}, {order.city}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-bloom-green/5 dark:bg-white/5 p-8 rounded-3xl border border-bloom-green/10">
                <h4 className="text-xs uppercase tracking-[0.3em] text-bloom-pink font-bold italic mb-6">Need Help?</h4>
                <p className="text-sm text-bloom-green/60 dark:text-white/60 mb-6">
                  If you have any questions about your delivery, please contact our support team.
                </p>
                <a href="https://wa.me/2347033699729" target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform">
                    Chat with Florist
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
