'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking a link
    const handleLinkClick = () => {
        setMobileMenuOpen(false);
    };

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <Link href="/" className="logo">
                        <div className="logo-icon">
                            <svg viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" strokeWidth="3" />
                                <path d="M12 20L18 26L28 14" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                <defs>
                                    <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                                        <stop offset="0%" stopColor="#00D9FF" />
                                        <stop offset="100%" stopColor="#7B61FF" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="logo-text">TradeFund<span className="logo-highlight">Pro</span></span>
                    </Link>

                    <div className="nav-links">
                        <Link href="#home" className="nav-link active">Home</Link>
                        <Link href="#challenges" className="nav-link">Challenges</Link>
                        <Link href="#how-it-works" className="nav-link">How It Works</Link>
                        <Link href="#payouts" className="nav-link">Payouts</Link>
                        <Link href="#faq" className="nav-link">FAQ</Link>
                    </div>

                    <div className="nav-actions">
                        {user ? (
                            <>
                                <Link
                                    href={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    className="btn btn-ghost"
                                >
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="btn btn-outline">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" className="btn btn-ghost">Sign In</Link>
                                <Link href="/auth/signup" className="btn btn-primary">Get Funded</Link>
                            </>
                        )}
                    </div>

                    <button
                        className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
                <Link href="#home" className="nav-link" onClick={handleLinkClick}>Home</Link>
                <Link href="#challenges" className="nav-link" onClick={handleLinkClick}>Challenges</Link>
                <Link href="#how-it-works" className="nav-link" onClick={handleLinkClick}>How It Works</Link>
                <Link href="#payouts" className="nav-link" onClick={handleLinkClick}>Payouts</Link>
                <Link href="#faq" className="nav-link" onClick={handleLinkClick}>FAQ</Link>

                <div className="nav-actions">
                    {user ? (
                        <>
                            <Link
                                href={user.role === 'admin' ? '/admin' : '/dashboard'}
                                className="btn btn-outline"
                                onClick={handleLinkClick}
                            >
                                Dashboard
                            </Link>
                            <button onClick={() => { logout(); handleLinkClick(); }} className="btn btn-primary">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="btn btn-outline" onClick={handleLinkClick}>Sign In</Link>
                            <Link href="/auth/signup" className="btn btn-primary" onClick={handleLinkClick}>Get Funded</Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
