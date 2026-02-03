'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Challenges() {
    const [activeTab, setActiveTab] = useState('1-step');
    const [activeSize, setActiveSize] = useState(2); // Default to the "Most Popular" plan

    const accountSizes = [
        { label: '₹8L', value: '₹8,00,000' },
        { label: '₹20L', value: '₹20,00,000' },
        { label: '₹40L', value: '₹40,00,000' },
        { label: '₹80L', value: '₹80,00,000' },
        { label: '₹1.6Cr', value: '₹1,60,00,000' }
    ];

    const pricingPlans = {
        '1-step': [
            { price: '7,499', profitTarget: '8%', dailyDrawdown: '5%', totalDrawdown: '10%', minDays: '5', timeLimit: 'Unlimited', profitSplit: '80%', popular: false },
            { price: '16,999', profitTarget: '8%', dailyDrawdown: '5%', totalDrawdown: '10%', minDays: '5', timeLimit: 'Unlimited', profitSplit: '80%', popular: false },
            { price: '24,999', profitTarget: '8%', dailyDrawdown: '5%', totalDrawdown: '10%', minDays: '5', timeLimit: 'Unlimited', profitSplit: '85%', popular: true },
            { price: '41,999', profitTarget: '8%', dailyDrawdown: '5%', totalDrawdown: '10%', minDays: '5', timeLimit: 'Unlimited', profitSplit: '90%', popular: false },
            { price: '74,999', profitTarget: '8%', dailyDrawdown: '5%', totalDrawdown: '10%', minDays: '5', timeLimit: 'Unlimited', profitSplit: '90%', popular: false }
        ],
        '2-step': [
            { price: '5,999', profitTarget: '10% / 5%', dailyDrawdown: '5%', totalDrawdown: '10%', minDays: '5', timeLimit: 'Unlimited', profitSplit: '80%', popular: false },
            { price: '13,499', profitTarget: '10% / 5%', dailyDrawdown: '5%', totalDrawdown: '10%', minDays: '5', timeLimit: 'Unlimited', profitSplit: '80%', popular: false },
            { price: '19,999', profitTarget: '10% / 5%', dailyDrawdown: '5%', totalDrawdown: '10%', minDays: '5', timeLimit: 'Unlimited', profitSplit: '85%', popular: true },
            { price: '34,999', profitTarget: '10% / 5%', dailyDrawdown: '5%', totalDrawdown: '10%', minDays: '5', timeLimit: 'Unlimited', profitSplit: '90%', popular: false },
            { price: '64,999', profitTarget: '10% / 5%', dailyDrawdown: '5%', totalDrawdown: '10%', minDays: '5', timeLimit: 'Unlimited', profitSplit: '90%', popular: false }
        ],
        'instant': [
            { price: '14,999', profitTarget: 'None', dailyDrawdown: '4%', totalDrawdown: '8%', minDays: '0', timeLimit: 'Unlimited', profitSplit: '60%', popular: false },
            { price: '32,999', profitTarget: 'None', dailyDrawdown: '4%', totalDrawdown: '8%', minDays: '0', timeLimit: 'Unlimited', profitSplit: '60%', popular: false },
            { price: '49,999', profitTarget: 'None', dailyDrawdown: '4%', totalDrawdown: '8%', minDays: '0', timeLimit: 'Unlimited', profitSplit: '70%', popular: true },
            { price: '84,999', profitTarget: 'None', dailyDrawdown: '4%', totalDrawdown: '8%', minDays: '0', timeLimit: 'Unlimited', profitSplit: '75%', popular: false },
            { price: '1,49,999', profitTarget: 'None', dailyDrawdown: '4%', totalDrawdown: '8%', minDays: '0', timeLimit: 'Unlimited', profitSplit: '80%', popular: false }
        ]
    };

    const currentPlan = pricingPlans[activeTab][activeSize];

    const features = [
        { label: 'Profit Target', value: currentPlan.profitTarget, icon: '🎯' },
        { label: 'Daily Drawdown', value: currentPlan.dailyDrawdown, icon: '📉' },
        { label: 'Max Drawdown', value: currentPlan.totalDrawdown, icon: '⚠️' },
        { label: 'Min Trading Days', value: currentPlan.minDays, icon: '📅' },
        { label: 'Time Limit', value: currentPlan.timeLimit, icon: '⏱️' },
        { label: 'Profit Split', value: currentPlan.profitSplit, icon: '💰', highlight: true }
    ];

    return (
        <section id="challenges" className="fn-challenges">
            <div className="container">
                <div className="section-header animate-on-scroll">
                    <span className="section-badge">Choose Your Path</span>
                    <h2 className="section-title">Choose the <span className="gradient-text">Best Plan</span></h2>
                    <p className="section-subtitle">Select your preferred challenge type and account size to start your funded trading journey.</p>
                </div>

                {/* Challenge Type Tabs */}
                <div className="fn-plan-tabs">
                    <button
                        className={`fn-tab-btn ${activeTab === '1-step' ? 'active' : ''}`}
                        onClick={() => setActiveTab('1-step')}
                    >
                        <span className="fn-tab-icon">⚡</span>
                        <span className="fn-tab-text">
                            <span className="fn-tab-title">1 Step</span>
                            <span className="fn-tab-desc">Quick evaluation</span>
                        </span>
                    </button>
                    <button
                        className={`fn-tab-btn ${activeTab === '2-step' ? 'active' : ''}`}
                        onClick={() => setActiveTab('2-step')}
                    >
                        <span className="fn-tab-icon">🚀</span>
                        <span className="fn-tab-text">
                            <span className="fn-tab-title">2 Step</span>
                            <span className="fn-tab-desc">Traditional path</span>
                        </span>
                    </button>
                    <button
                        className={`fn-tab-btn ${activeTab === 'instant' ? 'active' : ''}`}
                        onClick={() => setActiveTab('instant')}
                    >
                        <span className="fn-tab-icon">💎</span>
                        <span className="fn-tab-text">
                            <span className="fn-tab-title">Instant</span>
                            <span className="fn-tab-desc">Skip evaluation</span>
                        </span>
                    </button>
                </div>

                {/* Account Size Selector */}
                <div className="fn-size-selector">
                    <span className="fn-size-label">Select Account Size</span>
                    <div className="fn-size-options">
                        {accountSizes.map((size, index) => (
                            <button
                                key={index}
                                className={`fn-size-btn ${activeSize === index ? 'active' : ''} ${pricingPlans[activeTab][index].popular ? 'popular' : ''}`}
                                onClick={() => setActiveSize(index)}
                            >
                                {size.label}
                                {pricingPlans[activeTab][index].popular && <span className="fn-popular-dot"></span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Pricing Card */}
                <div className="fn-pricing-showcase">
                    <div className="fn-main-card glass-card animate-on-scroll">
                        {currentPlan.popular && <div className="fn-popular-ribbon">Most Popular</div>}

                        <div className="fn-card-header">
                            <div className="fn-account-info">
                                <span className="fn-account-label">Account Size</span>
                                <span className="fn-account-value">{accountSizes[activeSize].value}</span>
                            </div>
                            <div className="fn-price-info">
                                <span className="fn-price-label">One-time Fee</span>
                                <div className="fn-price-value">
                                    <span className="fn-currency">₹</span>
                                    <span className="fn-amount">{currentPlan.price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="fn-features-grid">
                            {features.map((feature, index) => (
                                <div key={index} className={`fn-feature-item ${feature.highlight ? 'highlight' : ''}`}>
                                    <span className="fn-feature-icon">{feature.icon}</span>
                                    <div className="fn-feature-content">
                                        <span className="fn-feature-label">{feature.label}</span>
                                        <span className="fn-feature-value">{feature.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="fn-card-footer">
                            <Link href={`/dashboard/purchase?size=${encodeURIComponent(accountSizes[activeSize].value)}&price=${currentPlan.price}&type=${activeTab}&split=${currentPlan.profitSplit}`} className="btn btn-gradient btn-lg btn-block">
                                <span>Get Funded Now</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <p className="fn-guarantee">🛡️ 100% Refundable on first payout</p>
                        </div>
                    </div>

                    {/* Quick Compare Cards */}
                    <div className="fn-compare-strip">
                        {accountSizes.map((size, index) => (
                            <div
                                key={index}
                                className={`fn-compare-card ${activeSize === index ? 'active' : ''} ${pricingPlans[activeTab][index].popular ? 'popular' : ''}`}
                                onClick={() => setActiveSize(index)}
                            >
                                {pricingPlans[activeTab][index].popular && <span className="fn-mini-badge">Popular</span>}
                                <span className="fn-compare-size">{size.label}</span>
                                <span className="fn-compare-price">₹{pricingPlans[activeTab][index].price}</span>
                                <span className="fn-compare-split">{pricingPlans[activeTab][index].profitSplit} Split</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Benefits Strip */}
                <div className="fn-benefits-strip">
                    <div className="fn-benefit-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span>Secure Payments</span>
                    </div>
                    <div className="fn-benefit-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                        <span>24/7 Support</span>
                    </div>
                    <div className="fn-benefit-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <path d="M22 4L12 14.01l-3-3" />
                        </svg>
                        <span>Instant Activation</span>
                    </div>
                    <div className="fn-benefit-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>Money-back Guarantee</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
