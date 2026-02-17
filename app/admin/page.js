'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import {
    initializeDemoData,
    getAdminStats,
    getAllUsers,
    getAllTasks,
    getAllSubmissions,
    getAllAssignments,
    createTask,
    deleteTask,
    approveSubmission,
    rejectSubmission,
    assignTaskToUser,
    updateUserStatus
} from '../lib/data';

export default function AdminPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    // Task form
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        reward: '',
        deadline: '',
        requirements: ''
    });

    // Assign modal
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        }

        if (!loading && user?.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user?.role === 'admin') {
            initializeDemoData();
            loadData();
        }
    }, [user]);

    const loadData = () => {
        setStats(getAdminStats());
        setUsers(getAllUsers());
        setTasks(getAllTasks());
        setSubmissions(getAllSubmissions());
        setAssignments(getAllAssignments());
    };

    const handleCreateTask = (e) => {
        e.preventDefault();
        const requirementsArray = newTask.requirements.split('\n').filter(r => r.trim());
        createTask({
            ...newTask,
            reward: parseInt(newTask.reward),
            requirements: requirementsArray
        });
        setNewTask({ title: '', description: '', reward: '', deadline: '', requirements: '' });
        setShowTaskForm(false);
        loadData();
    };

    const handleDeleteTask = (taskId) => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(taskId);
            loadData();
        }
    };

    const handleAssignTask = () => {
        if (selectedTask && selectedUser) {
            assignTaskToUser(selectedTask, selectedUser);
            setShowAssignModal(false);
            setSelectedTask(null);
            setSelectedUser('');
            loadData();
        }
    };

    const handleApproveSubmission = (submissionId) => {
        approveSubmission(submissionId);
        loadData();
    };

    const handleRejectSubmission = (submissionId) => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            rejectSubmission(submissionId, reason);
            loadData();
        }
    };

    const handleToggleUserStatus = (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        updateUserStatus(userId, newStatus);
        loadData();
    };

    if (loading) {
        return <div className="dashboard-loading">Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="dashboard-page admin-page">
            {/* Sidebar */}
            <aside className="dashboard-sidebar glass-card">
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
                    <span className="admin-badge">Admin Panel</span>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="9" />
                            <rect x="14" y="3" width="7" height="5" />
                            <rect x="14" y="12" width="7" height="9" />
                            <rect x="3" y="16" width="7" height="5" />
                        </svg>
                        Dashboard
                    </button>
                    <button
                        className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Users ({users.length})
                    </button>
                    <button
                        className={`sidebar-link ${activeTab === 'tasks' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tasks')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        Tasks ({tasks.length})
                    </button>
                    <button
                        className={`sidebar-link ${activeTab === 'submissions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('submissions')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                        </svg>
                        Submissions ({submissions.filter(s => s.status === 'pending').length} pending)
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar admin">A</div>
                        <div className="user-details">
                            <span className="user-name">Admin</span>
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
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {activeTab === 'overview' && (
                    <div className="dashboard-content">
                        <h1 className="dashboard-title">Admin <span className="gradient-text">Dashboard</span></h1>

                        <div className="stats-grid">
                            <div className="stat-card glass-card">
                                <div className="stat-icon blue">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.totalUsers || 0}</span>
                                    <span className="stat-label">Total Users</span>
                                </div>
                            </div>

                            <div className="stat-card glass-card">
                                <div className="stat-icon green">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 11l3 3L22 4" />
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.activeTasks || 0}</span>
                                    <span className="stat-label">Active Tasks</span>
                                </div>
                            </div>

                            <div className="stat-card glass-card">
                                <div className="stat-icon orange">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.pendingSubmissions || 0}</span>
                                    <span className="stat-label">Pending Reviews</span>
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
                                    <span className="stat-value">${(stats?.totalPaidOut || 0).toLocaleString('en-US')}</span>
                                    <span className="stat-label">Total Paid Out</span>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-section">
                            <h2>Recent Submissions</h2>
                            <div className="submissions-table glass-card">
                                {submissions.slice(0, 5).map(submission => {
                                    const submissionUser = users.find(u => u.id === submission.userId);
                                    const task = tasks.find(t => t.id === submission.taskId);
                                    return (
                                        <div key={submission.id} className="submission-row">
                                            <div className="submission-info">
                                                <span className="submission-user">{submissionUser?.name || 'Unknown'}</span>
                                                <span className="submission-task">{task?.title || 'Unknown Task'}</span>
                                            </div>
                                            <span className={`submission-status ${submission.status}`}>
                                                {submission.status}
                                            </span>
                                        </div>
                                    );
                                })}
                                {submissions.length === 0 && (
                                    <div className="empty-message">No submissions yet</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="dashboard-content">
                        <h1 className="dashboard-title">Manage <span className="gradient-text">Users</span></h1>

                        <div className="users-table glass-card">
                            <div className="table-header">
                                <span>Name</span>
                                <span>Email</span>
                                <span>Phone</span>
                                <span>Earnings</span>
                                <span>Status</span>
                                <span>Actions</span>
                            </div>
                            {users.map(u => (
                                <div key={u.id} className="table-row">
                                    <span>{u.name}</span>
                                    <span>{u.email}</span>
                                    <span>{u.phone || '-'}</span>
                                    <span>${(u.totalEarnings || 0).toLocaleString('en-US')}</span>
                                    <span className={`user-status ${u.status || 'active'}`}>{u.status || 'active'}</span>
                                    <div className="row-actions">
                                        <button
                                            className={`btn-action ${u.status === 'inactive' ? 'activate' : 'deactivate'}`}
                                            onClick={() => handleToggleUserStatus(u.id, u.status || 'active')}
                                        >
                                            {u.status === 'inactive' ? 'Activate' : 'Deactivate'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {users.length === 0 && (
                                <div className="empty-message">No users registered yet</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="dashboard-content">
                        <div className="dashboard-header-row">
                            <h1 className="dashboard-title">Manage <span className="gradient-text">Tasks</span></h1>
                            <button className="btn btn-primary" onClick={() => setShowTaskForm(true)}>
                                + Create Task
                            </button>
                        </div>

                        {showTaskForm && (
                            <div className="modal-overlay">
                                <div className="modal glass-card">
                                    <div className="modal-header">
                                        <h2>Create New Task</h2>
                                        <button className="modal-close" onClick={() => setShowTaskForm(false)}>×</button>
                                    </div>
                                    <form onSubmit={handleCreateTask} className="task-form">
                                        <div className="form-group">
                                            <label>Task Title</label>
                                            <input
                                                type="text"
                                                value={newTask.title}
                                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea
                                                value={newTask.description}
                                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                                required
                                                rows={3}
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Reward ($)</label>
                                                <input
                                                    type="number"
                                                    value={newTask.reward}
                                                    onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Deadline</label>
                                                <input
                                                    type="date"
                                                    value={newTask.deadline}
                                                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Requirements (one per line)</label>
                                            <textarea
                                                value={newTask.requirements}
                                                onChange={(e) => setNewTask({ ...newTask, requirements: e.target.value })}
                                                placeholder="Requirement 1&#10;Requirement 2&#10;Requirement 3"
                                                rows={4}
                                            />
                                        </div>
                                        <div className="modal-actions">
                                            <button type="button" className="btn btn-outline" onClick={() => setShowTaskForm(false)}>Cancel</button>
                                            <button type="submit" className="btn btn-primary">Create Task</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {showAssignModal && (
                            <div className="modal-overlay">
                                <div className="modal glass-card">
                                    <div className="modal-header">
                                        <h2>Assign Task to User</h2>
                                        <button className="modal-close" onClick={() => setShowAssignModal(false)}>×</button>
                                    </div>
                                    <div className="assign-form">
                                        <div className="form-group">
                                            <label>Select User</label>
                                            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                                                <option value="">Choose a user...</option>
                                                {users.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="modal-actions">
                                            <button className="btn btn-outline" onClick={() => setShowAssignModal(false)}>Cancel</button>
                                            <button className="btn btn-primary" onClick={handleAssignTask}>Assign Task</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="tasks-list">
                            {tasks.map(task => (
                                <div key={task.id} className="admin-task-card glass-card">
                                    <div className="task-header">
                                        <h3>{task.title}</h3>
                                        <span className="task-reward">${task.reward.toLocaleString('en-US')}</span>
                                    </div>
                                    <p className="task-description">{task.description}</p>
                                    <div className="task-meta">
                                        <span>Deadline: {new Date(task.deadline).toLocaleDateString('en-IN')}</span>
                                        <span className={`task-status ${task.status}`}>{task.status}</span>
                                    </div>
                                    <div className="task-actions">
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => {
                                                setSelectedTask(task.id);
                                                setShowAssignModal(true);
                                            }}
                                        >
                                            Assign to User
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteTask(task.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'submissions' && (
                    <div className="dashboard-content">
                        <h1 className="dashboard-title">Review <span className="gradient-text">Submissions</span></h1>

                        <div className="submissions-list">
                            {submissions.map(submission => {
                                const submissionUser = users.find(u => u.id === submission.userId);
                                const task = tasks.find(t => t.id === submission.taskId);

                                return (
                                    <div key={submission.id} className="submission-card glass-card">
                                        <div className="submission-header">
                                            <div className="submission-user-info">
                                                <div className="user-avatar">{submissionUser?.name?.charAt(0) || 'U'}</div>
                                                <div>
                                                    <span className="user-name">{submissionUser?.name || 'Unknown'}</span>
                                                    <span className="user-email">{submissionUser?.email || ''}</span>
                                                </div>
                                            </div>
                                            <span className={`submission-status ${submission.status}`}>
                                                {submission.status}
                                            </span>
                                        </div>

                                        <div className="submission-task">
                                            <h4>{task?.title || 'Unknown Task'}</h4>
                                            <span className="task-reward">Reward: ${task?.reward?.toLocaleString('en-US') || 0}</span>
                                        </div>

                                        {submission.proofUrl && (
                                            <div className="submission-proof">
                                                <h5>Submitted Proof:</h5>
                                                <img src={submission.proofUrl} alt="Proof" className="proof-image" />
                                            </div>
                                        )}

                                        {submission.notes && (
                                            <div className="submission-notes">
                                                <h5>Notes:</h5>
                                                <p>{submission.notes}</p>
                                            </div>
                                        )}

                                        <div className="submission-meta">
                                            <span>Submitted: {new Date(submission.submittedAt).toLocaleString('en-IN')}</span>
                                        </div>

                                        {submission.status === 'pending' && (
                                            <div className="submission-actions">
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => handleApproveSubmission(submission.id)}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleRejectSubmission(submission.id)}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                        {submission.status === 'rejected' && submission.rejectionReason && (
                                            <div className="rejection-reason">
                                                <strong>Rejection Reason:</strong> {submission.rejectionReason}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {submissions.length === 0 && (
                                <div className="empty-state glass-card">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14,2 14,8 20,8" />
                                    </svg>
                                    <h3>No submissions yet</h3>
                                    <p>Submissions from users will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
