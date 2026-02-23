"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signup } from "@/app/lib/auth-actions";
import { signInWithGoogle } from "@/app/lib/auth-actions";
import { url } from 'inspector/promises';

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);


  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      if (result?.url) {
        window.location.href = result.url; // redirect to Google
      } else if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    /* Full screen wrapper */
    <div className="flex h-screen w-screen bg-white items-center justify-center p-6 overflow-hidden">
      
      {/* Centered Wrapper */}
      <div className="flex w-full max-w-[1100px] items-center justify-center gap-16 lg:gap-24 relative">
        
        {/* LEFT SIDE: FORM */}
        <div className="w-full max-w-[410px] flex flex-col z-5 mb-20">
          
          {/* Logo */}
          <div className="mb-8">
            <Image 
              src="/logo.svg" 
              alt="Infinite Corporate Logo" 
              width={100} 
              height={40} 
              className="object-contain"
            />
          </div>

          <h1 className="text-5xl font-black text-black tracking-tighter mb-2 italic uppercase">
            Get Started!
          </h1>
          <p className="text-sm font-bold text-gray-400 mb-8">
            Enter your information to create an account
          </p>

          <form 
            className="space-y-4"
            action={async (formData) => {
              '';
              const result = await signup(formData);
              
              if (result?.error) {
                setError(result.error);
              }
            }}
          >
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-900 tracking-widest ml-1">First Name</label>
                <input 
                  name="first-name"
                  placeholder="First Name"
                  required
                  className="w-full bg-white rounded-xl border border-gray-200 p-3 text-sm font-bold outline-none focus:border-black transition-all shadow-sm placeholder:text-gray-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-900 tracking-widest ml-1">Last Name</label>
                <input 
                  name="last-name"
                  placeholder="Last Name"
                  required
                  className="w-full bg-white rounded-xl border border-gray-200 p-3 text-sm font-bold outline-none focus:border-black transition-all shadow-sm placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-900 tracking-widest ml-1">Email</label>
              <input 
                name="email"
                type="email" 
                placeholder="m@example.com"
                required
                className="w-full bg-white rounded-xl border border-gray-200 p-3.5 text-sm font-bold outline-none focus:border-black transition-all shadow-sm placeholder:text-gray-300"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-900 tracking-widest ml-1">Password</label>
              <input 
                name="password"
                type="password" 
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-white rounded-xl border border-gray-200 p-3.5 text-sm font-bold outline-none focus:border-black transition-all shadow-sm placeholder:text-gray-300"
              />
            </div>

            {/* Error Message (same as login page) */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded text-sm text-center">
                {error}
              </div>
            )}

            {/* Main Sign Up Button */}
            <button 
              type="submit"
              className="w-full mb-1 rounded-xl bg-black py-4 font-black text-white transition hover:bg-zinc-800 shadow-xl shadow-gray-200 active:scale-[0.98] cursor-pointer"
            >
              Create an account
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2 mb-1">
              <div className="h-[1px] flex-1 bg-gray-400"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Or continue with</span>
              <div className="h-[1px] flex-1 bg-gray-400"></div>
            </div>

            {/* Google Sign-In Button - INLINE (same as login page) */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full rounded-xl bg-white border border-gray-200 py-3 font-bold text-gray-800 transition hover:bg-gray-50 shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3"
            >
              {googleLoading ? (
                <span className="text-sm">Signing in...</span>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-sm font-bold">Continue with Google</span>
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <p className="text-[12px] font-bold text-gray-400">
                Already have an account? <Link href="/login" className="font-black text-blue-600 hover:underline ml-1">Sign In</Link>
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE: IMAGE */}
        <div className="hidden lg:block w-[500px] pointer-events-none select-none">
          <Image 
            src="/artwork.jpg" 
            alt="Sign Up Illustration"
            width={500}
            height={500}
            className="object-contain"
            priority 
          />
        </div>

      </div>
    </div>
  );
}