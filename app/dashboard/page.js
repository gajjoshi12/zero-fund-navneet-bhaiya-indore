'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { initializeDemoData, getAllTasks, getUserAssignments, getUserStats, assignTaskToUser } from '../lib/data';

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            initializeDemoData();
            loadData();
        }
    }, [user]);

    // Close mobile menu when tab changes
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
    };

    const loadData = () => {
        const allTasks = getAllTasks();
        const userAssignments = getUserAssignments(user.id);
        const userStats = getUserStats(user.id);

        setTasks(allTasks);
        setAssignments(userAssignments);
        setStats(userStats);
    };

    const handleClaimTask = (taskId) => {
        assignTaskToUser(taskId, user.id);
        loadData();
    };

    const getAssignmentForTask = (taskId) => {
        return assignments.find(a => a.taskId === taskId);
    };

    if (loading) {
        return <div className="dashboard-loading">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-page">
            {/* Sidebar */}
            <aside className={`dashboard-sidebar glass-card ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
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

                    <button
                        className={`mobile-menu-btn dashboard-toggle ${mobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div className="sidebar-content-wrapper">
                    <nav className="sidebar-nav">
                        <button
                            className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => handleTabChange('overview')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="9" />
                                <rect x="14" y="3" width="7" height="5" />
                                <rect x="14" y="12" width="7" height="9" />
                                <rect x="3" y="16" width="7" height="5" />
                            </svg>
                            Overview
                        </button>
                        <button
                            className={`sidebar-link ${activeTab === 'tasks' ? 'active' : ''}`}
                            onClick={() => handleTabChange('tasks')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 11l3 3L22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                            Available Tasks
                        </button>
                        <button
                            className={`sidebar-link ${activeTab === 'my-tasks' ? 'active' : ''}`}
                            onClick={() => handleTabChange('my-tasks')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            My Tasks
                        </button>
                        <button
                            className={`sidebar-link ${activeTab === 'earnings' ? 'active' : ''}`}
                            onClick={() => handleTabChange('earnings')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            Earnings
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
                                <polyline points="16,17 21,12 16,7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {activeTab === 'overview' && (
                    <div className="dashboard-content">
                        <h1 className="dashboard-title">Welcome back, <span className="gradient-text">{user.name}</span>!</h1>

                        <div className="trading-actions-grid">
                            <a href="https://member.srglobalfx.com/register" target="_blank" rel="noopener noreferrer" className="trading-card register">
                                <div className="trading-card-content">
                                    <div className="trading-card-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="8.5" cy="7" r="4"></circle>
                                            <line x1="20" y1="8" x2="20" y2="14"></line>
                                            <line x1="23" y1="11" x2="17" y2="11"></line>
                                        </svg>
                                    </div>
                                    <h3>Start Trading Now</h3>
                                    <p>Register for a new trading account to begin your journey with our advanced platform.</p>
                                    <span className="btn-arrow">
                                        Register Now
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </span>
                                </div>
                            </a>

                            <a href="https://member.srglobalfx.com/login" target="_blank" rel="noopener noreferrer" className="trading-card login">
                                <div className="trading-card-content">
                                    <div className="trading-card-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                            <polyline points="10 17 15 12 10 7"></polyline>
                                            <line x1="15" y1="12" x2="3" y2="12"></line>
                                        </svg>
                                    </div>
                                    <h3>Access Trading Dashboard</h3>
                                    <p>Already have an account? Login to manage your trades and view performance.</p>
                                    <span className="btn-arrow">
                                        Login to Trade
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </span>
                                </div>
                            </a>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card glass-card">
                                <div className="stat-icon blue">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 11l3 3L22 4" />
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
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
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22,4 12,14.01 9,11.01" />
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
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12,6 12,12 16,14" />
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
                                    <span className="stat-value">₹{(stats?.totalEarnings || 0).toLocaleString('en-IN')}</span>
                                    <span className="stat-label">Total Earnings</span>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-section">
                            <h2>Current Balance</h2>
                            <div className="balance-card glass-card">
                                <div className="balance-amount">
                                    <span className="currency">₹</span>
                                    <span className="amount">{(stats?.balance || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <p className="balance-label">Available for withdrawal</p>
                                <button className="btn btn-primary">Request Withdrawal</button>
                            </div>
                        </div>
                    </div>
                )}

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
                                            <span className="task-reward">₹{task.reward.toLocaleString('en-IN')}</span>
                                        </div>
                                        <p className="task-description">{task.description}</p>
                                        <div className="task-requirements">
                                            <h4>Requirements:</h4>
                                            <ul>
                                                {task.requirements.map((req, i) => (
                                                    <li key={i}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="task-footer">
                                            <span className="task-deadline">Deadline: {new Date(task.deadline).toLocaleDateString('en-IN')}</span>
                                            {assignment ? (
                                                <span className={`task-status ${assignment.status}`}>
                                                    {assignment.status.replace('_', ' ')}
                                                </span>
                                            ) : (
                                                <Link
                                                    href={`/dashboard/purchase?size=${encodeURIComponent(task.title)}&price=${task.reward.toLocaleString('en-IN')}&type=challenge&split=80%25`}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    Claim Task
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

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
                                    const task = tasks.find(t => t.id === assignment.taskId);
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
                                                <span className="value">₹{task.reward.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="task-footer">
                                                {(assignment.status === 'pending' || assignment.status === 'in_progress' || assignment.status === 'rejected') && (
                                                    <Link
                                                        href={`/dashboard/submit/${assignment.id}`}
                                                        className="btn btn-primary btn-sm"
                                                    >
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

                {activeTab === 'earnings' && (
                    <div className="dashboard-content">
                        <h1 className="dashboard-title">My <span className="gradient-text">Earnings</span></h1>

                        <div className="earnings-overview">
                            <div className="earnings-card glass-card">
                                <h3>Total Earnings</h3>
                                <span className="earnings-amount">₹{(stats?.totalEarnings || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="earnings-card glass-card">
                                <h3>Available Balance</h3>
                                <span className="earnings-amount">₹{(stats?.balance || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="earnings-card glass-card">
                                <h3>Completed Tasks</h3>
                                <span className="earnings-amount">{stats?.completedTasks || 0}</span>
                            </div>
                        </div>

                        <div className="withdrawal-section glass-card">
                            <h2>Request Withdrawal</h2>
                            <p>Minimum withdrawal amount: ₹5,000</p>
                            <div className="withdrawal-form">
                                <input type="number" placeholder="Enter amount" className="withdrawal-input" />
                                <button className="btn btn-primary">Request Withdrawal</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
