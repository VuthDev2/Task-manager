"use client";
import React from 'react';

export default function Logo() {
  return (
    <div className="p-1">
      <div className="flex flex-col items-center">
        {/* Logo matching your UserDashboard code */}
        <div className="mb-6">
          <img 
            src="/logo.svg" 
            alt="Infinite Corporate" 
            className="h-30 w-auto" 
          />
        </div>
      </div>
    </div>
  );
}