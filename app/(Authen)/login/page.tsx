import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side: Content Area */}
      <div className="flex w-full flex-col lg:w-1/2 p-8 md:p-12 lg:p-20">
        {/* Logo at the very top */}
        <div className="mb-16 ml-18">
          <Image 
            src="/logo.jpg" 
            alt="Infinite Corporate Logo" 
            width={100} 
            height={40} 
            className="object-contain"
          />
        </div>

        {/* Form Container: Max-width keeps it centered and readable */}
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-4xl font-bold text-black">Welcome Back!</h1>
          <p className="mt-2 text-sm text-gray-500">Please enter login details below</p>

          <form className="mt-10 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input 
                type="email" 
                placeholder="Enter the email address"
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Enter the Password"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-black focus:outline-none"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {/* Eye Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
              <div className="text-right">
                <Link href="/forgot-password" className="text-xs font-bold text-black hover:underline">Forgot Password?</Link>
              </div>
            </div>

            {/* Sign In Button */}
            <button className="w-full rounded-xl bg-black py-4 font-bold text-white transition hover:bg-zinc-800">
              Sign in
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-xs text-gray-400">Or continue with</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            {/* Google Login */}
            <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 py-3 transition hover:bg-gray-50">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
              <span className="text-sm font-semibold">Login with Google</span>
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account? <Link href="/signup" className="font-bold text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>

      {/* Right side: Illustration Image */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12">
        <div className="relative h-full w-full max-w-2xl">
          <Image 
            src="/artwork.jpg" 
            alt="Login Illustration"
            fill
            className="object-contain"
            priority 
          />
        </div>
      </div>
    </div>
  );
}