'use client';

export default function Testimonials() {
    const testimonials = [
        {
            rating: 5,
            text: '"TradeFund Pro changed my trading career. The evaluation process was fair, and the payout was lightning fast. I received my $15,000 profit within 24 hours!"',
            author: {
                initials: 'JM',
                name: 'John M.',
                details: '$100K Funded Trader • 🇺🇸 New York'
            }
        },
        {
            rating: 5,
            text: '"The best prop firm I\'ve worked with. No hidden rules, transparent conditions, and excellent customer support. Already on my third payout!"',
            author: {
                initials: 'SM',
                name: 'Sarah M.',
                details: '$200K Funded Trader • 🇬🇧 London'
            }
        },
        {
            rating: 5,
            text: '"From skeptic to believer. I was hesitant at first, but after receiving my first $8,000 payout, I know this is the real deal. Highly recommend!"',
            author: {
                initials: 'RK',
                name: 'Robert K.',
                details: '$50K Funded Trader • 🇨🇦 Toronto'
            }
        }
    ];

    return (
        <section className="testimonials">
            <div className="container">
                <div className="section-header animate-on-scroll">
                    <span className="section-badge">Trader Stories</span>
                    <h2 className="section-title">What Our <span className="gradient-text">Traders</span> Say</h2>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="testimonial-card glass-card animate-on-scroll"
                            style={{ '--delay': `${index * 0.1}s` }}
                        >
                            <div className="testimonial-rating">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
                            </div>
                            <p className="testimonial-text">{testimonial.text}</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">{testimonial.author.initials}</div>
                                <div className="author-info">
                                    <span className="author-name">{testimonial.author.name}</span>
                                    <span className="author-details">{testimonial.author.details}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
