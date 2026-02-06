"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';

export default function OTPVerification() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Illustration */}
        <div className="hidden md:flex justify-center">
          <div className="relative w-full max-w-lg aspect-square">
            {/* Replace with your actual exported illustration path */}
            <img 
              src="/artwork.jpg" 
              alt="Task Manager Illustration" 
              className="object-contain"
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col items-center md:items-start space-y-8 px-10 md:px-12">
          {/* Logo */}
          <div className="mb-4">
            <img src="/logo.jpg" alt="Infinite Corporate" className="h-20 w-auto" />
          </div>

          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-4xl text-center font-bold text-black ml-10">OTP verification</h1>
            <p className="text-gray-500 max-w-xs leading-relaxed ml-10">
              Please enter the OTP, we have sent to your registered email to complete your verification
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="flex gap-2 ml-7">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 border border-gray-400 rounded-lg text-center text-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              />
            ))}
          </div>

          <p className="text-sm text-gray-600 ml-40 ">
            Don't receive the code? <button className="text-blue-600 font-medium hover:underline">resend</button>
          </p>

          {/* Action Buttons */}
          <div className="w-full max-w-sm space-y-4">
            <button className="w-full bg-black text-white py-4 rounded-full text-lg font-bold hover:bg-gray-800 transition-colors">
              Verify
            </button>
            <button className="w-full bg-white text-black py-4 border border-black rounded-full text-lg font-bold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}