import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
}

export default function PostManagement() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/api/posts");
            setPosts(res.data);
        } catch (error) {
            message.error("Lỗi khi tải danh sách bài viết");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingPost(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        form.setFieldsValue(post);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                await axios.delete(`http://localhost:8080/api/posts/${id}`);
                message.success("Xóa bài viết thành công");
                fetchPosts();
            } catch (error) {
                message.error("Xóa bài viết thất bại");
            }
        }
    };

    const onFinish = async (values: any) => {
        try {
            if (editingPost) {
                await axios.put(`http://localhost:8080/api/posts/${editingPost.id}`, values);
                message.success("Cập nhật bài viết thành công");
            } else {
                await axios.post("http://localhost:8080/api/posts", values);
                message.success("Thêm bài viết thành công");
            }
            setIsModalVisible(false);
            fetchPosts();
        } catch (error) {
            message.error("Lỗi khi lưu bài viết");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Tiêu đề", dataIndex: "title", key: "title" },
        { title: "Tác giả", dataIndex: "author", key: "author" },
        { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt" },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: Post) => (
                <div className="flex gap-2">
                    <Button onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>Xóa</Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleAdd} className="mb-4">
                Thêm Bài Viết
            </Button>
            <Table dataSource={posts} columns={columns} rowKey="id" loading={loading} />

            <Modal
                title={editingPost ? "Sửa Bài Viết" : "Thêm Bài Viết"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Nội dung"
                        rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {editingPost ? "Cập nhật" : "Thêm"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
