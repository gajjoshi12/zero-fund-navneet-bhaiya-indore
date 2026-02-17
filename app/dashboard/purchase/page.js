'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

function PurchaseContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get plan details from URL params
    const planSize = searchParams.get('size') || '$50,000';
    const planPrice = searchParams.get('price') || '24,999';
    const planType = searchParams.get('type') || '1-step';
    const profitSplit = searchParams.get('split') || '85%';

    const [currentStep, setCurrentStep] = useState(1);
    const [accountType, setAccountType] = useState('');
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [credentials, setCredentials] = useState(null);
    const [copied, setCopied] = useState('');
    const [showTCModal, setShowTCModal] = useState(true);
    const [tcAccepted, setTcAccepted] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            // Build the current URL with all params to redirect back after signup
            const currentParams = new URLSearchParams();
            if (planSize) currentParams.set('size', planSize);
            if (planPrice) currentParams.set('price', planPrice);
            if (planType) currentParams.set('type', planType);
            if (profitSplit) currentParams.set('split', profitSplit);

            const purchaseUrl = `/dashboard/purchase?${currentParams.toString()}`;
            router.push(`/auth/signup?redirect=${encodeURIComponent(purchaseUrl)}`);
        }
    }, [user, loading, router, planSize, planPrice, planType, profitSplit]);

    // Generate random credentials
    const generateCredentials = () => {
        const demoId = Math.floor(100000 + Math.random() * 900000).toString();
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return {
            server: accountType === 'mt5' ? 'TradeFundPro-MT5' : 'TradeFundPro-MT4',
            demoId: demoId,
            password: password,
            accountType: accountType.toUpperCase(),
            accountSize: planSize,
            profitSplit: profitSplit
        };
    };

    const handleAccountSelect = (type) => {
        setAccountType(type);
    };

    const handleContinueToPayment = () => {
        if (accountType) {
            setCurrentStep(2);
        }
    };

    const handleAcceptTC = () => {
        if (tcAccepted) {
            setShowTCModal(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const creds = generateCredentials();
        setCredentials(creds);
        setIsProcessing(false);
        setCurrentStep(3);
    };

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(''), 2000);
    };

    if (loading) {
        return <div className="purchase-loading">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="purchase-page">
            {/* Background Effects */}
            <div className="bg-gradient-orb"></div>
            <div className="bg-gradient-orb-2"></div>
            <div className="bg-grid"></div>

            {/* T&C Modal */}
            {showTCModal && (
                <div className="tc-modal-overlay">
                    <div className="tc-modal glass-card animate-fade-in">
                        <div className="tc-modal-header">
                            <div className="tc-icon">
                                <svg viewBox="0 0 48 48" fill="none">
                                    <circle cx="24" cy="24" r="22" stroke="url(#tcGrad)" strokeWidth="2" />
                                    <path d="M16 24L22 30L32 18" stroke="url(#tcGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    <defs>
                                        <linearGradient id="tcGrad" x1="0" y1="0" x2="48" y2="48">
                                            <stop offset="0%" stopColor="#00D9FF" />
                                            <stop offset="100%" stopColor="#7B61FF" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h2>Terms & Conditions</h2>
                            <p>Please read and accept our terms before proceeding</p>
                        </div>

                        <div className="tc-content">
                            <div className="tc-section">
                                <h3>📋 Trading Challenge Agreement</h3>
                                <p>By purchasing a funded trading account challenge, you agree to the following terms and conditions that govern your participation in our prop trading program.</p>
                            </div>

                            <div className="tc-section">
                                <h3>💰 Profit Split & Payouts</h3>
                                <ul>
                                    <li>Profit split as specified in your selected plan</li>
                                    <li>Payouts processed within 24-48 hours</li>
                                    <li>Minimum payout threshold: $100</li>
                                    <li>All profits are yours to keep after the split</li>
                                </ul>
                            </div>

                            <div className="tc-section">
                                <h3>📊 Trading Rules</h3>
                                <ul>
                                    <li>Maximum daily drawdown: 5% of account balance</li>
                                    <li>Maximum total drawdown: 10% of initial balance</li>
                                    <li>No weekend holding unless specified</li>
                                    <li>News trading restrictions may apply</li>
                                    <li>All positions must have stop-loss</li>
                                </ul>
                            </div>

                            <div className="tc-section">
                                <h3>⚠️ Risk Disclosure</h3>
                                <p>Trading involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results. You should carefully consider your investment objectives and risk appetite.</p>
                            </div>

                            <div className="tc-section">
                                <h3>🔒 Account Security</h3>
                                <ul>
                                    <li>Do not share your credentials with anyone</li>
                                    <li>Enable 2FA for added security</li>
                                    <li>Report suspicious activity immediately</li>
                                </ul>
                            </div>

                            <div className="tc-section">
                                <h3>❌ Prohibited Activities</h3>
                                <ul>
                                    <li>Copy trading from other funded accounts</li>
                                    <li>Exploiting system glitches or errors</li>
                                    <li>Using third-party trade copiers</li>
                                    <li>Account sharing or selling</li>
                                </ul>
                            </div>

                            <div className="tc-section">
                                <h3>✅ Refund Policy</h3>
                                <p>Challenge fees are non-refundable once the account credentials have been issued. If you pass the challenge, your fee will be refunded with your first profit payout.</p>
                            </div>
                        </div>

                        <div className="tc-footer">
                            <label className="tc-checkbox">
                                <input
                                    type="checkbox"
                                    checked={tcAccepted}
                                    onChange={(e) => setTcAccepted(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                <span className="checkbox-label">I have read and agree to the Terms & Conditions</span>
                            </label>

                            <button
                                className={`btn btn-gradient btn-lg btn-block ${!tcAccepted ? 'disabled' : ''}`}
                                onClick={handleAcceptTC}
                                disabled={!tcAccepted}
                            >
                                Accept & Continue
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="purchase-container">
                {/* Header */}
                <div className="purchase-header">
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
                </div>

                {/* Progress Steps */}
                <div className="purchase-steps">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                        <div className="step-number">
                            {currentStep > 1 ? '✓' : '1'}
                        </div>
                        <span className="step-label">Platform</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                        <div className="step-number">
                            {currentStep > 2 ? '✓' : '2'}
                        </div>
                        <span className="step-label">Payment</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <span className="step-label">Credentials</span>
                    </div>
                </div>

                {/* Plan Summary Card */}
                <div className="plan-summary glass-card">
                    <div className="plan-summary-row">
                        <span className="plan-label">Challenge Type</span>
                        <span className="plan-value">{planType.replace('-', ' ').toUpperCase()}</span>
                    </div>
                    <div className="plan-summary-row">
                        <span className="plan-label">Account Size</span>
                        <span className="plan-value highlight">{planSize}</span>
                    </div>
                    <div className="plan-summary-row">
                        <span className="plan-label">Profit Split</span>
                        <span className="plan-value">{profitSplit}</span>
                    </div>
                    <div className="plan-summary-divider"></div>
                    <div className="plan-summary-row total">
                        <span className="plan-label">Total</span>
                        <span className="plan-value">${planPrice}</span>
                    </div>
                </div>

                {/* Step 1: Account Type Selection */}
                {currentStep === 1 && (
                    <div className="step-content animate-fade-in">
                        <h1 className="step-title">Select Your <span className="gradient-text">Trading Platform</span></h1>
                        <p className="step-subtitle">Choose your preferred trading platform for your funded account</p>

                        <div className="platform-options">
                            <div
                                className={`platform-card glass-card ${accountType === 'mt5' ? 'selected' : ''}`}
                                onClick={() => handleAccountSelect('mt5')}
                            >
                                <div className="platform-icon">
                                    <svg viewBox="0 0 48 48" fill="none">
                                        <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 32L20 18L28 26L36 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx="12" cy="32" r="2" fill="currentColor" />
                                        <circle cx="20" cy="18" r="2" fill="currentColor" />
                                        <circle cx="28" cy="26" r="2" fill="currentColor" />
                                        <circle cx="36" cy="14" r="2" fill="currentColor" />
                                        <path d="M8 20h4M36 28h4" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                </div>
                                <h3>MetaTrader 5</h3>
                                <p>Advanced features & more instruments</p>
                                <ul className="platform-features">
                                    <li>✓ 80+ built-in indicators</li>
                                    <li>✓ Depth of Market (DOM)</li>
                                    <li>✓ Multi-asset trading</li>
                                </ul>
                                {accountType === 'mt5' && <div className="selected-badge">Selected</div>}
                            </div>
                        </div>

                        <button
                            className={`btn btn-gradient btn-lg btn-block ${!accountType ? 'disabled' : ''}`}
                            onClick={handleContinueToPayment}
                            disabled={!accountType}
                        >
                            Continue to Payment
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Step 2: Payment Form */}
                {currentStep === 2 && (
                    <div className="step-content animate-fade-in">
                        <h1 className="step-title">Complete <span className="gradient-text">Payment</span></h1>
                        <p className="step-subtitle">Enter your card details to complete the purchase</p>

                        <form className="payment-form glass-card" onSubmit={handlePaymentSubmit}>
                            <div className="payment-method-header">
                                <div className="payment-icons">
                                    <span className="card-icon visa">VISA</span>
                                    <span className="card-icon mastercard">MC</span>
                                    <span className="card-icon amex">AMEX</span>
                                </div>
                                <div className="secure-badge">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Secure
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Card Number</label>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    value={paymentData.cardNumber}
                                    onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Cardholder Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={paymentData.cardName}
                                    onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Expiry Date</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        value={paymentData.expiry}
                                        onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>CVV</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        maxLength="4"
                                        value={paymentData.cvv}
                                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="payment-total">
                                <span>Amount to Pay:</span>
                                <span className="total-amount">${planPrice}</span>
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-gradient btn-lg btn-block ${isProcessing ? 'processing' : ''}`}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay ${planPrice}
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            <p className="payment-disclaimer">
                                🔒 Your payment is secured with 256-bit SSL encryption
                            </p>
                        </form>

                        <button
                            className="btn btn-ghost"
                            onClick={() => setCurrentStep(1)}
                        >
                            ← Back to Platform Selection
                        </button>
                    </div>
                )}

                {/* Step 3: Success & Credentials */}
                {currentStep === 3 && credentials && (
                    <div className="step-content animate-fade-in">
                        <div className="success-animation">
                            <div className="success-checkmark">
                                <svg viewBox="0 0 52 52">
                                    <circle cx="26" cy="26" r="25" fill="none" stroke="url(#successGrad)" strokeWidth="2" />
                                    <path d="M14 27l8 8 16-16" fill="none" stroke="url(#successGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    <defs>
                                        <linearGradient id="successGrad" x1="0" y1="0" x2="52" y2="52">
                                            <stop offset="0%" stopColor="#00FF88" />
                                            <stop offset="100%" stopColor="#00D9FF" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>

                        <h1 className="step-title success-title">
                            <span className="gradient-text-success">Congratulations!</span>
                        </h1>
                        <p className="step-subtitle">Your funded trading account is ready. Here are your credentials:</p>

                        <div className="credentials-card glass-card premium">
                            <div className="credentials-header">
                                <div className="credentials-badge">
                                    <span className="badge-icon">🏆</span>
                                    <span className="badge-text">FUNDED ACCOUNT</span>
                                </div>
                                <div className="account-type-badge">{credentials.accountType}</div>
                            </div>

                            <div className="credentials-info">
                                <div className="info-row">
                                    <span className="info-label">Account Size</span>
                                    <span className="info-value">{credentials.accountSize}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Profit Split</span>
                                    <span className="info-value highlight">{credentials.profitSplit}</span>
                                </div>
                            </div>

                            <div className="credentials-divider">
                                <span>Login Credentials</span>
                            </div>

                            <div className="credential-item">
                                <div className="credential-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                    Server
                                </div>
                                <div className="credential-value">
                                    <span>{credentials.server}</span>
                                    <button
                                        className={`copy-btn ${copied === 'server' ? 'copied' : ''}`}
                                        onClick={() => handleCopy(credentials.server, 'server')}
                                    >
                                        {copied === 'server' ? '✓' : '📋'}
                                    </button>
                                </div>
                            </div>

                            <div className="credential-item">
                                <div className="credential-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Login ID
                                </div>
                                <div className="credential-value">
                                    <span className="highlight-text">{credentials.demoId}</span>
                                    <button
                                        className={`copy-btn ${copied === 'id' ? 'copied' : ''}`}
                                        onClick={() => handleCopy(credentials.demoId, 'id')}
                                    >
                                        {copied === 'id' ? '✓' : '📋'}
                                    </button>
                                </div>
                            </div>

                            <div className="credential-item">
                                <div className="credential-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Password
                                </div>
                                <div className="credential-value">
                                    <span className="highlight-text">{credentials.password}</span>
                                    <button
                                        className={`copy-btn ${copied === 'password' ? 'copied' : ''}`}
                                        onClick={() => handleCopy(credentials.password, 'password')}
                                    >
                                        {copied === 'password' ? '✓' : '📋'}
                                    </button>
                                </div>
                            </div>

                            <div className="credentials-footer">
                                <div className="footer-note">
                                    <span className="note-icon">📧</span>
                                    <span>Credentials have also been sent to your email</span>
                                </div>
                            </div>
                        </div>

                        <div className="success-actions">
                            <a
                                href={credentials.accountType === 'MT5'
                                    ? 'https://www.metatrader5.com/en/download'
                                    : 'https://www.metatrader4.com/en/download'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-gradient btn-lg"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Download {credentials.accountType}
                            </a>
                            <Link href="/dashboard" className="btn btn-outline btn-lg">
                                Go to Dashboard
                            </Link>
                        </div>

                        <div className="support-note glass-card">
                            <span className="support-icon">💬</span>
                            <div className="support-text">
                                <strong>Need help getting started?</strong>
                                <p>Our support team is available 24/7 to assist you.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function PurchaseLoadingSkeleton() {
    return (
        <div className="purchase-page">
            <div className="bg-gradient-orb"></div>
            <div className="bg-gradient-orb-2"></div>
            <div className="bg-grid"></div>
            <div className="purchase-container">
                <div className="purchase-header">
                    <div className="logo">
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
                    </div>
                </div>
                <div className="purchase-loading">Loading...</div>
            </div>
        </div>
    );
}

export default function PurchasePage() {
    return (
        <Suspense fallback={<PurchaseLoadingSkeleton />}>
            <PurchaseContent />
        </Suspense>
    );
}
