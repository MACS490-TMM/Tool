import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('x-jwt-token'));

    const login = (newToken) => {
        localStorage.setItem('x-jwt-token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('x-jwt-token');
        setToken(null);
    };

    const isAuthenticated = () => {
        return token != null;
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
