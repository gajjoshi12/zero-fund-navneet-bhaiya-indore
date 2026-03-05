// Data management functions — all backed by Django API
import api from './api';

// ─── Tasks ─────────────────────────────────────────────────────────────────

export async function getAllTasks() {
    const res = await api.get('/tasks/');
    return res.data || [];
}

export async function getTaskById(id) {
    const res = await api.get(`/tasks/${id}/`);
    return res.data || null;
}

export async function createTask(task) {
    const res = await api.post('/tasks/', task);
    return res.data || null;
}

export async function deleteTask(id) {
    await api.del(`/tasks/${id}/`);
}

// ─── Assignments ───────────────────────────────────────────────────────────

export async function claimTask(taskId) {
    const res = await api.post(`/tasks/${taskId}/claim/`);
    return res.data || null;
}

export async function getUserAssignments() {
    const res = await api.get('/assignments/');
    return res.data || [];
}

export async function adminAssignTask(taskId, srUserId) {
    const res = await api.post('/assignments/assign/', { task_id: taskId, sr_user_id: srUserId });
    return res.data || null;
}

// ─── Submissions ───────────────────────────────────────────────────────────

export async function getAllSubmissions() {
    const res = await api.get('/submissions/');
    return res.data || [];
}

export async function createSubmission(assignmentId, proofUrl, notes) {
    const res = await api.post('/submissions/', {
        assignment_id: assignmentId,
        proof_url: proofUrl,
        notes: notes,
    });
    return res.data || null;
}

export async function approveSubmission(submissionId) {
    const res = await api.post(`/submissions/${submissionId}/approve/`);
    return res;
}

export async function rejectSubmission(submissionId, reason) {
    const res = await api.post(`/submissions/${submissionId}/reject/`, { reason });
    return res;
}

// ─── Stats ─────────────────────────────────────────────────────────────────

export async function getAdminStats() {
    const res = await api.get('/stats/admin/');
    return res.data || {};
}

export async function getUserStats() {
    const res = await api.get('/stats/user/');
    return res.data || {};
}

// ─── Admin User Management ─────────────────────────────────────────────────

export async function getAllUsers() {
    const res = await api.get('/admin/users/');
    return res.data || [];
}

export async function toggleUserStatus(srUserId) {
    const res = await api.patch(`/admin/users/${srUserId}/status/`);
    return res;
}

// ─── MT5 ───────────────────────────────────────────────────────────────────

export async function getGroupList() {
    const res = await api.get('/groups/');
    return res.data || [];
}

export async function createMT5Account(group, leverage, mainPassword, investorPassword) {
    const res = await api.post('/mt5/create/', {
        group,
        leverage,
        main_password: mainPassword,
        investor_password: investorPassword,
    });
    return res;
}

// ─── Funded Accounts ───────────────────────────────────────────────────────

export async function getFundedAccounts() {
    const res = await api.get('/funded-accounts/');
    return res.data || [];
}

export async function saveFundedAccount(data) {
    const res = await api.post('/funded-accounts/', data);
    return res;
}

// ─── Notifications ─────────────────────────────────────────────────────────

export async function getNotifications() {
    const res = await api.get('/notifications/');
    return res;
}

export async function markNotificationRead(id) {
    const res = await api.post(`/notifications/${id}/read/`);
    return res;
}

export async function markAllNotificationsRead() {
    const res = await api.post('/notifications/read-all/');
    return res;
}

// ─── Profile ───────────────────────────────────────────────────────────────

export async function updateProfile(data) {
    const res = await api.patch('/profile/update/', data);
    return res;
}

