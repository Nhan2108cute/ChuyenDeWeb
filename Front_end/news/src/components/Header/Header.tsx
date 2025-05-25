import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../../page/LoginAndResigter/AuthModal";
import { useAuth } from "../../context/AuthContext";
import { message } from "antd";

const Header = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [authType, setAuthType] = useState<"login" | "register">("login");
    const [searchTerm, setSearchTerm] = useState("");

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const openModal = (type: "login" | "register") => {
        setAuthType(type);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleLogout = () => {
        message.success("Đăng xuất thành công, hẹn gặp lại bạn!");
        logout();
    };

    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
        }
    };

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
            {/* Logo */}
            <div
                style={{ fontWeight: "bold", fontSize: 24, color: "#0E6830", cursor: "pointer" }}
                onClick={() => navigate("/category/trang-chu")}
            >
                Dân Trí
            </div>

            {/* Thanh tìm kiếm */}
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm tiêu đề bài viết..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                    style={{
                        padding: "6px 12px",
                        borderRadius: 4,
                        border: "1px solid #ccc",
                        width: 300,
                        fontSize: 14,
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        marginLeft: 8,
                        padding: "6px 12px",
                        borderRadius: 4,
                        border: "1px solid #0E6830",
                        backgroundColor: "#0E6830",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                >
                    Tìm
                </button>
            </div>

            {/* Đăng nhập/Đăng xuất */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {user ? (
                    <>
            <span style={{ color: "#0E6830", fontWeight: "bold" }}>
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
                            onClick={handleLogout}
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

            {/* Modal đăng nhập/đăng ký */}
            <AuthModal visible={modalVisible} onClose={closeModal} type={authType} />
        </header>
    );
};

export default Header;
