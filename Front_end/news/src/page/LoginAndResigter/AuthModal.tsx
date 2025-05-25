import React from "react";
import { Modal, Button, Form, Input, DatePicker, message } from "antd";
import { useAuth } from "../../context/AuthContext"; // chỉnh đúng path
import axios from "axios";
type AuthModalProps = {
    visible: boolean;
    onClose: () => void;
    type: "login" | "register";
};

const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, type }) => {
    const [form] = Form.useForm();

    const { login } = useAuth();
    const onFinish = async (values: any) => {
        try {
            if (type === "login") {
                const response = await axios.post("http://localhost:8081/api/auth/login", {
                    username: values.username,
                    password: values.password,
                });

                // Nếu backend trả về token hoặc dữ liệu user
                login({
                    username: values.username,
                    name: response.data.name || "Người dùng",
                });
                message.success("Đăng nhập thành công!");
            } else {
                await axios.post("http://localhost:8081/api/auth/register", {
                    username: values.username,
                    password: values.password,
                    email: values.email,
                    phone: values.phone,
                    birthday: values.birthday.format("YYYY-MM-DD"), // chuyển moment thành string
                });

                message.success("Đăng ký thành công!");
            }

            form.resetFields();
            onClose();
        }catch (error: any) {
                const data = error.response?.data;
                const errorMsg = typeof data === "string" ? data : (data?.message || JSON.stringify(data) || "Đã xảy ra lỗi!");
                message.error(errorMsg);
            }

        };


    const handleForgotPassword = () => {
        message.info("Tính năng 'Quên mật khẩu' đang được phát triển");
    };

    return (
        <Modal
            title={type === "login" ? "Đăng nhập" : "Đăng ký"}
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
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
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                >
                    <Input.Password />
                </Form.Item>

                {type === "login" && (
                    <div style={{ textAlign: "right", marginBottom: 16 }}>
                        <Button type="link" onClick={handleForgotPassword} style={{ padding: 0 }}>
                            Quên mật khẩu?
                        </Button>
                    </div>
                )}

                {type === "register" && (
                    <>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="birthday"
                            label="Ngày sinh"
                            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
                        >
                            <DatePicker style={{ width: "100%" }} />
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
                    </>
                )}

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        {type === "login" ? "Đăng nhập" : "Đăng ký"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AuthModal;
