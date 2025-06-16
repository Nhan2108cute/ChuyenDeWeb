import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Upload, Select } from "antd";
import axios from "axios";
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from "antd/lib";

interface Post {
    id: number;
    title: string;
    author: string;
    createdAt: string;
    imageId?: string;
    contents: {
        type: 'text' | 'image';
        content: string;
    }[];
}

interface ExtraField {
    id: number;
    type: 'text' | 'image';
}

export default function PostManagement() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [form] = Form.useForm();
    const [fileLists, setFileLists] = useState<Record<string | number, UploadFile[]>>({});
    const [extraFields, setExtraFields] = useState<ExtraField[]>([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8081/api/articles");
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
        setExtraFields([]);
        setFileLists({});
        setIsModalVisible(true);
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setIsModalVisible(true);
    };

    useEffect(() => {
        if (editingPost && isModalVisible) {
            form.setFieldsValue({
                author: editingPost.author,
                title: editingPost.title,
                content: editingPost.contents.find(c => c.type === 'text')?.content || '',
            });

            if (editingPost.imageId) {
                setFileLists(prev => ({
                    ...prev,
                    main: [{
                        uid: '-1',
                        name: 'Ảnh đại diện',
                        status: 'done',
                        url: editingPost.imageId,
                    }],
                }));
            }

            const dynamicFields = editingPost.contents
                .filter((c, index) => index > 0)
                .map((c) => ({
                    id: Date.now() + Math.random(),
                    type: c.type,
                }));

            setExtraFields(dynamicFields);

            dynamicFields.forEach((field, i) => {
                if (field.type === 'text') {
                    form.setFieldValue(`extra_${field.id}`, editingPost.contents[i + 1].content);
                } else if (field.type === 'image') {
                    setFileLists((prev) => ({
                        ...prev,
                        [field.id]: [{
                            uid: `-${field.id}`,
                            name: 'Ảnh bổ sung',
                            status: 'done',
                            url: editingPost.contents[i + 1].content,
                        }],
                    }));
                }
            });
        }
    }, [editingPost, isModalVisible]);

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                await axios.delete(`http://localhost:8081/api/auth/articles/${id}`);
                message.success("Xóa bài viết thành công");
                fetchPosts();
            } catch (error) {
                message.error("Xóa bài viết thất bại");
            }
        }
    };

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post("http://localhost:8081/api/images/upload", formData);
            return response.data.secure_url;
        } catch (error) {
            message.error('Tải hình ảnh thất bại!');
            throw error;
        }
    };

    const onFinish = async (values: any) => {
        console.log('Received values:', values);
        // TODO: Submit form for create or update
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

    const addField = (type: 'text' | 'image') => {
        const newField = {
            id: Date.now(),
            type,
        };
        setExtraFields([...extraFields, newField]);
    };

    const removeField = (id: number) => {
        setExtraFields(extraFields.filter((field) => field.id !== id));
        setFileLists(prev => {
            const newFileLists = { ...prev };
            delete newFileLists[id];
            return newFileLists;
        });
    };

    const handleFileChange = (fieldId: string | number) => ({ fileList }: { fileList: any[] }) => {
        setFileLists(prev => ({
            ...prev,
            [fieldId]: fileList,
        }));
    };

    return (
        <div>
            <Button type="primary" onClick={handleAdd} className="mb-4">
                Thêm Bài Viết
            </Button>
            <Table dataSource={posts} columns={columns} rowKey="id" loading={loading} />

            <Modal
                title={editingPost ? "Sửa Bài Viết" : "Thêm Bài Viết"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="author" label="Tác giả" rules={[{ required: true, message: "Vui lòng nhập tác giả!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="image" label="Hình ảnh">
                        <Upload
                            beforeUpload={() => false}
                            onChange={handleFileChange('main')}
                            accept="image/*"
                            fileList={fileLists['main'] || []}
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    {extraFields.map(field => (
                        <div key={field.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <Form.Item
                                name={`extra_${field.id}`}
                                label={field.type === 'text' ? 'Đoạn văn bổ sung' : 'Hình ảnh bổ sung'}
                                style={{ flex: 1, marginBottom: 0 }}
                            >
                                {field.type === 'text' ? (
                                    <Input.TextArea rows={4} />
                                ) : (
                                    <Upload
                                        beforeUpload={() => false}
                                        fileList={fileLists[field.id] || []}
                                        onChange={handleFileChange(field.id)}
                                        accept="image/*"
                                        listType="picture"
                                    >
                                        <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                                    </Upload>
                                )}
                            </Form.Item>
                            <Button type="link" danger onClick={() => removeField(field.id)} style={{ marginLeft: 8 }}>
                                Xóa
                            </Button>
                        </div>
                    ))}

                    <Form.Item>
                        <Select
                            style={{ width: 200, marginBottom: 16 }}
                            placeholder="Chọn loại nội dung"
                            onChange={(value) => addField(value)}
                        >
                            <Select.Option value="text">Đoạn văn</Select.Option>
                            <Select.Option value="image">Hình ảnh</Select.Option>
                        </Select>
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
