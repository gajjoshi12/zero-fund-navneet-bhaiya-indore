'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session from stored token
        const token = localStorage.getItem('sr_token');
        const storedUser = localStorage.getItem('sr_user');

        if (token && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch {
                localStorage.removeItem('sr_token');
                localStorage.removeItem('sr_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login/', { email, password });

            if (res.status === 200) {
                const { token, user: userData } = res.data;
                localStorage.setItem('sr_token', token);
                localStorage.setItem('sr_user', JSON.stringify(userData));
                setUser(userData);
                return { success: true, user: userData };
            } else {
                return { success: false, error: res.msg || 'Invalid credentials' };
            }
        } catch (err) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const signup = async (name, email, password, phone, country) => {
        try {
            const res = await api.post('/auth/register/', { name, email, password, phone, country });

            if (res.status === 200) {
                const { token, user: userData } = res.data;
                localStorage.setItem('sr_token', token);
                localStorage.setItem('sr_user', JSON.stringify(userData));
                setUser(userData);
                return { success: true, user: userData };
            } else {
                return { success: false, error: res.msg || 'Registration failed' };
            }
        } catch (err) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const logout = () => {
        localStorage.removeItem('sr_token');
        localStorage.removeItem('sr_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
