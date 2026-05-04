"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { requestPasswordReset } from '@/app/lib/auth-actions';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const trimmedEmail = email.trim();
    const origin = typeof window !== 'undefined' ? window.location.origin : undefined;

    console.log('Attempting password reset for:', trimmedEmail);

    const result = await requestPasswordReset(trimmedEmail, origin);

    if (result.error) {
      console.error('Reset Error:', result.error);
      setStatus('error');
      setMessage(result.error);
    } else {
      console.log('Reset email sent successfully via Resend');
      setStatus('success');
      setMessage('Check your email for the password reset link!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC] p-4 font-sans sm:p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 gap-8 md:grid-cols-[1.05fr_0.95fr] items-center">

        {/* LEFT SIDE: ILLUSTRATION */}
        <div className="hidden overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-gray-100 md:block">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Account Recovery</p>
          <h2 className="mt-3 max-w-md text-4xl font-black leading-tight text-gray-950">Get back to your workspace securely.</h2>
          <Image
            src="/artwork.jpg"
            alt="Artwork"
            width={500}
            height={500}
            className="mt-6 w-full max-w-md object-contain"
          />
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="flex flex-col space-y-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">

          {/* LOGO */}
          <div className="mb-4">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={150}
              height={60}
                className="h-14 w-auto object-contain"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 p-2 rounded-full">
                <Lock className="w-5 h-5 text-gray-700" />
              </div>
              <h1 className="text-3xl font-black text-gray-950">Forgot password?</h1>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-gray-100 transition-all"
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
              className={`w-full py-4 rounded-full font-bold transition-all ${status === 'success'
                ? 'bg-gray-200 text-gray-500'
                : 'bg-gray-950 text-white hover:bg-indigo-700 active:scale-95'
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
