'use client';

import Link from 'next/link';

export default function Hero() {
    return (
        <section id="home" className="hero">
            <div className="hero-content">
                <div className="hero-badge animate-fade-in">
                    <span className="badge-icon">🚀</span>
                    <span>Over ₹400 Crore+ Paid to Traders</span>
                </div>

                <h1 className="hero-title animate-fade-in-up">
                    Your Skill is<br />
                    <span className="gradient-text">Our Capital</span>
                </h1>

                <p className="hero-subtitle animate-fade-in-up delay-1">
                    Join over <strong>500,000+ traders</strong> worldwide. Complete our evaluation challenges,
                    prove your trading skills, and get funded up to <strong>₹4,00,00,000</strong> in trading capital.
                </p>

                <div className="hero-cta animate-fade-in-up delay-2">
                    <Link href="#challenges" className="btn btn-primary btn-lg">
                        <span>Start Your Challenge</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                    <Link href="#how-it-works" className="btn btn-outline btn-lg">Learn More</Link>
                </div>

                <div className="hero-stats animate-fade-in-up delay-3">
                    <div className="stat-item">
                        <span className="stat-number">500K+</span>
                        <span className="stat-label">Active Traders</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">₹400Cr+</span>
                        <span className="stat-label">Total Payouts</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">195+</span>
                        <span className="stat-label">Countries</span>
                    </div>
                </div>
            </div>

            <div className="hero-visual">
                <div className="hero-card glass-card animate-float">
                    <div className="card-header">
                        <span className="card-badge success">FUNDED</span>
                        <span className="card-date">Today</span>
                    </div>
                    <div className="card-body">
                        <div className="trader-info">
                            <div className="trader-avatar">RS</div>
                            <div>
                                <div className="trader-name">Rahul S.</div>
                                <div className="trader-location">🇮🇳 India</div>
                            </div>
                        </div>
                        <div className="payout-amount">+₹10,50,000</div>
                        <div className="payout-label">Profit Payout</div>
                    </div>
                </div>

                <div className="hero-card glass-card animate-float delay-1" style={{ '--floatDelay': '0.5s' }}>
                    <div className="card-header">
                        <span className="card-badge warning">CHALLENGE PASSED</span>
                    </div>
                    <div className="card-body">
                        <div className="progress-ring">
                            <svg viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00D9FF" />
                                        <stop offset="100%" stopColor="#7B61FF" />
                                    </linearGradient>
                                </defs>
                                <circle cx="50" cy="50" r="45" className="progress-bg" />
                                <circle cx="50" cy="50" r="45" className="progress-fill" style={{ '--progress': 100 }} />
                            </svg>
                            <span className="progress-text">100%</span>
                        </div>
                        <div className="challenge-info">
                            <div className="challenge-title">Phase 2 Complete</div>
                            <div className="challenge-subtitle">₹80 Lakh Account Unlocked</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
