import React, { useState } from "react";
import UserManagement from "./UserManagement";
import PostManagement from "./PostManagement";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<"none" | "users" | "posts">("none");

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Giao diện mặc định khi chưa chọn gì */}
                {activeTab === "none" && (
                    <>
                        <h1 className="text-3xl font-bold mb-6">Trang quản trị Admin 👑</h1>
                        <div className="flex gap-4">
                            <button
                                className="bg-[rgb(14,104,48)] hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition duration-300"
                                onClick={() => setActiveTab("users")}
                            >
                                👤 Quản lý Người dùng
                            </button>
                            <button
                                className="bg-[rgb(14,104,48)] hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition duration-300"
                                onClick={() => setActiveTab("posts")}
                            >
                                📝 Quản lý Bài Viết
                            </button>
                        </div>

                    </>
                )}

                {/* Khi chọn Quản lý Người dùng */}
                {activeTab === "users" && (
                    <>
                        <h2 className="text-2xl font-semibold mb-4"></h2>
                        <UserManagement/>
                        <button
                            className="mt-6 bg-gray-400 text-white px-4 py-2 rounded"
                            onClick={() => setActiveTab("none")}
                        >
                            ⬅️ Quay lại
                        </button>
                    </>
                )}

                {/* Khi chọn Quản lý Bài Viết */}
                {activeTab === "posts" && (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">Quản lý bài viết 📝</h2>
                        <PostManagement />
                        <button
                            className="mt-6 bg-gray-400 text-white px-4 py-2 rounded"
                            onClick={() => setActiveTab("none")}
                        >
                            ⬅️ Quay lại
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
