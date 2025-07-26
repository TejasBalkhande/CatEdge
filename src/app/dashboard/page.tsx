'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Declare Razorpay globally
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signup-login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          setError(data.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const upgradeToPremium = async () => {
    try {
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const { order } = await response.json();

      if (!window.Razorpay) {
        alert('Payment gateway failed to load. Please try again.');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'CATPrepEdge',
        description: 'Premium Plan Upgrade',
        order_id: order.id,
        handler: async function (response: any) {
          const verificationResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const result = await verificationResponse.json();
          if (verificationResponse.ok) {
            setUser({ ...user, role: 'premium' });
            alert('Payment successful! Your account is now premium.');
          } else {
            alert('Payment verification failed: ' + result.message);
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#00CFFF',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Failed to initiate payment');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/signup-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 flex items-center justify-center">
        <div className="text-cyan-400 text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 flex items-center justify-center">
        <div className="text-red-400 text-2xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950">

      {/* Fixed Nav - Full Width Fix */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-gray-800 shadow-xl w-full">
        <div className="w-full flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CATPrepEdge
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-300"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl p-8 transition-all duration-500 hover:shadow-blue-500/10">
            <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

            {/* Account Information */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-cyan-400 mb-6">Account Information</h2>
              <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 mb-1">Full Name</p>
                    <p className="text-white text-lg font-medium">{user?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Email Address</p>
                    <p className="text-white text-lg font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Account Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      user?.role === 'premium'
                        ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    }`}>
                      {user?.role === 'premium' ? 'Premium User' : 'Free User'}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Member Since</p>
                    <p className="text-white text-lg font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Section
            {user?.role === 'free' && (
              <div className="border-t border-gray-700 pt-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-cyan-400 mb-2">Upgrade to Premium</h2>
                    <p className="text-gray-300 max-w-2xl">
                      Unlock exclusive CAT preparation resources, advanced analytics, and personalized study plans.
                      Get premium access for just ₹299.
                    </p>
                  </div>
                  <button
                    onClick={upgradeToPremium}
                    className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-medium rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500/50 disabled:opacity-70 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 px-8 py-3.5 whitespace-nowrap"
                  >
                    Upgrade to Premium - ₹299
                  </button>
                </div>
              </div>
            )} */}

            {/* Premium Features */}
            {/* {user?.role === 'premium' && (
              <div className="border-t border-gray-700 pt-10">
                <h2 className="text-2xl font-bold text-cyan-400 mb-6">Premium Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: '📊', title: 'Advanced Analytics', desc: 'Detailed performance insights to identify your strengths and weaknesses.' },
                    { icon: '📚', title: 'Exclusive Resources', desc: 'Access premium study materials and practice questions.' },
                    { icon: '🎯', title: 'Personalized Plans', desc: 'Custom study plans tailored to your progress and goals.' },
                    { icon: '🚀', title: 'Priority Support', desc: 'Get your questions answered faster with dedicated support.' }
                  ].map(({ icon, title, desc }, i) => (
                    <div key={i} className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
                      <div className="text-cyan-400 text-3xl mb-4">{icon}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                      <p className="text-gray-300">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </main>

      <footer className="bg-black/30 backdrop-blur-md border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} CATPrepEdge. All rights reserved.</p>
          <p className="mt-2 text-gray-600 text-sm">The ultimate CAT preparation platform for MBA aspirants</p>
        </div>
      </footer>
    </div>
  );
}
