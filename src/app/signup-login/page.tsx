// src/app/signup-login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Define TypeScript interfaces
interface AuthFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthResponse {
  token?: string;
  message?: string;
}

export default function AuthPage() {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<AuthFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!isLogin && !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setAuthError('');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            fullName: formData.fullName, 
            email: formData.email, 
            password: formData.password 
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data: AuthResponse = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setIsAuthenticated(true);
        router.push('/');
      } else {
        setAuthError(data.message || (isLogin ? 'Login failed' : 'Signup failed'));
      }
    } catch (error) {
      console.error(error);
      setAuthError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950">
      {/* Full‑width Navigation Bar */}
      <nav className="w-full bg-black/30 backdrop-blur-md border-b border-gray-800 shadow-xl">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          {/* Leftmost logo */}
          <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CATPrepEdge
          </div>
          {/* Rightmost link */}
          <Link 
            href="/" 
            className="px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Welcome Section */}
          <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl p-8 transition-all duration-500 hover:shadow-blue-500/10">
            <div className="mb-2 text-cyan-400 font-semibold tracking-wider">CAT PREPARATION REIMAGINED</div>
            <h1 className="text-4xl font-bold text-white mb-6">
              Welcome to <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">CATPrepEdge</span>
            </h1>
            
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                Your all-in-one CAT preparation companion that goes beyond previous year papers. 
                We help you master the Common Admission Test with confidence through comprehensive 
                analytics, personalized mock tests, and strategic insights.
              </p>
              
              <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
                <h2 className="text-xl font-semibold text-white mb-2">Your Complete Preparation Ecosystem</h2>
                <p className="text-gray-300">
                  Track your progress with advanced analytics, solve curated practice questions, 
                  access IIM college cutoffs and placement statistics, and get our exclusive 
                  <span className="font-semibold text-cyan-300"> free CAT preparation book</span> - 
                  all in one integrated platform.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Why CATPrepEdge?</h3>
                <ul className="space-y-3">
                  {[
                    'Personalized analytics to identify strengths and weaknesses',
                    'Comprehensive IIM college profiles with cutoff trends',
                    'Placement statistics and package details for informed decisions',
                    'Free downloadable CAT strategy book with proven techniques'
                  ].map((text) => (
                    <li key={text} className="flex items-start group">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cyan-500/10 flex items-center justify-center mr-3 group-hover:bg-cyan-400/30 transition-colors">
                        <span className="text-cyan-400 font-bold">✓</span>
                      </div>
                      <p className="text-gray-300 group-hover:text-white transition-colors">{text}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <p className="text-gray-400 italic">
                  &quot;CATPrepEdge transformed my preparation strategy with actionable insights and 
                  comprehensive resources that went beyond standard PYQs.&quot;
                </p>
                <p className="text-cyan-400 mt-2">- IIM Ahmedabad Aspirant</p>
              </div>
            </div>
          </div>
          
          {/* Auth Form Container */}
          <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl p-8 transition-all duration-500 hover:shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Sign in to continue' : 'Create your account'}
            </h2>
            <p className="text-gray-400 mb-8">
              {isLogin 
                ? 'Access your personalized dashboard and resources' 
                : 'Start your CAT preparation journey with us today'}
            </p>
            
            {authError && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
                {authError}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-700/40 backdrop-blur-sm ${
                      errors.fullName ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="mt-2 text-sm text-red-400">{errors.fullName}</p>}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-700/40 backdrop-blur-sm ${
                      errors.email ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <input
                  id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-700/40 backdrop-blur-sm ${
                      errors.password ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300`}
                    placeholder="Enter your password"
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
                </div>
                
                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full px-4 py-3 bg-gray-700/40 backdrop-blur-sm ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>}
                  </div>
                )}
                
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-medium rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500/50 disabled:opacity-70 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 group"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : isLogin ? (
                      <span className="group-hover:scale-105 transition-transform">Sign In</span>
                    ) : (
                      <span className="group-hover:scale-105 transition-transform">Create Account</span>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-8 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:underline"
                >
                  {isLogin 
                    ? "Don&apos;t have an account? Create one" 
                    : "Already have an account? Sign in"}
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-500 text-center text-sm">
                  By signing up, you agree to our 
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 ml-1 transition-colors">Terms of Service</a> and 
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 ml-1 transition-colors">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-black/30 backdrop-blur-md border-t border-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500">© {new Date().getFullYear()} CATPrepEdge. All rights reserved.</p>
            <p className="mt-2 text-gray-600 text-sm">The ultimate CAT preparation platform for MBA aspirants</p>
          </div>
        </footer>
      </div>
    );
}