import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { User as UserIcon, Package, Heart, Lock, LogOut, ChevronRight, Camera, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FlowerImage from '../components/FlowerImage';
import { Order, Flower } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Spinner = () => (
  <div className="w-8 h-8 border-4 border-bloom-pink border-t-transparent rounded-full animate-spin mx-auto" />
);

const UserDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistFlowers, setWishlistFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'wishlist') fetchWishlist();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (data.success) setOrders(data.data);
    } catch (error) {
      console.error('Fetch orders failed', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (data.success) setWishlistFlowers(data.data.wishlist);
    } catch (error) {
      console.error('Fetch wishlist failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${API_URL}/users/profile`, profileData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (data.success) {
        updateUser({ ...user, ...profileData });
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Update failed',
      });
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const { data } = await axios.put(`${API_URL}/users/profile-picture`, formData, {
        headers: { 
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      if (data.success) {
        updateUser({ ...user, profilePicture: data.data.profilePicture });
        setMessage({ type: 'success', text: 'Profile picture updated!' });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Upload failed',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    try {
      const { data } = await axios.put(
        `${API_URL}/users/password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Password change failed',
      });
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <UserIcon size={20} /> },
    { id: 'orders', label: 'My Orders', icon: <Package size={20} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={20} /> },
    { id: 'password', label: 'Security', icon: <Lock size={20} /> },
  ];

  return (
    <div className="pt-32 pb-24 px-6 bg-bloom-cream dark:bg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-bloom-green/60 dark:text-white/40 mb-12">
          <Link to="/" className="hover:text-bloom-pink transition-colors">Home</Link>
          <ChevronRight size={10} className="opacity-40" />
          <span className="text-bloom-green/40 dark:text-white/20">My Dashboard</span>
          <div className="flex-1" />
          <Link to="/shop" className="text-bloom-pink hover:text-bloom-green dark:hover:text-white transition-colors flex items-center gap-2">
            Explore More Blooms <ChevronRight size={12} />
          </Link>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="glass p-8 rounded-[2rem] sticky top-32">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-bloom-green/10 dark:border-white/10">
                <div className="relative group">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.fullName} 
                      className="w-20 h-20 rounded-full object-cover border-4 border-bloom-pink/20"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-bloom-pink/20 flex items-center justify-center text-bloom-pink text-3xl font-bold">
                      {user?.fullName?.charAt(0)}
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-bloom-green text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleProfilePictureUpload}
                  />
                </div>
                <div>
                  <h2 className="font-cormorant font-bold text-xl text-bloom-green dark:text-white">
                    {user?.fullName}
                  </h2>
                  <p className="text-xs text-bloom-green/40 dark:text-white/40">@{user?.username}</p>
                </div>
              </div>
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-bloom-green text-white shadow-lg shadow-bloom-green/20'
                        : 'text-bloom-green/60 dark:text-white/60 hover:bg-white/40 dark:hover:bg-white/10 hover:text-bloom-green dark:hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all mt-8"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:flex-1">
            <AnimatePresence mode="wait">

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass p-10 rounded-[2.5rem]"
                >
                  <h3 className="text-3xl font-cormorant font-bold text-bloom-green dark:text-white mb-8">
                    Personal Information
                  </h3>
                  {message.text && (
                    <div className={`mb-8 p-4 rounded-xl text-sm border ${
                      message.type === 'success'
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {message.text}
                    </div>
                  )}
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-bloom-green/40 dark:text-white/40 ml-4">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) =>
                            setProfileData({ ...profileData, fullName: e.target.value })
                          }
                          className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-dark-card dark:text-white border border-bloom-green/10 dark:border-white/10 focus:ring-2 focus:ring-bloom-green/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-bloom-green/40 dark:text-white/40 ml-4">
                          Username
                        </label>
                        <input
                          type="text"
                          value={profileData.username}
                          onChange={(e) =>
                            setProfileData({ ...profileData, username: e.target.value })
                          }
                          className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-dark-card dark:text-white border border-bloom-green/10 dark:border-white/10 focus:ring-2 focus:ring-bloom-green/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 dark:text-white/40 ml-4">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-dark-card dark:text-white border border-bloom-green/10 dark:border-white/10 focus:ring-2 focus:ring-bloom-green/20 outline-none"
                      />
                    </div>
                    <button className="bg-bloom-green text-white px-10 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-bloom-green/20">
                      Update Profile
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl font-cormorant font-bold text-bloom-green dark:text-white mb-8">
                    Order History
                  </h3>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Spinner />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="glass p-12 rounded-[2.5rem] text-center">
                      <Package size={48} className="mx-auto text-bloom-green/20 mb-4" />
                      <p className="text-bloom-green/60 dark:text-white/60">You have not placed any orders yet.</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order._id}
                        className="glass p-8 rounded-[2rem] flex flex-col md:flex-row justify-between gap-8"
                      >
                        <div className="flex gap-6">
                          <div className="flex -space-x-4">
                            {order.items.slice(0, 3).map((item, i) => (
                              <FlowerImage
                                key={i}
                                flowerName={item.flower?.name || ""}
                                photoIds={item.flower?.photoIds || []}
                                originalImage={item.flower?.image}
                                alt="flower"
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-xl border-2 border-white dark:border-dark-card"
                              />
                            ))}
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-bloom-green/40 dark:text-white/40 mb-1">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <h4 className="font-bold text-bloom-green dark:text-white">
                              Order #{order._id.slice(-6).toUpperCase()}
                            </h4>
                            <p className="text-sm text-bloom-green/60 dark:text-white/60">
                              {order.items.length} items • ₦{order.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-bloom-pink/20 text-bloom-pink'
                          }`}>
                            {order.status}
                          </span>
                          <Link to={`/tracking/${order._id}`} className="p-3 rounded-xl border border-bloom-green/10 dark:border-white/10 text-bloom-green dark:text-white hover:bg-bloom-green hover:text-white transition-all">
                            <ChevronRight size={20} />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-3xl font-cormorant font-bold text-bloom-green dark:text-white mb-8">
                    My Favorites
                  </h3>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Spinner />
                    </div>
                  ) : wishlistFlowers.length === 0 ? (
                    <div className="glass p-12 rounded-[2.5rem] text-center">
                      <Heart size={48} className="mx-auto text-bloom-green/20 mb-4" />
                      <p className="text-bloom-green/60 dark:text-white/60">Your wishlist is empty.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {wishlistFlowers.map((flower) => (
                        <ProductCard key={flower._id} flower={flower} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass p-10 rounded-[2.5rem]"
                >
                  <h3 className="text-3xl font-cormorant font-bold text-bloom-green dark:text-white mb-8">
                    Update Password
                  </h3>
                  {message.text && (
                    <div className={`mb-8 p-4 rounded-xl text-sm border ${
                      message.type === 'success'
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {message.text}
                    </div>
                  )}
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-bloom-green/40 dark:text-white/40 ml-4">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, oldPassword: e.target.value })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-dark-card dark:text-white border border-bloom-green/10 dark:border-white/10 focus:ring-2 focus:ring-bloom-green/20 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-bloom-green/40 dark:text-white/40 ml-4">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                          className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-dark-card dark:text-white border border-bloom-green/10 dark:border-white/10 focus:ring-2 focus:ring-bloom-green/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-bloom-green/40 dark:text-white/40 ml-4">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                          className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-dark-card dark:text-white border border-bloom-green/10 dark:border-white/10 focus:ring-2 focus:ring-bloom-green/20 outline-none"
                        />
                      </div>
                    </div>
                    <button className="bg-bloom-green text-white px-10 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-bloom-green/20">
                      Change Password
                    </button>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
