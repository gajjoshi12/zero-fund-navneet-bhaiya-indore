'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        // Start fade out after 2.2 seconds to give time for animations to play
        const timer1 = setTimeout(() => {
            setIsFadingOut(true);
        }, 2200);

        // Remove from DOM after transition (0.8s)
        const timer2 = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`splash-screen ${isFadingOut ? 'fade-out' : ''}`}>
            <div className="splash-content">
                <div className="splash-logo-container">
                    <img src="/favicon.ico" alt="Logo" className="splash-logo" />
                </div>
                <h1 className="splash-text">
                    <span className="splash-zero">Zero</span>
                    <span className="splash-fund">Fund</span>
                    <span className="splash-pro">Pro</span>
                </h1>
                <div className="splash-loader"></div>
            </div>

            {/* Background glowing orbs */}
            <div className="splash-bg-glow glow-1"></div>
            <div className="splash-bg-glow glow-2"></div>
        </div>
    );
}
