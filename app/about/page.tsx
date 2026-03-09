"use client";
import Navbar from '../components/Navbar';

import Footer from '../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-32 pb-20 px-6">

        <div className="max-w-7xl mx-auto">
          {/* Hero section (unchanged) */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-6">
              About Infinite
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to help teams work smarter, not harder. Our platform combines intuitive design with powerful productivity features.
            </p>
          </div>

          {/* Stats (unchanged) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-4xl font-black text-indigo-600 mb-2">10k+</p>
              <p className="text-gray-600 font-medium">Active users</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-4xl font-black text-purple-600 mb-2">50k+</p>
              <p className="text-gray-600 font-medium">Tasks completed</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-4xl font-black text-blue-600 mb-2">4.9</p>
              <p className="text-gray-600 font-medium">User rating</p>
            </div>
          </div>

          {/* Team section with animated image */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Built by a passionate team</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We're a remote team of designers, developers, and productivity enthusiasts who believe that great software should make work feel lighter. Our goal is to give you back your time.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg"
              >
                Get Started Free
              </Link>
            </div>

            {/* Animated image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}

              className="relative h-80 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl overflow-hidden"
            >
              <Image
                src="/team.png" // Replace with your image path
                alt="Team collaborating on a project"
                fill
                className="object-cover"
                sizes="(max-width: 568px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}