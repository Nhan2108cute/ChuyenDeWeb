import React, { createContext, useContext, useState } from "react";

// 🧠 Bước 1: Định nghĩa kiểu User
interface User {
    username: string;
    name?: string;
    email?: string;
}

// 🧠 Bước 2: Định nghĩa kiểu cho AuthContext
interface AuthContextType {
    user: User | null;
    login: (userInfo: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); // 👈 dùng User thay vì string

    const login = (userInfo: User) => {
        setUser(userInfo); // 👈 nhận object User
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
