import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext(null);
const USER_STORAGE_KEY = "ecobazar_user";
const TOKEN_STORAGE_KEY = "token";
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem(USER_STORAGE_KEY);
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(() => {
        try {
            return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
        } catch {
            return null;
        }
    });
    const isLoggedIn = !!(user && token);
    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
            localStorage.setItem(TOKEN_STORAGE_KEY, userToken);
        } catch (e) {
            console.error("Failed to save auth to localStorage", e);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        try {
            localStorage.removeItem(USER_STORAGE_KEY);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        } catch (e) {
            console.error("Failed to remove auth from localStorage", e);
        }
    };

    const updateUser = (updatedData) => {
        setUser((prev) => {
            const newUser = { ...prev, ...updatedData };
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
            return newUser;
        });
    };

    const firstLetter = user?.name ? user.name.trim().charAt(0).toUpperCase() : "";

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoggedIn,
                firstLetter,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
