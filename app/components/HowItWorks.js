'use client';

export default function HowItWorks() {
    const steps = [
        {
            number: '01',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            title: 'Choose Your Challenge',
            desc: 'Select an account size that fits your trading style. From $10K to $200K, we have options for every trader.'
        },
        {
            number: '02',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                </svg>
            ),
            title: 'Pass The Evaluation',
            desc: 'Trade and hit the profit target while respecting the drawdown rules. Show us you have what it takes.'
        },
        {
            number: '03',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            title: 'Get Funded & Earn',
            desc: 'Receive your funded account and start trading. Keep up to 90% of all the profits you generate.'
        }
    ];

    return (
        <section id="how-it-works" className="how-it-works">
            <div className="container">
                <div className="section-header animate-on-scroll">
                    <span className="section-badge">Simple Process</span>
                    <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
                    <p className="section-subtitle">Get funded in three simple steps. Prove your skills and start earning.</p>
                </div>

                <div className="steps-container">
                    {steps.map((step, index) => (
                        <>
                            <div
                                key={`step-${index}`}
                                className="step-card animate-on-scroll"
                                style={{ '--delay': `${index * 0.2}s` }}
                            >
                                <div className="step-number">{step.number}</div>
                                <div className="step-icon">
                                    {step.icon}
                                </div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-desc">{step.desc}</p>
                            </div>

                            {index < steps.length - 1 && (
                                <div key={`connector-${index}`} className="step-connector">
                                    <svg viewBox="0 0 100 20">
                                        <path d="M0 10 H90 L85 5 M90 10 L85 15" stroke="url(#connectorGrad)" strokeWidth="2" fill="none" />
                                        <defs>
                                            <linearGradient id="connectorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#00D9FF" />
                                                <stop offset="100%" stopColor="#7B61FF" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            )}
                        </>
                    ))}
                </div>
            </div>
        </section>
    );
}
