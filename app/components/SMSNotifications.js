'use client';

import { useState, useEffect, useCallback } from 'react';

export default function SMSNotifications() {
    const [notifications, setNotifications] = useState([]);

    // Random Indian names
    const firstNames = [
        'Rohit', 'Priya', 'Amit', 'Neha', 'Vikram', 'Anjali', 'Rajesh', 'Meera',
        'Vishal', 'Karan', 'Sneha', 'Arjun', 'Pooja', 'Rahul', 'Divya', 'Anil',
        'Kavita', 'Suresh', 'Ritu', 'Deepak', 'Anita', 'Manoj', 'Swati', 'Vinay',
        'Nisha', 'Sanjay', 'Preeti', 'Ravi', 'Sunita', 'Gaurav', 'Shweta', 'Nikhil'
    ];

    const lastInitials = ['S', 'K', 'M', 'R', 'P', 'D', 'G', 'V', 'T', 'B', 'A', 'C', 'J', 'N'];

    const tasks = [
        'Social Media Task',
        'Trading Challenge',
        'Referral Bonus',
        'Phase 1 Challenge',
        'Phase 2 Challenge',
        'Instagram Post',
        'Video Review',
        'Twitter Task',
        'YouTube Review',
        'App Download Task'
    ];

    const amounts = [
        '₹2,500', '₹5,000', '₹7,500', '₹10,000', '₹15,000',
        '₹25,000', '₹50,000', '₹75,000', '₹1,00,000', '₹1,50,000',
        '₹2,00,000', '₹3,50,000', '₹5,00,000', '₹7,50,000'
    ];

    const generateRandomNotification = useCallback(() => {
        const name = firstNames[Math.floor(Math.random() * firstNames.length)];
        const initial = lastInitials[Math.floor(Math.random() * lastInitials.length)];
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        const amount = amounts[Math.floor(Math.random() * amounts.length)];

        return {
            id: Date.now(),
            sender: 'TradeFund',
            message: `${name} ${initial}. got ${amount} credited for completing ${task}`,
            time: 'now',
            visible: true
        };
    }, []);

    useEffect(() => {
        let scrollTimeout;
        let lastScrollY = 0;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Only trigger on scroll down and after scrolling a certain amount
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                clearTimeout(scrollTimeout);

                scrollTimeout = setTimeout(() => {
                    const newNotification = generateRandomNotification();

                    setNotifications(prev => [...prev.slice(-2), newNotification]);

                    // Auto-remove after 4 seconds
                    setTimeout(() => {
                        setNotifications(prev =>
                            prev.map(n => n.id === newNotification.id ? { ...n, visible: false } : n)
                        );

                        // Remove from DOM after animation
                        setTimeout(() => {
                            setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
                        }, 400);
                    }, 4000);
                }, 600);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [generateRandomNotification]);

    return (
        <div className="sms-notifications-container">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`sms-notification ${notification.visible ? 'visible' : ''}`}
                >
                    <div className="sms-header">
                        <div className="sms-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20,6 9,17 4,12" />
                            </svg>
                        </div>
                        <div className="sms-sender">{notification.sender}</div>
                        <div className="sms-time">{notification.time}</div>
                    </div>
                    <div className="sms-body">
                        <p>{notification.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
