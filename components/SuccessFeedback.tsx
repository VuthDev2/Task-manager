"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export default function SuccessFeedback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const verified = searchParams.get('verified');

        if (verified === 'true') {
            // 1. Fire Confetti Burst
            const duration = 3 * 1000;
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

            // 2. Show Premium Toast
            toast.success('Welcome aboard! 👋', {
                description: 'Your email has been verified. Your workspace is ready.',
                duration: 5000,
            });

            // 3. Clean up URL (remove the verified param)
            const params = new URLSearchParams(searchParams.toString());
            params.delete('verified');
            const newPath = params.toString() ? `${pathname}?${params.toString()}` : pathname;
            router.replace(newPath);
        }
    }, [searchParams, router, pathname]);

    return null;
}
