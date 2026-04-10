import { createContext, useContext, useEffect, useState } from "react";
import client from "../utils/api.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await client.get("/user/me");
                setUser(res.data.user);
            } catch (err) {
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
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message,
            };
        }
    };


    const login = async (formData) => {
        try {
            const res = await client.post("/user/login", formData);
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message,
            };
        }
    };


    const logout = async () => {
        await client.get("/user/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};