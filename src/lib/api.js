const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export function getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

export function setToken(token) {
    localStorage.setItem('token', token);
}

export function removeToken() {
    localStorage.removeItem('token');
}

export async function api(path, options = {}) {
    const token = getToken();
    const headers = { ...options.headers };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (
        options.body &&
        typeof options.body === 'string' &&
        !headers['Content-Type']
    ) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        removeToken();
        if (typeof window !== 'undefined') {
            window.location.href = '/?sessionExpired=true';
        }
        throw new Error('Unauthorized');
    }

    const text = await res.text();
    if (!text) {
        if (res.ok) return { success: true };
        throw new Error(`Request failed with status ${res.status}`);
    }

    const data = JSON.parse(text);
    if (!data.success) {
        const errMsg = data.message || data.error || 'API request failed';
        throw new Error(
            typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg),
        );
    }
    return data;
}

// auth
export const authApi = {
    getGoogleUrl: () => api('/api/auth/google/url'),
    googleCallback: (code) =>
        api(`/api/auth/google/callback?code=${encodeURIComponent(code)}`),
    verifyEmail: (token) => api(`/api/auth/verify-email?token=${token}`),
    resendVerification: () =>
        api('/api/auth/resend-verification', { method: 'POST' }),
    getMe: () => api('/api/auth/me'),
    updateMe: (data) =>
        api('/api/auth/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

// onboarding
export const onboardingApi = {
    submitBaseline: (data) =>
        api('/api/onboarding/baseline', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    getBaseline: () => api('/api/onboarding/baseline'),
    updateBaseline: (data) =>
        api('/api/onboarding/baseline', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

// mood tracking
export const moodApi = {
    create: (data) =>
        api('/api/mood', { method: 'POST', body: JSON.stringify(data) }),
    list: (from, to, limit = 30) => {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        if (limit) params.set('limit', limit);
        return api(`/api/mood?${params}`);
    },
    today: () => api('/api/mood/today'),
};

// analytics
export const analyticsApi = {
    generate: (periodType) =>
        api('/api/analytics/generate', {
            method: 'POST',
            body: JSON.stringify({ period_type: periodType }),
        }),
    list: (limit = 10) => api(`/api/analytics?limit=${limit}`),
};

// reports
export const reportsApi = {
    generate: (data) =>
        api('/api/reports/generate', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    list: (limit = 10) => api(`/api/reports?limit=${limit}`),
    get: (id) => api(`/api/reports/${id}`),
};

// notes
export const notesApi = {
    create: (data) =>
        api('/api/notes', { method: 'POST', body: JSON.stringify(data) }),
    list: (label, limit = 50) => {
        const params = new URLSearchParams();
        if (label) params.set('label', label);
        if (limit) params.set('limit', limit);
        return api(`/api/notes?${params}`);
    },
    labels: () => api('/api/notes/labels'),
    get: (id) => api(`/api/notes/${id}`),
    update: (id, data) =>
        api(`/api/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: (id) => api(`/api/notes/${id}`, { method: 'DELETE' }),
};

// chats
export const chatsApi = {
    create: (chatType = 'companion') =>
        api('/api/chats', {
            method: 'POST',
            body: JSON.stringify({ chat_type: chatType }),
        }),
    list: (limit = 20) => api(`/api/chats?limit=${limit}`),
    get: (id) => api(`/api/chats/${id}`),
    update: (id, data) =>
        api(`/api/chats/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: (id) => api(`/api/chats/${id}`, { method: 'DELETE' }),
    messages: (id, limit = 50) =>
        api(`/api/chats/${id}/messages?limit=${limit}`),
    sendMessage: (id, message) =>
        api(`/api/chats/${id}/messages`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        }),
};

// content
export const contentApi = {
    list: (limit = 20, offset = 0) =>
        api(`/api/content?limit=${limit}&offset=${offset}`),
    get: (id) => api(`/api/content/${id}`),
    getBySlug: (slug) => api(`/api/content/slug/${slug}`),
    create: (data) =>
        api('/api/content', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) =>
        api(`/api/content/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: (id) => api(`/api/content/${id}`, { method: 'DELETE' }),
    uploadCover: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api(`/api/content/${id}/cover`, {
            method: 'POST',
            body: formData,
        });
    },
};

// logs
export const logsApi = {
    auth: (page = 1, perPage = 20) =>
        api(`/api/logs/auth?page=${page}&per_page=${perPage}`),
    activity: (page = 1, perPage = 20, feature) => {
        const params = new URLSearchParams({
            page: String(page),
            per_page: String(perPage),
        });
        if (feature) params.set('feature', feature);
        return api(`/api/logs/activity?${params}`);
    },
    admin: (page = 1, perPage = 20, feature) => {
        const params = new URLSearchParams({
            page: String(page),
            per_page: String(perPage),
        });
        if (feature) params.set('feature', feature);
        return api(`/api/logs/admin?${params}`);
    },
};
