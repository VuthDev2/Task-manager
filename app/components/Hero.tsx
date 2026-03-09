"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight, X } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';

import Navbar from './Navbar';

export default function Hero() {
  const { scrollY } = useScroll();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Smooth scroll function (if you keep scroll‑to links)
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && videoRef.current) {
      const playVideo = () => {
        videoRef.current?.play().catch(err => console.warn("Autoplay blocked", err));
      };
      playVideo();
      window.addEventListener('load', playVideo);
      return () => window.removeEventListener('load', playVideo);
    }
  }, [mounted]);

  // Scroll transforms (unchanged)
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const orbOpacity = useTransform(scrollY, [0, 300], [1, 0.9]);

  return (
    <section className="relative bg-black min-h-screen overflow-hidden">
      {/* Background video (unchanged) */}
      <div className="absolute inset-0 w-full h-full z-0">
        {mounted && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute w-full h-full object-cover"
            poster="/poster.jpg"
          >
            <source src="./background.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-black/50 z-10" />
      </div>

      {/* Animated orbs (unchanged) */}
      <motion.div style={{ y: y1, opacity: orbOpacity }} className="absolute top-20 -left-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl" />
      <motion.div style={{ y: y2 }} className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />

      {/* Navigation */}
      <Navbar />


      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.2 } } }}
            className="text-left text-white"
          >
            <motion.div variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium backdrop-blur-sm mb-8"
            >
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>
              NEW: AI PRODUCTIVITY DASHBOARD
            </motion.div>

            <motion.h1 variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]"
            >
              Manage Your{' '}
              <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm rotate-2 hover:rotate-0 transition-transform">
                <span className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white/50" />
                <span className="w-10 h-10 rounded-full bg-rose-500 border-2 border-white/50" />
                <span className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold border-2 border-white/50">2+</span>
              </span>{' '}
              Team's{' '}
              <span className="relative text-indigo-300 italic font-serif">
                Productivity
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none"><path d="M5 15C50 5 150 5 295 15" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="opacity-30" /></svg>
              </span>
            </motion.h1>

            <motion.p variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="text-lg text-white/70 mt-6 max-w-lg"
            >
              Plan projects, stay on track, and deliver on time without overworking your team.
            </motion.p>

            <motion.div variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-black px-8 py-4 rounded-full font-medium flex items-center gap-2 shadow-2xl hover:bg-gray-100 transition-colors">
                <div className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center"><Play size={10} fill="black" /></div>
                <Link href="/signup">Get Started Free</Link>
              </motion.button>

              {/* View Demo button opens modal */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDemoModalOpen(true)}
                className="px-8 py-4 rounded-full font-medium text-white border border-white/30 hover:bg-white/10 transition-all flex items-center gap-1"
              >
                View Demo <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right column floating card (unchanged) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
                <div>
                  <p className="text-white font-bold">Productivity Boost</p>
                  <p className="text-white/60 text-sm">89% faster completion</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full w-3/4 bg-white rounded-full" /></div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full w-1/2 bg-white rounded-full" /></div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full w-5/6 bg-white rounded-full" /></div>
              </div>
              <p className="text-white/50 text-xs mt-6">Real-time analytics</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {demoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setDemoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setDemoModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src="/demo.mp4" // Replace with your demo video ID
                  title="Demo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}