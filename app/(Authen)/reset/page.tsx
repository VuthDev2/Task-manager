"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/src/utils/supabase/client'; // ✅ adjust path if needed

export default function ResetPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use useMemo to avoid creating a new client on every render
  const supabase = React.useMemo(() => createClient(), []);

  // Exchange the code for a session on page load
  useEffect(() => {
    const handleResetFlow = async () => {
      try {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const code = url.searchParams.get('code');

        // Manual fragment parsing as a fallback
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        console.log('--- Reset Flow Debug ---');
        console.log('Full URL:', currentUrl);
        console.log('Reset Code (PKCE):', !!code);
        console.log('Fragment Token:', !!accessToken);

        // 1. If PKCE code exists, exchange it
        if (code) {
          console.log('Exchanging PKCE code...');
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('Exchange error:', exchangeError);
            setError(`Link verification failed: ${exchangeError.message}`);
            setLoading(false);
            return;
          }
        }

        // 2. If fragment tokens exist, set session manually (Forceful approach)
        if (accessToken && refreshToken) {
          console.log('Manually setting session from fragment...');
          const { error: setError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          if (setError) {
            console.error('Manual setSession error:', setError);
          }
        }

        // 3. Final session verification
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        console.log('Session verified:', !!session);

        if (sessionError) {
          setError(`Session error: ${sessionError.message}`);
        } else if (!session) {
          // One last try: wait for onAuthStateChange
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
              console.log('Session found via onAuthStateChange event:', event);
              setLoading(false);
              subscription.unsubscribe();
            }
          });

          // Wait a bit longer
          await new Promise(r => setTimeout(r, 1000));

          const { data: { session: finalSession } } = await supabase.auth.getSession();
          if (!finalSession) {
            setError('Auth session missing! Please try clicking the link in your email again.');
          }
        }
      } catch (err) {
        console.error('Reset Flow Crash:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    handleResetFlow();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE: ILLUSTRATION */}
        <div className="hidden md:flex justify-center">
          <Image
            src="/artwork.jpg"
            alt="Management Illustration"
            width={500}
            height={500}
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="flex flex-col space-y-6 px-4 md:px-16">

          {/* LOGO */}
          <div className="mb-4">
            <Image
              src="/logo.svg"
              alt="Infinite Corporate"
              width={150}
              height={60}
              className="h-20 w-auto object-contain"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Reset Password
            </h1>
            <p className="text-gray-500 text-sm">
              Please choose a strong password you haven't used before.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs text-center font-bold">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs text-center font-bold animate-pulse">
              Password updated successfully! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-5 w-full max-w-sm">
            {/* NEW PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter a new password"
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={success}
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

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={success}
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

            {/* PASSWORD REQUIREMENTS */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2
                  size={14}
                  className={password.length >= 8 ? 'text-green-500' : 'text-gray-300'}
                />
                At least 8 characters long
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2
                  size={14}
                  className={
                    password === confirmPassword && password !== ''
                      ? 'text-green-500'
                      : 'text-gray-300'
                  }
                />
                Passwords match
              </div>
            </div>

            <button
              type="submit"
              disabled={success}
              className={`w-full py-4 rounded-full font-bold shadow-lg transition-all active:scale-95 ${success
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
                }`}
            >
              {success ? 'Updated!' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}