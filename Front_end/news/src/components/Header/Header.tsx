import React, { useState } from "react";
import AuthModal from "../../page/LoginAndResigter/AuthModal";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Header = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [authType, setAuthType] = useState<"login" | "register">("login");
    const { user, logout } = useAuth();

    const openModal = (type: "login" | "register") => {
        setAuthType(type);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };
    const navigate = useNavigate();
    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                height: 60,
                borderBottom: "1px solid #ddd",
            }}
        >
            {/* Logo bên trái */}
            <div
                style={{fontWeight: "bold", fontSize: 24, color: "#0E6830", cursor: "pointer"}}
                onClick={() => navigate("/category/trang-chu")}
            >
                Dân Trí
            </div>


            {/* Phần bên phải */}
            <div style={{display: "flex", alignItems: "center", gap: 12}}>
                {user ? (
                    <>
        <span style={{color: "#1890ff", fontWeight: "bold"}}>
            👤 {user.name || user.username || "Người dùng"}
        </span>
                        <button
                            style={{
                                padding: "6px 12px",
                                cursor: "pointer",
                                borderRadius: 4,
                                border: "1px solid red",
                                backgroundColor: "white",
                                color: "red",
                                fontWeight: "600",
                            }}
                            onClick={logout}
                        >
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            style={{
                                padding: "6px 12px",
                                cursor: "pointer",
                                borderRadius: 4,
                                border: "1px solid #0E6830",
                                backgroundColor: "white",
                                color: "#0E6830",
                                fontWeight: "600",
                            }}
                            onClick={() => openModal("login")}
                        >
                            Đăng nhập
                        </button>

                        <button
                            style={{
                                padding: "6px 12px",
                                cursor: "pointer",
                                borderRadius: 4,
                                border: "none",
                                backgroundColor: "#0E6830",
                                color: "white",
                                fontWeight: "600",
                            }}
                            onClick={() => openModal("register")}
                        >
                            Đăng ký
                        </button>
                    </>
                )}
            </div>

            {/* Modal */}
            <AuthModal visible={modalVisible} onClose={closeModal} type={authType}/>
        </header>
    );
};

export default Header;
