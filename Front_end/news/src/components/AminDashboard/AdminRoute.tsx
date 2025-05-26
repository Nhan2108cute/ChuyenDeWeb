import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Đảm bảo user.accountType được kiểm tra đúng kiểu number
    if (user.accountType !== 0) {
        return <div style={{ padding: 16, color: "red", fontWeight: "bold" }}>
            Bạn không có quyền
        </div>;
    }

    return <>{children}</>;
};

export default AdminRoute;
