"use client";
import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for sending reset link goes here
    if (email.includes("@")) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Illustration (Consistent with OTP page) */}
        <div className="hidden md:flex justify-center">
          <img 
            src="/artwork.jpg" 
            alt="Management Illustration" 
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* Right Side: Professional Form */}
        <div className="flex flex-col space-y-6 px-4 md:px-16">
          
           {/* Logo */}
          <div className="mb-4">
            <img src="/logo.jpg" alt="Infinite Corporate" className="h-20 w-auto" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 p-2 rounded-full">
                <Lock className="w-5 h-5 text-gray-700" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Forgot password?</h1>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              No worries, we'll send you reset instructions. Please enter the email address linked to your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-sm">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Success/Error Alerts */}
            {status === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Success: Check your email for a reset link!
              </div>
            )}
            
            {status === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Error: Email not found. Please try again.
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transform active:scale-[0.98] transition-all shadow-lg shadow-gray-200"
            >
              Send Reset Link
            </button>
          </form>

          <a 
            href="/login" 
            className="flex items-center justify-center md:justify-start gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}