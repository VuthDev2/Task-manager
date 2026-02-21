"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { createClient } from '@/src/utils/supabase/client'; // ✅ adjust path if needed

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset`,
    });

    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setStatus('success');
      setMessage('Check your email for the password reset link!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE: ILLUSTRATION */}
        <div className="hidden md:flex justify-center">
          <Image
            src="/artwork.jpg"
            alt="Artwork"
            width={500}
            height={500}
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="flex flex-col space-y-6 px-8 md:px-16">
          
          {/* LOGO */}
          <div className="mb-4">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={150}
              height={60}
              className="h-20 w-auto mb-7 object-contain"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 p-2 rounded-full">
                <Lock className="w-5 h-5 mb-5 text-gray-700" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-5">Forgot password?</h1>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              No worries, we'll send you reset instructions.
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>
            </div>

            {/* STATUS MESSAGES */}
            {status === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>{message}</span>
              </div>
            )}
            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={`w-full py-4 rounded-full font-bold transition-all ${
                status === 'success'
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-black text-white hover:bg-gray-800 active:scale-95'
              }`}
            >
              {status === 'loading'
                ? 'Sending...'
                : status === 'success'
                ? 'Email Sent!'
                : 'Send Reset Link'}
            </button>
          </form>

          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}