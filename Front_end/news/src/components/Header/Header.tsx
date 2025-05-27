import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthModal from "../../page/LoginAndResigter/AuthModal";
import { useAuth } from "../../context/AuthContext";
import { message } from "antd";
import { useTranslation } from "react-i18next";

const Header = () => {
    const { t, i18n } = useTranslation();

    console.log(i18n);
    console.log(typeof i18n.changeLanguage);

    const [modalVisible, setModalVisible] = useState(false);
    const [authType, setAuthType] = useState<"login" | "register">("login");

    const location = useLocation();
    const navigate = useNavigate();

    const queryParam = new URLSearchParams(location.search).get("query") || "";
    const [searchTerm, setSearchTerm] = useState(queryParam);

    useEffect(() => {
        setSearchTerm(queryParam);
    }, [queryParam]);

    const { user, logout } = useAuth();

    const openModal = (type: "login" | "register") => {
        setAuthType(type);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleLogout = () => {
        logout();
        message.success(t("logout") + " thành công!");
        navigate("/category/trang-chu");
    };

    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleUserClick = () => {
        if (!user) {
            openModal("login");
            return;
        }

        if (user?.accountType === 0) {
            navigate("/admin-dashboard");
        } else {
            navigate("/user-info");
        }
    };

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
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
            <div
                style={{ fontWeight: "bold", fontSize: 24, color: "#0E6830", cursor: "pointer" }}
                onClick={() => navigate("/category/trang-chu")}
            >
                Báo Chí
            </div>

            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
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
                    {t("search")}
                </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={toggleLanguage} style={{ fontSize: 20, border: "none", background: "none", cursor: "pointer" }}>
                    {i18n.language === "vi" ? "🇺🇸" : "🇻🇳"}
                </button>

                {user ? (
                    <>
                        <button
                            onClick={handleUserClick}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#0E6830",
                                fontWeight: "bold",
                                cursor: "pointer",
                                padding: 0,
                                fontSize: 16,
                            }}
                            title="Xem trang quản lý hoặc thông tin người dùng"
                        >
                            {t("greeting", { name: user.name || user.username || "Người dùng" })}
                        </button>

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
                            {t("logout")}
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
                            {t("login")}
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
                            {t("register")}
                        </button>
                    </>
                )}
            </div>

            <AuthModal visible={modalVisible} onClose={closeModal} type={authType} />
        </header>
    );
};

export default Header;
