import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('x-jwt-token'));

    useEffect(() => {
        if (token) {
            if (!isAuthenticated()) {
                logout().then(r => console.log(r)); // Auto-logout if token is invalid or expired
            }
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('x-jwt-token', newToken);
        setToken(newToken);
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:8080/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            localStorage.removeItem('x-jwt-token');
            setToken(null);
        } catch (e) {
            console.error('Failed to logout:', e);
        }
    };

    const getUserRole = () => {
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.userRole; // Assuming 'userRole' is a part of the JWT claims
        } catch (e) {
            return null;
        }
    };

    const getUserName = () => {
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.username; // Assuming 'username' is a part of the JWT claims
        } catch (e) {
            return null;
        }
    };

    const isAuthenticated = () => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp >= currentTime;

        } catch (e) {
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, getUserRole, getUserName }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
