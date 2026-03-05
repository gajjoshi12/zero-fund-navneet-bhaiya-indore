'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            if (result.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card glass-card">
                    <div className="auth-header">
                        <Link href="/" className="logo">
                            <div className="logo-icon">
                            <svg viewBox="0 0 40 40" fill="none" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 0, 127, 0.6)) drop-shadow(0 0 16px rgba(0, 240, 255, 0.4))' }}>
                                <circle cx="20" cy="20" r="18" stroke="url(#staticPremiumGrad)" strokeWidth="3" />
                                <path d="M12 20L18 26L28 14" stroke="url(#staticPremiumGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                <defs>
                                    <linearGradient id="staticPremiumGrad" x1="0" y1="0" x2="40" y2="40">
                                        <stop offset="0%" stopColor="#FF007F" />
                                        <stop offset="50%" stopColor="#8A2BE2" />
                                        <stop offset="100%" stopColor="#00F0FF" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="logo-text">Zero Fund<span className="logo-highlight">Pro</span></span>
                        </Link>
                        <h1>Welcome Back</h1>
                        <p>Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="auth-error">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link href="/auth/signup">Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
