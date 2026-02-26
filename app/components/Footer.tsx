"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Github } from 'lucide-react';

export default function Footer() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Description */}
          <motion.div {...fadeInUp} className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <Image src="/logo.jpg" alt="Infinite" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">INFINITE</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              The modern task manager for teams who want to deliver great work without burnout.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/features" className="text-sm text-gray-600 hover:text-black transition">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-600 hover:text-black transition">Pricing</Link></li>
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-black transition">About</Link></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-black transition">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-black transition">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-black transition">Terms</Link></li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ delay: 0.3 }}
  className="flex flex-col items-center pt-12 mt-12 border-t border-gray-100"
>
  <p className="text-xs text-gray-400 text-center">
    © 2026 Infinite. All rights reserved.
  </p>
  <div className="flex gap-6 mt-4">
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition">
      <Linkedin size={18} />
    </a>
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition">
      <Twitter size={18} />
    </a>
    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition">
      <Github size={18} />
    </a>
  </div>
</motion.div>
      </div>
    </footer>
  );
}