import { createContext, useContext, useEffect, useState } from "react";
import client from "../utils/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await client.get("/user/me");
                setUser(res.data.user);
            } catch (err) {
                console.error("Auth check failed", err);
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const signup = async (formData) => {
        try {
            const res = await client.post("/user/signup", formData);
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Signup failed" };
        }
    };

    const login = async (formData) => {
        try {
            const res = await client.post("/user/login", formData);
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Invalid credentials" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};