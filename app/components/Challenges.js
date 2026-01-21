'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Challenges() {
    const [activeTab, setActiveTab] = useState('1-step');

    const pricingPlans = [
        {
            accountSize: '₹8,00,000',
            price: '7,499',
            features: ['8% Profit Target', '5% Max Daily Drawdown', '10% Max Total Drawdown', 'No Time Limit', '80% Profit Split'],
            popular: false
        },
        {
            accountSize: '₹20,00,000',
            price: '16,999',
            features: ['8% Profit Target', '5% Max Daily Drawdown', '10% Max Total Drawdown', 'No Time Limit', '80% Profit Split'],
            popular: false
        },
        {
            accountSize: '₹40,00,000',
            price: '24,999',
            features: ['8% Profit Target', '5% Max Daily Drawdown', '10% Max Total Drawdown', 'No Time Limit', '85% Profit Split'],
            popular: true
        },
        {
            accountSize: '₹80,00,000',
            price: '41,999',
            features: ['8% Profit Target', '5% Max Daily Drawdown', '10% Max Total Drawdown', 'No Time Limit', '90% Profit Split'],
            popular: false
        },
        {
            accountSize: '₹1,60,00,000',
            price: '74,999',
            features: ['8% Profit Target', '5% Max Daily Drawdown', '10% Max Total Drawdown', 'No Time Limit', '90% Profit Split'],
            popular: false
        }
    ];

    return (
        <section id="challenges" className="challenges">
            <div className="container">
                <div className="section-header animate-on-scroll">
                    <span className="section-badge">Choose Your Path</span>
                    <h2 className="section-title">Evaluation <span className="gradient-text">Challenges</span></h2>
                    <p className="section-subtitle">Select your account size and prove your trading skills. Pass the evaluation and get funded.</p>
                </div>

                <div className="challenge-tabs">
                    <button
                        className={`tab-btn ${activeTab === '1-step' ? 'active' : ''}`}
                        onClick={() => setActiveTab('1-step')}
                    >
                        1 Step
                    </button>
                    <button
                        className={`tab-btn ${activeTab === '2-step' ? 'active' : ''}`}
                        onClick={() => setActiveTab('2-step')}
                    >
                        2 Step
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'instant' ? 'active' : ''}`}
                        onClick={() => setActiveTab('instant')}
                    >
                        Instant Funding
                    </button>
                </div>

                <div className="pricing-grid">
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={index}
                            className={`pricing-card glass-card animate-on-scroll ${plan.popular ? 'popular' : ''}`}
                            style={{ '--delay': `${index * 0.1}s` }}
                        >
                            {plan.popular && <div className="popular-badge">Most Popular</div>}
                            <div className="pricing-header">
                                <span className="account-size">{plan.accountSize}</span>
                                <span className="account-label">Account Size</span>
                            </div>
                            <div className="pricing-body">
                                <div className="price">
                                    <span className="price-currency">₹</span>
                                    <span className="price-amount">{plan.price}</span>
                                </div>
                                <ul className="pricing-features">
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex}>
                                            <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="#" className={`btn ${plan.popular ? 'btn-gradient' : 'btn-primary'} btn-block`}>
                                    Start Challenge
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
