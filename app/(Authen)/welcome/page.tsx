"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { createClient } from '@/src/utils/supabase/client';
import Image from 'next/image';

export default function WelcomePage() {
    const router = useRouter();
    const supabase = createClient();
    const [profile, setProfile] = useState<any>(null);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        // 1. Fetch profile
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('full_name, role')
                    .eq('id', user.id)
                    .single();
                setProfile(data);
            } else {
                router.push('/login');
            }
        };

        fetchProfile();

        // 2. Fire Confetti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        // 3. Auto-redirect logic
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timer);
        };
    }, [router, supabase]);

    useEffect(() => {
        if (countdown === 0 && profile) {
            const path = profile.role === 'admin' ? '/admin/admin-tasks' : '/user/user-dashboard';
            router.push(path);
        }
    }, [countdown, profile, router]);

    return (
        <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 overflow-hidden">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center z-10"
            >
                <div className="mb-12 flex justify-center">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={120}
                        height={50}
                        className="object-contain"
                    />
                </div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-6xl md:text-8xl font-black text-black tracking-tighter italic uppercase mb-4"
                >
                    Welcome!
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-xl md:text-2xl font-bold text-gray-500 mb-12"
                >
                    Glad to have you here, <span className="text-black">{profile?.full_name || 'Friend'}</span>.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1 bg-black rounded-full overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 3, ease: "linear" }}
                                className="h-full bg-blue-500 w-full"
                            />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Opening your workspace in {countdown}s...
                        </span>
                    </div>

                    <button
                        onClick={() => {
                            const path = profile?.role === 'admin' ? '/admin/admin-tasks' : '/user/user-dashboard';
                            router.push(path);
                        }}
                        className="px-8 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200"
                    >
                        Go to Dashboard Now
                    </button>
                </motion.div>
            </motion.div>

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-24 -left-24 w-96 h-96 border-[1px] border-gray-100 rounded-[4rem]"
                />
                <motion.div
                    animate={{
                        rotate: -360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-48 -right-24 w-[30rem] h-[30rem] border-[1px] border-gray-100 rounded-full"
                />
            </div>
        </div>
    );
}
