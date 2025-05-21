import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../page/LoginAndResigter/AuthModal';

interface Comment {
    userName: string;
    content: string;
}

const CommentBox = ({ articleId }: { articleId: string }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [authType, setAuthType] = useState<"login" | "register">("login");

    const { user } = useAuth();

    // Load bình luận từ localStorage mỗi khi articleId thay đổi
    useEffect(() => {
        const savedComments = localStorage.getItem(`comments_${articleId}`);
        if (savedComments) {
            setComments(JSON.parse(savedComments));
        } else {
            setComments([]);
        }
        setComment('');
    }, [articleId]);

    // Hàm lưu bình luận vào localStorage
    const saveComments = (newComments: Comment[]) => {
        setComments(newComments);
        localStorage.setItem(`comments_${articleId}`, JSON.stringify(newComments));
    };

    const handleFocus = () => {
        if (!user) {
            setAuthType("login");
            setModalVisible(true);
        }
    };

    const handlePostComment = () => {
        if (!user) {
            setAuthType("login");
            setModalVisible(true);
            return;
        }

        if (comment.trim() !== '') {
            const userName = user?.name || user?.username || "Người dùng";
            const newComments = [{ userName, content: comment }, ...comments];
            saveComments(newComments);
            setComment('');
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <div style={{ marginTop: 40, padding: 20, borderTop: "2px solid #ddd" }}>
            <h2 style={{ marginBottom: 20, color: "#0E6830" }}>💬 Bình luận bài viết</h2>
            <textarea
                style={{
                    width: "100%",
                    height: 100,
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    fontSize: 16,
                    resize: "none"
                }}
                placeholder="Viết bình luận của bạn..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onFocus={handleFocus}
                disabled={!user}
            ></textarea>
            <button
                style={{
                    marginTop: 10,
                    padding: "10px 20px",
                    backgroundColor: "#0E6830",
                    color: "#fff",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer"
                }}
                onClick={handlePostComment}
            >
                Gửi bình luận
            </button>

            {/* Modal đăng nhập */}
            <AuthModal
                visible={modalVisible}
                onClose={closeModal}
                type={authType}
            />

            {/* Hiển thị các bình luận */}
            <div style={{ marginTop: 30 }}>
                {comments.length === 0 ? (
                    <p style={{ fontStyle: "italic", color: "#888" }}>Chưa có bình luận nào.</p>
                ) : (
                    comments.map((cmt, idx) => (
                        <div key={idx} style={{
                            backgroundColor: "#f9f9f9",
                            padding: 12,
                            marginBottom: 10,
                            borderRadius: 6,
                            border: "1px solid #ddd"
                        }}>
                            <b>{cmt.userName}</b>: {cmt.content}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentBox;
