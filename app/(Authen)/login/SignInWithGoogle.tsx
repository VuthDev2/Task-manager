"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/app/lib/auth-actions";

const SignInWithGoogleButton = () => {
  return (
    <Button
      type="button"
      variant="outline"
      /* Custom styles to match your high-fidelity design */
      className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-6 transition hover:bg-gray-50 active:scale-[0.98] shadow-sm cursor-pointer"
      onClick={() => {
        signInWithGoogle();
      }}
    >
      <img 
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
        alt="Google Logo" 
        className="h-5 w-5" 
      />
      <span className="text-sm font-black text-gray-700">Login with Google</span>
    </Button>
  );
};

export default SignInWithGoogleButton;