import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify/${token}`);
        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-bloom-cream dark:bg-dark-bg flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass p-12 text-center rounded-[2rem]"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="animate-spin text-bloom-green mx-auto mb-6" size={64} />
            <h1 className="text-3xl font-cormorant text-bloom-green dark:text-white mb-4">Verifying your email...</h1>
            <p className="text-bloom-green/60 dark:text-white/60 italic">Please wait while we confirm your identity in the garden.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
            <h1 className="text-3xl font-cormorant text-bloom-green dark:text-white mb-4">Email Verified!</h1>
            <p className="text-bloom-green/60 dark:text-white/60 italic mb-8">{message}</p>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-bloom-green text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                Go to Login <ArrowRight size={20} />
              </motion.button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="text-red-500 mx-auto mb-6" size={64} />
            <h1 className="text-3xl font-cormorant text-bloom-green dark:text-white mb-4">Verification Failed</h1>
            <p className="text-bloom-green/60 dark:text-white/60 italic mb-8">{message}</p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-bloom-pink text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                Try Registering Again <ArrowRight size={20} />
              </motion.button>
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
