import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const UserManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal thêm người dùng
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm] = Form.useForm();

    // Lấy danh sách user
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8081/api/auth/users");
            setUsers(res.data);
        } catch (error) {
            message.error("Lấy danh sách người dùng thất bại!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        addForm.resetFields();
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Tên đăng nhập", dataIndex: "username", key: "username" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
        {
            title: "Loại tài khoản",
            dataIndex: "accountType",
            key: "accountType",
            render: (value: number) => {
                switch (value) {
                    case 0: return "Admin 👑";
                    case 1: return "Thường";
                    case 2: return "Premium ⭐";
                    default: return "Chưa xác định";
                }
            }
        },
        {
            title: "Ngày sinh",
            dataIndex: "birthday",
            key: "birthday",
            render: (date: string) => date ? moment(date).format("DD/MM/YYYY") : "-"
        }
    ];

    return (
        <>
            <h2>Quản lý người dùng 👑</h2>
            <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
                Thêm người dùng
            </Button>

            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title="Thêm người dùng mới"
                visible={isAddModalOpen}
                onCancel={closeAddModal}
                footer={null}
            >
                <Form
                    form={addForm}
                    layout="vertical"
                    onFinish={async (values) => {
                        try {
                            await axios.post("http://localhost:8081/api/auth/register", {
                                ...values,
                                birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null
                            });

                            message.success("Thêm người dùng thành công!");
                            closeAddModal();
                            fetchUsers();

                        } catch (error: any) {
                            const data = error.response?.data;
                            const errorMsg = typeof data === "string" ? data : (data?.message || JSON.stringify(data) || "Đã xảy ra lỗi!");
                            message.error(errorMsg);
                        }
                    }}
                >
                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu!" },
                            { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                            {
                                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                                message: "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số!"
                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>


                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="accountType"
                        label="Loại tài khoản"
                        rules={[{ required: true, message: "Vui lòng chọn loại tài khoản!" }]}
                        initialValue={1}
                    >
                        <Select>
                            <Select.Option value={0}>Admin</Select.Option>
                            <Select.Option value={1}>Thường</Select.Option>
                            <Select.Option value={2}>Premium</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="birthday"
                        label="Ngày sinh"
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Thêm người dùng
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserManagement;
