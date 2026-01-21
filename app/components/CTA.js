'use client';

import Link from 'next/link';

export default function CTA() {
    return (
        <section className="cta">
            <div className="container">
                <div className="cta-content glass-card animate-on-scroll">
                    <h2 className="cta-title">Ready to Start Your <span className="gradient-text">Trading Journey</span>?</h2>
                    <p className="cta-subtitle">Join over 500,000 traders who have already taken the first step towards financial freedom.</p>
                    <div className="cta-buttons">
                        <Link href="#challenges" className="btn btn-gradient btn-lg">
                            <span>Get Funded Now</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link href="#" className="btn btn-outline btn-lg">Contact Support</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
