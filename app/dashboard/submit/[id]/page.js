'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { getAllAssignments, getAllTasks, createSubmission, updateAssignment } from '../../../lib/data';

export default function SubmitProofPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [assignment, setAssignment] = useState(null);
    const [task, setTask] = useState(null);
    const [proofUrl, setProofUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (params.id) {
            const assignments = getAllAssignments();
            const found = assignments.find(a => a.id === params.id);
            if (found) {
                setAssignment(found);
                const tasks = getAllTasks();
                const foundTask = tasks.find(t => t.id === found.taskId);
                setTask(foundTask);
            }
        }
    }, [params.id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setProofUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!proofUrl) {
            alert('Please upload a screenshot or proof');
            return;
        }

        setSubmitting(true);

        // Update assignment to in_progress if pending
        if (assignment.status === 'pending') {
            updateAssignment(assignment.id, { status: 'in_progress' });
        }

        // Create submission
        createSubmission(assignment.id, user.id, task.id, proofUrl, notes);

        setSubmitting(false);
        router.push('/dashboard');
    };

    if (loading || !assignment || !task) {
        return <div className="dashboard-loading">Loading...</div>;
    }

    return (
        <div className="submit-page">
            <div className="submit-container">
                <div className="submit-card glass-card">
                    <div className="submit-header">
                        <Link href="/dashboard" className="back-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </Link>
                        <h1>Submit Proof</h1>
                    </div>

                    <div className="task-info">
                        <h2>{task.title}</h2>
                        <p>{task.description}</p>
                        <div className="task-meta">
                            <span className="reward">Reward: ₹{task.reward.toLocaleString('en-IN')}</span>
                            <span className={`status ${assignment.status}`}>{assignment.status.replace('_', ' ')}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="submit-form">
                        <div className="form-group">
                            <label>Upload Screenshot / Proof</label>
                            <div className="file-upload-area">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    id="proof-upload"
                                    className="file-input"
                                />
                                <label htmlFor="proof-upload" className="file-label">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="preview-image" />
                                    ) : (
                                        <div className="upload-placeholder">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17,8 12,3 7,8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                            <span>Click to upload or drag and drop</span>
                                            <span className="hint">PNG, JPG, GIF up to 10MB</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">Additional Notes (Optional)</label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any additional information about your submission..."
                                rows={4}
                            />
                        </div>

                        <div className="submit-actions">
                            <Link href="/dashboard" className="btn btn-outline">Cancel</Link>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Proof'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
