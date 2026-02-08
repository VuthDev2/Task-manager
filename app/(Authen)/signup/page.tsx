"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen bg-white items-center justify-center p-6">
      
      {/* MASTER WRAPPER: Perfectly balanced 50/50 split */}
      <div className="grid lg:grid-cols-2 w-full max-w-6xl items-center">
        
        {/* LEFT SIDE: FORM COLUMN */}
        <div className="flex  mb-30 flex-col justify-center px-4 md:px-12 lg:px-20">
          
          {/* Logo - Positioned to keep form height tight */}
          <div className="mb-2">
            <Image
              src="/logo.jpg"
              alt="Infinite Corporate Logo"
              width={100}
              height={35}
              className="object-contain"
            />
          </div>

          <div className="w-full max-w-md">
            <h1 className="text-4xl text-center font-black text-black tracking-tighter">Sign Up</h1>
            <p className="mt-1 text-center text-sm font-bold text-gray-400">Create an account</p>

            {/* Tightened space-y-4 to fit the vertical height of the image */}
            <form className="mt-8 space-y-4">
              
              {/* Username Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-gray-50/50 rounded-2xl border-2 border-gray-100 p-3.5 text-sm font-bold outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-gray-50/50 rounded-2xl border-2 border-gray-100 p-3.5 text-sm font-bold outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-gray-50/50 rounded-2xl border-2 border-gray-100 p-3.5 text-sm font-bold outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-300"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <EyeIcon />
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full bg-gray-50/50 rounded-2xl border-2 border-gray-100 p-3.5 text-sm font-bold outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Submit Button */}
              <button className="w-full rounded-2xl bg-black py-4 font-black text-white transition hover:bg-zinc-800 shadow-lg shadow-gray-200 active:scale-[0.98] mt-2">
                Sign up
              </button>

              {/* Sign In Link: Aligned right under the button */}
              <div className="text-right pt-2">
                <p className="text-[12px] text-center font-bold text-gray-400">
                  Already have an account? <Link href="/login" className="font-black text-blue-600 hover:underline">Sign In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE: IMAGE (Height optimized to match the form) */}
        <div className="hidden lg:flex items-center justify-center h-full">
          <div className="relative w-full h-[900px]">
            <Image
              src="/artwork.jpg"
              alt="Corporate Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Eye Icon Component
function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}