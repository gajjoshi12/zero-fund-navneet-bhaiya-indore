'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import {
    getAllTasks, getUserAssignments, getUserStats, claimTask,
    getFundedAccounts, getNotifications, markNotificationRead,
    markAllNotificationsRead, updateProfile
} from '../lib/data';

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [stats, setStats] = useState(null);
    const [fundedAccounts, setFundedAccounts] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [copied, setCopied] = useState('');
    const [toast, setToast] = useState(null);

    // Profile edit state
    const [profileForm, setProfileForm] = useState({ name: '', phone: '', country: '' });
    const [profileSaving, setProfileSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        }
        if (!loading && user?.role === 'admin') {
            router.push('/admin');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            loadData();
            loadNotifications();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || '',
                phone: user.phone || '',
                country: user.country || '',
            });
        }
    }, [user]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadData = async () => {
        try {
            setDataLoading(true);
            const [allTasks, userAssignments, userStats, accounts] = await Promise.all([
                getAllTasks(),
                getUserAssignments(),
                getUserStats(),
                getFundedAccounts(),
            ]);
            setTasks(allTasks);
            setAssignments(userAssignments);
            setStats(userStats);
            setFundedAccounts(accounts);
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setDataLoading(false);
        }
    };

    const loadNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data || []);
            setUnreadCount(res.unread_count || 0);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        }
    };

    const handleClaimTask = async (taskId) => {
        await claimTask(taskId);
        showToast('Task claimed successfully!');
        await loadData();
        await loadNotifications();
    };

    const handleMarkRead = async (id) => {
        await markNotificationRead(id);
        await loadNotifications();
    };

    const handleMarkAllRead = async () => {
        await markAllNotificationsRead();
        await loadNotifications();
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setProfileSaving(true);
        try {
            const res = await updateProfile(profileForm);
            if (res.status === 200) {
                // Update local storage
                const storedUser = JSON.parse(localStorage.getItem('sr_user') || '{}');
                const updatedUser = { ...storedUser, ...res.data };
                localStorage.setItem('sr_user', JSON.stringify(updatedUser));
                showToast('Profile updated successfully!');
            }
        } catch (err) {
            showToast('Failed to update profile', 'error');
        }
        setProfileSaving(false);
    };

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(''), 2000);
    };

    const getAssignmentForTask = (taskId) => {
        return assignments.find(a => a.task?.id === taskId || a.task_id === taskId);
    };

    if (loading) {
        return <div className="dashboard-loading">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-page">
            {/* Toast Notification */}
            {toast && (
                <div className={`toast-notification ${toast.type}`}>
                    <span>{toast.type === 'success' ? '✓' : '✕'}</span>
                    {toast.message}
                </div>
            )}

            {/* Sidebar */}
            <aside className={`dashboard-sidebar glass-card ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
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

                    {/* Notification Bell */}
                    <div className="header-actions-group">
                        <button className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                        </button>

                        <button
                            className={`mobile-menu-btn dashboard-toggle ${mobileMenuOpen ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>

                {/* Notifications Dropdown */}
                {showNotifications && (
                    <div className="notifications-dropdown glass-card">
                        <div className="notifications-header">
                            <h4>Notifications</h4>
                            {unreadCount > 0 && (
                                <button className="mark-all-read" onClick={handleMarkAllRead}>
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="notifications-list">
                            {notifications.length === 0 ? (
                                <div className="notification-empty">No notifications yet</div>
                            ) : (
                                notifications.slice(0, 10).map(n => (
                                    <div
                                        key={n.id}
                                        className={`notification-item ${!n.is_read ? 'unread' : ''}`}
                                        onClick={() => handleMarkRead(n.id)}
                                    >
                                        <div className="notification-icon">
                                            {n.type === 'submission_approved' ? '🎉' :
                                                n.type === 'submission_rejected' ? '❌' :
                                                    n.type === 'task_assigned' ? '📋' :
                                                        n.type === 'account_created' ? '🚀' : '🔔'}
                                        </div>
                                        <div className="notification-content">
                                            <span className="notification-title">{n.title}</span>
                                            <span className="notification-message">{n.message}</span>
                                            <span className="notification-time">
                                                {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                <div className="sidebar-content-wrapper">
                    <nav className="sidebar-nav">
                        <button className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => handleTabChange('overview')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
                                <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
                            </svg>
                            Overview
                        </button>
                        <button className={`sidebar-link ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => handleTabChange('accounts')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                            Funded Accounts
                        </button>
                        <button className={`sidebar-link ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => handleTabChange('tasks')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                            Available Tasks
                        </button>
                        <button className={`sidebar-link ${activeTab === 'my-tasks' ? 'active' : ''}`} onClick={() => handleTabChange('my-tasks')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            My Tasks
                        </button>
                        <button className={`sidebar-link ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => handleTabChange('earnings')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            Earnings
                        </button>
                        <button className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => handleTabChange('profile')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                            Profile
                        </button>
                    </nav>

                    <div className="sidebar-footer">
                        <div className="user-info">
                            <div className="user-avatar">{user.name?.charAt(0) || 'U'}</div>
                            <div className="user-details">
                                <span className="user-name">{user.name}</span>
                                <span className="user-email">{user.email}</span>
                            </div>
                        </div>
                        <button className="btn-logout" onClick={logout}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* ─── Overview Tab ─── */}
                {activeTab === 'overview' && (
                    <div className="dashboard-content">
                        <h1 className="dashboard-title">Welcome back, <span className="gradient-text">{user.name}</span>!</h1>

                        <div className="stats-grid">
                            <div className="stat-card glass-card">
                                <div className="stat-icon blue">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.assignedTasks || 0}</span>
                                    <span className="stat-label">Assigned Tasks</span>
                                </div>
                            </div>
                            <div className="stat-card glass-card">
                                <div className="stat-icon green">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.completedTasks || 0}</span>
                                    <span className="stat-label">Completed</span>
                                </div>
                            </div>
                            <div className="stat-card glass-card">
                                <div className="stat-icon orange">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.pendingTasks || 0}</span>
                                    <span className="stat-label">Pending</span>
                                </div>
                            </div>
                            <div className="stat-card glass-card">
                                <div className="stat-icon purple">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="1" x2="12" y2="23" />
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">${(stats?.totalEarnings || 0).toLocaleString('en-US')}</span>
                                    <span className="stat-label">Total Earnings</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Funded Accounts Preview */}
                        {fundedAccounts.length > 0 && (
                            <div className="dashboard-section">
                                <div className="section-header-row">
                                    <h2>Your Funded Accounts</h2>
                                    <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('accounts')}>View All</button>
                                </div>
                                <div className="funded-accounts-preview">
                                    {fundedAccounts.slice(0, 2).map(acc => (
                                        <div key={acc.id} className="funded-account-mini glass-card">
                                            <div className="account-mini-header">
                                                <span className="account-mini-size">{acc.account_size}</span>
                                                <span className={`account-status-badge ${acc.status}`}>{acc.status}</span>
                                            </div>
                                            <div className="account-mini-details">
                                                <span>Login: <strong>{acc.login_id}</strong></span>
                                                <span>Split: <strong>{acc.profit_split}</strong></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="dashboard-section">
                            <h2>Current Balance</h2>
                            <div className="balance-card glass-card">
                                <div className="balance-amount">
                                    <span className="currency">?</span>
                                    <span className="amount">{(stats?.balance || 0).toLocaleString('en-US')}</span>
                                </div>
                                <p className="balance-label">Available for withdrawal</p>
                                <button className="btn btn-primary" onClick={() => showToast('Withdrawal request submitted! Our team will process it within 24-48 hours.')}>
                                    Request Withdrawal
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Funded Accounts Tab ─── */}
                {activeTab === 'accounts' && (
                    <div className="dashboard-content">
                        <h1 className="dashboard-title">Funded <span className="gradient-text">Accounts</span></h1>
                        <p className="dashboard-subtitle">Your active trading accounts and credentials</p>

                        {fundedAccounts.length === 0 ? (
                            <div className="empty-state glass-card">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                                <h3>No funded accounts yet</h3>
                                <p>Purchase a challenge to get your funded trading account</p>
                                <Link href="/#challenges" className="btn btn-primary">Browse Challenges</Link>
                            </div>
                        ) : (
                            <div className="funded-accounts-grid">
                                {fundedAccounts.map(acc => (
                                    <div key={acc.id} className="funded-account-card glass-card">
                                        <div className="funded-card-header">
                                            <div className="funded-card-badge">
                                                <span className="badge-icon">{acc.is_live ? '🏆' : '🧪'}</span>
                                                <span>{acc.is_live ? 'LIVE' : 'DEMO'}</span>
                                            </div>
                                            <span className={`account-status-badge ${acc.status}`}>{acc.status}</span>
                                        </div>

                                        <div className="funded-card-size">{acc.account_size}</div>

                                        <div className="funded-card-details">
                                            <div className="funded-detail-row">
                                                <span className="detail-label">Server</span>
                                                <div className="detail-value-group">
                                                    <span>{acc.server}</span>
                                                    <button className={`copy-btn-sm ${copied === `srv-${acc.id}` ? 'copied' : ''}`} onClick={() => handleCopy(acc.server, `srv-${acc.id}`)}>
                                                        {copied === `srv-${acc.id}` ? '✓' : '📋'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="funded-detail-row">
                                                <span className="detail-label">Login ID</span>
                                                <div className="detail-value-group">
                                                    <span className="highlight-value">{acc.login_id}</span>
                                                    <button className={`copy-btn-sm ${copied === `lid-${acc.id}` ? 'copied' : ''}`} onClick={() => handleCopy(acc.login_id, `lid-${acc.id}`)}>
                                                        {copied === `lid-${acc.id}` ? '✓' : '📋'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="funded-detail-row">
                                                <span className="detail-label">Platform</span>
                                                <span>{acc.account_type}</span>
                                            </div>
                                            <div className="funded-detail-row">
                                                <span className="detail-label">Profit Split</span>
                                                <span className="highlight-value">{acc.profit_split}</span>
                                            </div>
                                            <div className="funded-detail-row">
                                                <span className="detail-label">Leverage</span>
                                                <span>{acc.leverage}</span>
                                            </div>
                                            <div className="funded-detail-row">
                                                <span className="detail-label">Plan</span>
                                                <span>{acc.plan_type}</span>
                                            </div>
                                            <div className="funded-detail-row">
                                                <span className="detail-label">Created</span>
                                                <span>{new Date(acc.created_at).toLocaleDateString('en-US')}</span>
                                            </div>
                                        </div>

                                        <a
                                            href="https://www.metatrader5.com/en/download"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary btn-block btn-sm"
                                            style={{ marginTop: '16px' }}
                                        >
                                            Download {acc.account_type}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Available Tasks Tab ─── */}
                {activeTab === 'tasks' && (
                    <div className="dashboard-content">
                        <h1 className="dashboard-title">Available <span className="gradient-text">Tasks</span></h1>
                        <p className="dashboard-subtitle">Claim tasks and complete them to earn rewards</p>

                        <div className="tasks-grid">
                            {tasks.filter(t => t.status === 'active').map(task => {
                                const assignment = getAssignmentForTask(task.id);
                                return (
                                    <div key={task.id} className="task-card glass-card">
                                        <div className="task-header">
                                            <h3 className="task-title">{task.title}</h3>
                                            <span className="task-reward">${Number(task.reward).toLocaleString('en-US')}</span>
                                        </div>
                                        <p className="task-description">{task.description}</p>
                                        <div className="task-requirements">
                                            <h4>Requirements:</h4>
                                            <ul>
                                                {(task.requirements || []).map((req, i) => (
                                                    <li key={i}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="task-footer">
                                            <span className="task-deadline">Deadline: {new Date(task.deadline).toLocaleDateString('en-US')}</span>
                                            {assignment ? (
                                                <span className={`task-status ${assignment.status}`}>
                                                    {assignment.status.replace('_', ' ')}
                                                </span>
                                            ) : (
                                                <button className="btn btn-primary btn-sm" onClick={() => handleClaimTask(task.id)}>
                                                    Claim Task
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {tasks.filter(t => t.status === 'active').length === 0 && (
                                <div className="empty-state glass-card">
                                    <h3>No active tasks</h3>
                                    <p>Check back later for new tasks</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── My Tasks Tab ─── */}
                {activeTab === 'my-tasks' && (
                    <div className="dashboard-content">
                        <h1 className="dashboard-title">My <span className="gradient-text">Tasks</span></h1>
                        <p className="dashboard-subtitle">View and submit proofs for your assigned tasks</p>

                        {assignments.length === 0 ? (
                            <div className="empty-state glass-card">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14,2 14,8 20,8" />
                                </svg>
                                <h3>No tasks yet</h3>
                                <p>Claim tasks from the Available Tasks tab to get started</p>
                                <button className="btn btn-primary" onClick={() => setActiveTab('tasks')}>
                                    Browse Tasks
                                </button>
                            </div>
                        ) : (
                            <div className="tasks-grid">
                                {assignments.map(assignment => {
                                    const task = assignment.task || tasks.find(t => t.id === assignment.task_id);
                                    if (!task) return null;
                                    return (
                                        <div key={assignment.id} className="task-card glass-card">
                                            <div className="task-header">
                                                <h3 className="task-title">{task.title}</h3>
                                                <span className={`task-status ${assignment.status}`}>
                                                    {assignment.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <p className="task-description">{task.description}</p>
                                            <div className="task-reward-display">
                                                <span className="label">Reward:</span>
                                                <span className="value">${Number(task.reward).toLocaleString('en-US')}</span>
                                            </div>
                                            <div className="task-footer">
                                                {(assignment.status === 'pending' || assignment.status === 'in_progress' || assignment.status === 'rejected') && (
                                                    <Link href={`/dashboard/submit/${assignment.id}`} className="btn btn-primary btn-sm">
                                                        Submit Proof
                                                    </Link>
                                                )}
                                                {assignment.status === 'submitted' && (
                                                    <span className="status-message">Under Review</span>
                                                )}
                                                {assignment.status === 'completed' && (
                                                    <span className="status-message success">Completed ✓</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Earnings Tab ─── */}
                {activeTab === 'earnings' && (
                    <div className="dashboard-content">
                        <h1 className="dashboard-title">My <span className="gradient-text">Earnings</span></h1>

                        <div className="earnings-overview">
                            <div className="earnings-card glass-card">
                                <h3>Total Earnings</h3>
                                <span className="earnings-amount">${(stats?.totalEarnings || 0).toLocaleString('en-US')}</span>
                            </div>
                            <div className="earnings-card glass-card">
                                <h3>Available Balance</h3>
                                <span className="earnings-amount">${(stats?.balance || 0).toLocaleString('en-US')}</span>
                            </div>
                            <div className="earnings-card glass-card">
                                <h3>Completed Tasks</h3>
                                <span className="earnings-amount">{stats?.completedTasks || 0}</span>
                            </div>
                        </div>

                        <div className="withdrawal-section glass-card">
                            <h2>Request Withdrawal</h2>
                            <p>Minimum withdrawal amount: ₹100</p>
                            <div className="withdrawal-form">
                                <input type="number" placeholder="Enter amount" className="withdrawal-input" />
                                <button className="btn btn-primary" onClick={() => showToast('Withdrawal request submitted! Our team will process it within 24-48 hours.')}>
                                    Request Withdrawal
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Profile Tab ─── */}
                {activeTab === 'profile' && (
                    <div className="dashboard-content">
                        <h1 className="dashboard-title">My <span className="gradient-text">Profile</span></h1>
                        <p className="dashboard-subtitle">Manage your account settings</p>

                        <div className="profile-section">
                            <div className="profile-card glass-card">
                                <div className="profile-header">
                                    <div className="profile-avatar-large">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="profile-info">
                                        <h2>{user.name}</h2>
                                        <p>{user.email}</p>
                                        <span className="profile-role-badge">
                                            {user.role === 'admin' ? '👑 Admin' : '📊 Trader'}
                                        </span>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileSave} className="profile-form">
                                    <div className="form-group">
                                        <label htmlFor="profileName">Full Name</label>
                                        <input
                                            type="text" id="profileName"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email" value={user.email} disabled className="input-disabled" />
                                        <small className="form-hint">Email cannot be changed</small>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="profilePhone">Phone Number</label>
                                            <input
                                                type="tel" id="profilePhone"
                                                value={profileForm.phone}
                                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="profileCountry">Country</label>
                                            <input
                                                type="text" id="profileCountry"
                                                value={profileForm.country}
                                                onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={profileSaving}>
                                        {profileSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>

                            <div className="profile-stats-card glass-card">
                                <h3>Account Summary</h3>
                                <div className="profile-stat-row">
                                    <span>Balance</span>
                                    <strong>${(stats?.balance || 0).toLocaleString('en-US')}</strong>
                                </div>
                                <div className="profile-stat-row">
                                    <span>Total Earnings</span>
                                    <strong>${(stats?.totalEarnings || 0).toLocaleString('en-US')}</strong>
                                </div>
                                <div className="profile-stat-row">
                                    <span>Funded Accounts</span>
                                    <strong>{fundedAccounts.length}</strong>
                                </div>
                                <div className="profile-stat-row">
                                    <span>Tasks Completed</span>
                                    <strong>{stats?.completedTasks || 0}</strong>
                                </div>
                                <div className="profile-stat-row">
                                    <span>Member Since</span>
                                    <strong>{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
