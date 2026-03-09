"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { login, signInWithGoogle } from "@/app/lib/auth-actions";
import { toast } from 'sonner';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('confirmed') === 'true') {
      toast.success('Email confirmed!', {
        description: 'You can now log in to your account.',
        duration: 5000,
      });
      window.history.replaceState({}, '', '/login');
    }
  }, []);

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
    <div className="flex h-screen w-screen bg-white items-center justify-center p-6 overflow-hidden">

      {/* Centered Wrapper */}
      <div className="flex w-full max-w-[1000px] items-center justify-center gap-16 lg:gap-24">

        {/* LEFT SIDE: FORM */}
        <div className="w-full max-w-[380px] mb-22 flex flex-col z-50">

          <div className="mb-10">
            <Image src="/logo.svg" alt="Logo" width={100} height={40} className="object-contain" />
          </div>

          <h1 className="text-3xl font-black text-black tracking-tighter mb-2 uppercase">
            Welcome Back!
          </h1>
          <p className="text-sm font-bold text-gray-400 mb-8">
            Please enter login details below
          </p>

          <form
            className=""
            action={async (formData) => {
              const result = await login(formData);
              if (result?.error) {
                setError(result.error);
              }
            }}
          >
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-black uppercase text-gray-900 tracking-widest ml-2">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Enter the email address"
                required
                className="w-full mb-2 text-gray-500 bg-white rounded-xl border border-gray-200 p-3.5 text-sm font-bold outline-none focus:border-black transition-all shadow-sm"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-900 tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  placeholder="Enter the Password"
                  required
                  className="w-full mb-2 text-gray-400 bg-white rounded-xl border border-gray-200 p-3.5 text-sm font-bold outline-none focus:border-black transition-all shadow-sm"
                />
              </div>

              <div className="flex items-center mb-2 justify-between mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" name="remember" defaultChecked />
                  Remember me
                </label>
                <Link href="/forgot-password" className=" text-black-600 text-[10px] px-1  text-black uppercase hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-xl mt-1 bg-black py-4 font-black text-white transition hover:bg-zinc-800 shadow-xl active:scale-[0.98] cursor-pointer"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-3">
              <div className="h-[1px] flex-1 bg-gray-300"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Or continue with</span>
              <div className="h-[1px] flex-1 bg-gray-300"></div>
            </div>

            {/* Google Sign-In Button */}
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

            {/* Footer */}
            <div className="pt-4 text-center">
              <p className="text-[12px] font-bold text-gray-400">
                Don't have an account? <Link href="/signup" className="font-black text-blue-600 hover:underline">Sign Up</Link>
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE: IMAGE */}
        <div className="hidden lg:block w-[500px] pointer-events-none select-none">
          <Image
            src="/artwork.jpg"
            alt="Login Illustration"
            width={600}
            height={600}
            className="object-contain"
            priority
          />
        </div>

      </div>
    </div>
  );
}