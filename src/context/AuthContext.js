'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { authApi, getToken, removeToken, setToken } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const data = await authApi.getMe();
            setUser(data.data);
        } catch {
            setUser(null);
            removeToken();
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = (token, userData) => {
        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        removeToken();
        setUser(null);
        window.location.href = '/';
    };

    const refreshUser = useCallback(async () => {
        await fetchUser();
    }, [fetchUser]);

    return (
        <AuthContext.Provider
            value={{ user, loading, login, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
