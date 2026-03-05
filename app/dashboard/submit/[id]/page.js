'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { getUserAssignments, createSubmission } from '../../../lib/data';

export default function SubmitPage({ params }) {
    const resolvedParams = use(params);
    const assignmentId = resolvedParams.id;

    const { user, loading } = useAuth();
    const router = useRouter();
    const [assignment, setAssignment] = useState(null);
    const [proofUrl, setProofUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user && assignmentId) {
            loadAssignment();
        }
    }, [user, assignmentId]);

    const loadAssignment = async () => {
        try {
            const assignments = await getUserAssignments();
            const found = assignments.find(a => a.id === parseInt(assignmentId));
            setAssignment(found || null);
        } catch (err) {
            console.error('Failed to load assignment:', err);
        } finally {
            setPageLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await createSubmission(parseInt(assignmentId), proofUrl, notes);
            setSubmitted(true);
        } catch (err) {
            setError('Failed to submit proof. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || pageLoading) {
        return <div className="dashboard-loading">Loading...</div>;
    }

    if (!user) return null;

    if (submitted) {
        return (
            <div className="submit-page">
                <div className="submit-container">
                    <div className="submit-card glass-card success-card">
                        <div className="success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22,4 12,14.01 9,11.01" />
                            </svg>
                        </div>
                        <h2>Proof Submitted!</h2>
                        <p>Your submission has been sent for review. You&apos;ll be notified once an admin reviews it.</p>
                        <Link href="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="submit-page">
                <div className="submit-container">
                    <div className="submit-card glass-card">
                        <h2>Assignment Not Found</h2>
                        <p>This assignment could not be found or does not belong to you.</p>
                        <Link href="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
                    </div>
                </div>
            </div>
        );
    }

    const task = assignment.task;

    return (
        <div className="submit-page">
            <div className="submit-container">
                <div className="submit-header">
                    <Link href="/dashboard" className="back-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12,19 5,12 12,5" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>

                <div className="submit-card glass-card">
                    <div className="task-info-section">
                        <h2>{task?.title || 'Task'}</h2>
                        <p className="task-description">{task?.description || ''}</p>
                        <div className="task-reward-badge">
                            <span className="label">Reward:</span>
                            <span className="value">${Number(task?.reward || 0).toLocaleString('en-US')}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="submit-form">
                        <h3>Submit Your Proof</h3>

                        {error && <div className="auth-error">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="proofUrl">Proof URL (Screenshot/Drive link)</label>
                            <input
                                type="url"
                                id="proofUrl"
                                value={proofUrl}
                                onChange={(e) => setProofUrl(e.target.value)}
                                placeholder="https://drive.google.com/... or image link"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">Additional Notes</label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Describe what you did to complete this task..."
                                rows={4}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Proof'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
