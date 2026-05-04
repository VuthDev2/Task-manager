"use client";
import { useState } from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC] p-4 sm:p-6">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 sm:p-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <MailCheck size={30} />
        </div>
        <h1 className="text-3xl font-black text-gray-950 mb-4">Check your email</h1>
        <p className="text-gray-600 mb-6 leading-7">
          We&apos;ve sent a confirmation link to your email address. Please click it to activate your account.
        </p>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500 mb-4">
            Didn&apos;t receive the email? Enter your email and we&apos;ll resend it.
          </p>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl mb-3 outline-none focus:border-black focus:ring-4 focus:ring-gray-100 transition-all"
          />
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full bg-gray-950 text-white py-3 rounded-xl font-black hover:bg-indigo-700 transition disabled:opacity-50"
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
