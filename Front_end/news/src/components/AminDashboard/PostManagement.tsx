import React, {useEffect, useState} from "react";
import {Table, Button, Modal, Form, Input, message, Upload, Select} from "antd";
import axios from "axios";
import {UploadOutlined} from '@ant-design/icons';
import {UploadFile} from "antd/lib";

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
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
    const [fileLists, setFileLists] = useState<Record<number, UploadFile[]>>({}); // Định nghĩa kiểu cho fileLists với index là number
    const [extraFields, setExtraFields] =useState<ExtraField[]>([]); // Lưu danh sách trường động
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
    // Xử lý upload file lên
    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', ''); // Thay bằng upload preset

        try {
            const response = await axios.post(
                `https://localhost:8081/api/images/upload`, // Thay bằng cloud name
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            message.error('Tải hình ảnh thất bại!');
            throw error;
        }
    };
    const onFinish = async (values: any) => {
        console.log('Received values:', values);
    };

    const columns = [
        {title: "ID", dataIndex: "id", key: "id"},
        {title: "Tiêu đề", dataIndex: "title", key: "title"},
        {title: "Tác giả", dataIndex: "author", key: "author"},
        {title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt"},
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

    // Thêm trường input mới
    const addField = (type: 'text' | 'image') => {
        const newField = {
            id: Date.now(), // ID duy nhất cho trường
            type, // 'text' hoặc 'image'
        };
        setExtraFields([...extraFields, newField]);
    };
    // Xóa trường input
    const removeField = (id: number) => {
        setExtraFields(extraFields.filter((field) => field.id !== id));
        setFileLists((prev) => {
            const newFileLists = { ...prev };
            if (newFileLists.hasOwnProperty(id)) {
                delete newFileLists[id]; // Xóa key nếu tồn tại
            }
            return newFileLists;
        });
    };
    // Xử lý thay đổi file
    const handleFileChange = (fieldId: string | number) => ({ fileList }: { fileList: any[] }) => {
        setFileLists((prev) => ({
            ...prev,
            [fieldId]: fileList,
        }));
    };

    return (
        <div>
            <Button type="primary" onClick={handleAdd} className="mb-4">
                Thêm Bài Viết
            </Button>
            <Table dataSource={posts} columns={columns} rowKey="id" loading={loading}/>

            <Modal
                title={editingPost ? "Sửa Bài Viết" : "Thêm Bài Viết"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="author"
                        label="Tác giả"
                        rules={[{required: true, message: "Vui lòng nhập tác giả!"}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{required: true, message: "Vui lòng nhập tiêu đề!"}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Hình ảnh"
                        name="image"
                    >
                        <Upload
                            beforeUpload={() => false} // Ngăn upload tự động, xử lý thủ công trong handleSubmit
                            // fileList={fileLists['main'] || []}
                            onChange={handleFileChange('main')}
                            accept="image/*"
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined/>}>Chọn hình ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Nội dung"
                        rules={[{required: true, message: "Vui lòng nhập nội dung!"}]}
                    >
                        <Input.TextArea rows={4}/>
                    </Form.Item>
                    {/* Render các trường động */}
                    {extraFields.map((field) => (
                        <div
                            // key={field.id}
                            style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <Form.Item
                                name={`extra_${field.id}`}
                                label={field.type === 'text' ? 'Đoạn văn bổ sung' : 'Hình ảnh bổ sung'}
                                style={{ flex: 1, marginBottom: 0 }}
                            >
                                {field?.type === 'text' ? (
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
                            <Button
                                type="link"
                                danger
                                onClick={() => removeField(field.id)}
                                style={{ marginLeft: 8 }}
                            >
                                Xóa
                            </Button>
                        </div>
                    ))}

                    {/* Nút thêm trường */}
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
