"use client";
import { useState } from 'react';
import Link from 'next/link';
import { resendVerificationEmail } from '@/app/lib/auth-actions';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const result = await resendVerificationEmail(email);
      if (result.success) {
        setMessage('Verification email resent! Check your inbox.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Check your email</h1>
        <p className="text-gray-600 mb-6">
          We've sent a confirmation link to your email address. Please click it to activate your account.
        </p>

        <div className="mt-8 border-t pt-6">
          <p className="text-sm text-gray-500 mb-4">
            Didn't receive the email? Enter your email and we'll resend it.
          </p>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl mb-3"
          />
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend verification email'}
          </button>
          {message && <p className="mt-3 text-green-600 text-sm">{message}</p>}
          {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        </div>

        <Link href="/login" className="block mt-6 text-blue-600 hover:underline">
          Return to login
        </Link>
      </div>
    </div>
  );
}