'use client';

import { useState, useEffect } from 'react';

export default function Payouts() {
    const [payoutsList, setPayoutsList] = useState([
        { initials: 'JM', name: 'John M.', location: '🇺🇸 USA', amount: '+$8,750' },
        { initials: 'SK', name: 'Sarah K.', location: '🇬🇧 UK', amount: '+$15,200' },
        { initials: 'AM', name: 'Alex M.', location: '🇨🇦 Canada', amount: '+$22,500' },
        { initials: 'MR', name: 'Michael R.', location: '🇦🇺 Australia', amount: '+$6,300' },
        { initials: 'LS', name: 'Lisa S.', location: '🇩🇪 Germany', amount: '+$11,800' },
    ]);

    const allPayouts = [
        { initials: 'JM', name: 'John M.', location: '🇺🇸 USA', amount: '+$8,750' },
        { initials: 'SK', name: 'Sarah K.', location: '🇬🇧 UK', amount: '+$15,200' },
        { initials: 'AM', name: 'Alex M.', location: '🇨🇦 Canada', amount: '+$22,500' },
        { initials: 'MR', name: 'Michael R.', location: '🇦🇺 Australia', amount: '+$6,300' },
        { initials: 'LS', name: 'Lisa S.', location: '🇩🇪 Germany', amount: '+$11,800' },
        { initials: 'DK', name: 'David K.', location: '🇳🇱 Netherlands', amount: '+$9,400' },
        { initials: 'ED', name: 'Emma D.', location: '🇫🇷 France', amount: '+$18,200' },
        { initials: 'RP', name: 'Robert P.', location: '🇸🇬 Singapore', amount: '+$7,600' },
        { initials: 'MS', name: 'Maria S.', location: '🇪🇸 Spain', amount: '+$14,100' },
        { initials: 'TK', name: 'Thomas K.', location: '🇨🇭 Switzerland', amount: '+$19,800' },
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
                        <h2 className="section-title">Over <span className="gradient-text">$50 Million</span> Paid to Traders</h2>
                        <p className="section-subtitle">Join thousands of traders who have already received their payouts. Fast, reliable, and hassle-free withdrawals.</p>

                        <div className="payout-stats">
                            <div className="payout-stat">
                                <span className="payout-stat-number">$50M+</span>
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
