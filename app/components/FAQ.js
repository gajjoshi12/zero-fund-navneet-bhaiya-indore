'use client';

import { useState } from 'react';

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: 'How does the evaluation process work?',
            answer: 'Our evaluation process consists of one or two phases depending on your chosen challenge. In each phase, you need to reach the profit target while staying within the drawdown limits. Once you pass, you receive a funded account and can start earning real profits.'
        },
        {
            question: 'What is the profit split?',
            answer: 'Our profit split ranges from 80% to 90% depending on your account size. The larger your account, the higher your profit split. This means you keep the majority of all profits you generate.'
        },
        {
            question: 'How long does it take to receive payouts?',
            answer: 'We process payouts within 24-48 hours of your request. You can request payouts weekly, bi-weekly, monthly, or on-demand. We support various payment methods including bank transfer, UPI, and more.'
        },
        {
            question: 'What trading platforms are supported?',
            answer: 'We support MetaTrader 4, MetaTrader 5, cTrader, and our proprietary trading platform. You can choose your preferred platform during the account setup process.'
        },
        {
            question: 'Is there a time limit to pass the challenge?',
            answer: 'No, there is no time limit! Take as much time as you need to reach the profit target. We believe in quality trading, not rushing decisions.'
        }
    ];

    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="faq">
            <div className="container">
                <div className="section-header animate-on-scroll">
                    <span className="section-badge">Got Questions?</span>
                    <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item glass-card animate-on-scroll ${activeIndex === index ? 'active' : ''}`}
                            style={{ '--delay': `${index * 0.1}s` }}
                        >
                            <button className="faq-question" onClick={() => toggleFaq(index)}>
                                <span>{faq.question}</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
