// Centralized API client for Django backend
const API_BASE = 'http://localhost:8000/api';

function getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('sr_token');
}

function getUserId() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('sr_user');
    if (user) {
        try { return JSON.parse(user).id; } catch { return null; }
    }
    return null;
}

async function request(endpoint, options = {}) {
    const token = getToken();
    const userId = getUserId();

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ?{token}` }),
        ...(userId && { 'X-SR-User-Id': String(userId) }),
        ...options.headers,
    };

    const response = await fetch(`?{API_BASE}?{endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    return data;
}

export const api = {
    get: (endpoint) => request(endpoint, { method: 'GET' }),
    post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    del: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default api;
