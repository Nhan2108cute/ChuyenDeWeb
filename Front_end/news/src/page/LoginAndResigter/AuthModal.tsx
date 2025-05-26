import React from "react";
import { Modal, Button, Form, Input, DatePicker, message } from "antd";
import { useAuth } from "../../context/AuthContext"; // chỉnh đúng path
import axios from "axios";
import { useNavigate } from "react-router-dom";

type AuthModalProps = {
    visible: boolean;
    onClose: () => void;
    type: "login" | "register";
};

const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, type }) => {
    const [form] = Form.useForm();
    const { login } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            if (type === "login") {
                const response = await axios.post("http://localhost:8081/api/auth/login", {
                    username: values.username,
                    password: values.password,
                });
                console.log("Login response data:", response.data);

                const { username, accountType } = response.data;

                // Gọi hàm login trong context và truyền cả accountType
                console.log("Logging in user:", {
                    username: values.username,

                });
                login({
                    username: values.username,
                    accountType,
                });

                message.success("Đăng nhập thành công!");

                // Redirect dựa vào loại tài khoản
                if (accountType === 0) {
                    navigate("/admin-dashboard");  // Trang admin
                } else {
                    navigate("/");   // Trang user thường hoặc premium
                }
            } else {
                await axios.post("http://localhost:8081/api/auth/register", {
                    username: values.username,
                    password: values.password,
                    email: values.email,
                    phone: values.phone,
                    birthday: values.birthday.format("YYYY-MM-DD"),
                    accountType: 1, // 👈 thêm dòng này
                });

                message.success("Đăng ký thành công!");
            }

            form.resetFields();
            onClose();
        } catch (error: any) {
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
                    rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu!" },
                        {
                            min: 8,
                            message: "Mật khẩu phải có ít nhất 8 ký tự!",
                        },
                        {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                            message:
                                "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!",
                        },
                    ]}
                    hasFeedback
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
