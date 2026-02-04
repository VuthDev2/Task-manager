import Image from 'next/image';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side: Form Content */}
      <div className="flex w-full flex-col lg:w-1/2 p-8 md:p-12 lg:p-20">
        {/* Logo */}
        <div className="mb-12 ml-18">
          <Image 
            src="/logo.jpg" 
            alt="Infinite Corporate Logo" 
            width={100} 
            height={40} 
            className="object-contain"
          />
        </div>

        {/* Center the form content */}
        <div className="mx-auto w-full max-w-md">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold text-black text-center">Sign Up</h1>
            <p className="mt-2 text-sm text-gray-400 text-center" >Create an account</p>
          </div>

          <form className="space-y-5">
            {/* Username Field */}
            <div className="space-y-1">
              <input 
                type="text" 
                placeholder="Username"
                className="w-full rounded-xl border border-gray-400 p-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <input 
                type="email" 
                placeholder="Email"
                className="w-full rounded-xl border border-gray-400 p-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input 
                type="password" 
                placeholder="Password"
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-black focus:outline-none"
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {/* Eye Icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <input 
                type="password" 
                placeholder="Confirm Password"
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button className="w-full rounded-xl bg-black py-4 font-bold text-white transition hover:bg-zinc-800">
              Sign up
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account? <Link href="/login" className="font-bold text-blue-600 hover:underline underline-offset-4">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right side: Artwork */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12">
        <div className="relative h-full w-full max-w-2xl">
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
  );
}