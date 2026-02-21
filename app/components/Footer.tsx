"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, easeOut } from 'framer-motion';
import { Linkedin, Facebook, Twitter, Send } from 'lucide-react';

export default function Footer() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: easeOut },
  };

  return (
    <footer className="bg-gradient-to-b from-white to-indigo-50/30 pt-32 pb-16 border-t border-gray-100 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div {...fadeInUp} className="text-center mb-24 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-8">
            Manage your teams <br /> like never before.
          </h2>
          <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10">
            Plan projects, stay on track, and deliver on time without overworking your team. Join the future of productivity.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/signup"
              className="inline-block bg-black text-white px-10 py-5 rounded-full font-medium shadow-2xl hover:bg-gray-800 transition-all"
            >
              Get Started Free
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Branding */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <Image src="/logo.jpg" alt="Infinite" fill className="object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">INFINITE</span>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
              The only task management platform that balances team bandwidth with high-impact project delivery.
            </p>
            <div className="flex gap-4">
              {[Linkedin, Facebook, Twitter].map((Icon, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.1, backgroundColor: '#000', color: '#fff' }}
                  className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer transition-all shadow-sm"
                >
                  <Icon size={18} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-3">
            <h4 className="font-black text-xs text-gray-900 uppercase tracking-[0.2em] mb-8">Platform</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              {['Pricing Plans', 'App Integrations', 'Desktop Download', 'Product Roadmap'].map((item) => (
                <li key={item} className="hover:text-black transition-colors cursor-pointer">
                  {item}
                </li>
              ))}
              <li className="flex items-center gap-2">
                Enterprise
                <span className="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Soon</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="lg:col-span-5">
            <h4 className="font-black text-xs text-gray-900 uppercase tracking-[0.2em] mb-8">Stay Updated</h4>
            <div className="bg-white/70 backdrop-blur-sm p-2 rounded-2xl border border-gray-200 focus-within:border-black transition-all flex shadow-lg">
              <input
                type="email"
                placeholder="Work email address"
                className="bg-transparent flex-1 px-4 outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-black text-white p-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center"
              >
                <Send size={18} />
              </motion.button>
            </div>
            <p className="mt-4 text-xs text-gray-400 font-medium">
              Join 2,000+ teams receiving monthly productivity insights.
            </p>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="flex items-center gap-8">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
              © 2026 INFINITE · CORPORATE
            </p>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-[11px] font-black text-gray-400 hover:text-black uppercase tracking-[0.2em]">Privacy</Link>
              <Link href="#" className="text-[11px] font-black text-gray-400 hover:text-black uppercase tracking-[0.2em]">Terms</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">Log In</Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signup"
                className="bg-white text-black border-2 border-black px-8 py-2.5 rounded-full text-xs font-black hover:bg-black hover:text-white transition-all shadow-lg"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}