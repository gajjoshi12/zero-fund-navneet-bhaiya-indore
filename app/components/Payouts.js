'use client';

import { useState, useEffect } from 'react';

export default function Payouts() {
    const [payoutsList, setPayoutsList] = useState([
        { initials: 'RS', name: 'Rohit S.', location: '🇮🇳 Mumbai', amount: '+₹7,35,000' },
        { initials: 'PK', name: 'Priya K.', location: '🇮🇳 Delhi', amount: '+₹12,75,000' },
        { initials: 'AM', name: 'Amit M.', location: '🇮🇳 Bangalore', amount: '+₹18,90,000' },
        { initials: 'VR', name: 'Vikram R.', location: '🇮🇳 Chennai', amount: '+₹5,29,000' },
        { initials: 'NS', name: 'Neha S.', location: '🇮🇳 Pune', amount: '+₹9,91,000' },
    ]);

    const allPayouts = [
        { initials: 'RS', name: 'Rohit S.', location: '🇮🇳 Mumbai', amount: '+₹7,35,000' },
        { initials: 'PK', name: 'Priya K.', location: '🇮🇳 Delhi', amount: '+₹12,75,000' },
        { initials: 'AM', name: 'Amit M.', location: '🇮🇳 Bangalore', amount: '+₹18,90,000' },
        { initials: 'VR', name: 'Vikram R.', location: '🇮🇳 Chennai', amount: '+₹5,29,000' },
        { initials: 'NS', name: 'Neha S.', location: '🇮🇳 Pune', amount: '+₹9,91,000' },
        { initials: 'SK', name: 'Sanjay K.', location: '🇮🇳 Hyderabad', amount: '+₹7,89,000' },
        { initials: 'AD', name: 'Anjali D.', location: '🇮🇳 Kolkata', amount: '+₹15,32,000' },
        { initials: 'RP', name: 'Rajesh P.', location: '🇮🇳 Ahmedabad', amount: '+₹6,38,000' },
        { initials: 'MS', name: 'Meera S.', location: '🇮🇳 Jaipur', amount: '+₹11,84,000' },
        { initials: 'VK', name: 'Vishal K.', location: '🇮🇳 Lucknow', amount: '+₹16,65,000' },
    ];

    useEffect(() => {
        let currentIndex = 5;

        const interval = setInterval(() => {
            const newPayout = allPayouts[currentIndex % allPayouts.length];

            setPayoutsList(prev => {
                const newList = [newPayout, ...prev.slice(0, 4)];
                return newList;
            });

            currentIndex++;
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section id="payouts" className="payouts">
            <div className="container">
                <div className="payouts-content">
                    <div className="payouts-info animate-on-scroll">
                        <span className="section-badge">Real Payouts</span>
                        <h2 className="section-title">Over <span className="gradient-text">₹400 Crore</span> Paid to Traders</h2>
                        <p className="section-subtitle">Join thousands of traders who have already received their payouts. Fast, reliable, and hassle-free withdrawals.</p>

                        <div className="payout-stats">
                            <div className="payout-stat">
                                <span className="payout-stat-number">₹400Cr+</span>
                                <span className="payout-stat-label">Total Paid Out</span>
                            </div>
                            <div className="payout-stat">
                                <span className="payout-stat-number">24-48h</span>
                                <span className="payout-stat-label">Average Payout Time</span>
                            </div>
                            <div className="payout-stat">
                                <span className="payout-stat-number">50K+</span>
                                <span className="payout-stat-label">Successful Payouts</span>
                            </div>
                        </div>
                    </div>

                    <div className="payouts-feed animate-on-scroll" style={{ '--delay': '0.2s' }}>
                        <div className="feed-header">
                            <span className="live-dot"></span>
                            <span>Live Payouts</span>
                        </div>
                        <div className="feed-list">
                            {payoutsList.map((payout, index) => (
                                <div key={`${payout.initials}-${index}`} className="feed-item">
                                    <div className="feed-avatar">{payout.initials}</div>
                                    <div className="feed-info">
                                        <span className="feed-name">{payout.name}</span>
                                        <span className="feed-location">{payout.location}</span>
                                    </div>
                                    <span className="feed-amount">{payout.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
