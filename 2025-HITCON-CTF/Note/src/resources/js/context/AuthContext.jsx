import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        try {
            // Try to parse the stored user, if it fails, return null
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            return null;
        }
    });
    const [token, setToken] = useState(localStorage.getItem('auth_token'));

    const login = (userData, authToken) => {
        // Ensure userData is an object before stringifying
        if (typeof userData === 'object' && userData !== null) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.setItem('user', userData); // Or handle as an error
        }
        localStorage.setItem('auth_token', authToken);
        setUser(userData);
        setToken(authToken);
    };

    const logout = async () => {
        await fetch(window.origin + '/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
