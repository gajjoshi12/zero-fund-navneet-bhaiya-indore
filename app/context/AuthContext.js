'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const storedUser = localStorage.getItem('tradefund_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('tradefund_users') || '[]');

        // Check for admin
        if (email === 'admin@tradefund.com' && password === 'admin123') {
            const adminUser = {
                id: 'admin',
                email: 'admin@tradefund.com',
                name: 'Admin',
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            setUser(adminUser);
            localStorage.setItem('tradefund_user', JSON.stringify(adminUser));
            return { success: true, user: adminUser };
        }

        // Check for demo user
        if (email === 'demo@tradefund.com' && password === 'demo123') {
            const demoUser = {
                id: 'demo',
                email: 'demo@tradefund.com',
                name: 'Demo User',
                role: 'user',
                balance: 0,
                totalEarnings: 0,
                createdAt: new Date().toISOString()
            };
            setUser(demoUser);
            localStorage.setItem('tradefund_user', JSON.stringify(demoUser));
            return { success: true, user: demoUser };
        }

        // Check registered users
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem('tradefund_user', JSON.stringify(userWithoutPassword));
            return { success: true, user: userWithoutPassword };
        }

        return { success: false, error: 'Invalid email or password' };
    };

    const signup = (name, email, password, phone) => {
        const users = JSON.parse(localStorage.getItem('tradefund_users') || '[]');

        // Check if email already exists
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'Email already registered' };
        }

        const newUser = {
            id: `user_${Date.now()}`,
            name,
            email,
            password, // In real app, this should be hashed
            phone,
            role: 'user',
            balance: 0,
            totalEarnings: 0,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('tradefund_users', JSON.stringify(users));

        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem('tradefund_user', JSON.stringify(userWithoutPassword));

        return { success: true, user: userWithoutPassword };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tradefund_user');
    };

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('tradefund_user', JSON.stringify(updatedUser));

        // Also update in users array
        const users = JSON.parse(localStorage.getItem('tradefund_users') || '[]');
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('tradefund_users', JSON.stringify(users));
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
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
