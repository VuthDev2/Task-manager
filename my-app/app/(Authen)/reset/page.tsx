"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Consistent Branding Illustration */}
        <div className="hidden md:flex justify-center">
          <img 
            src="/artwork.jpg" 
            alt="Management Illustration" 
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col space-y-6 px-4 md:px-16">
          
           {/* Logo */}
          <div className="mb-4">
            <img src="/logo.jpg" alt="Infinite Corporate" className="h-20 w-auto" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Reset Password</h1>
            <p className="text-gray-500 text-sm">Please choose a strong password you haven't used before.</p>
          </div>

          <form className="space-y-5 w-full max-w-sm">
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a new password"
                  className="w-full text-gray-400 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full text-gray-400 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Requirements Checklist (Optional Professional Touch) */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 size={14} className={formData.password.length >= 8 ? "text-green-500" : "text-gray-300"} />
                At least 8 characters long
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 size={14} className={formData.password === formData.confirmPassword && formData.password !== "" ? "text-green-500" : "text-gray-300"} />
                Passwords match
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 shadow-lg transition-all active:scale-95"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}