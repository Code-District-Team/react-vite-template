import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, message } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import User from "~/models/user";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";

export default function ForgotPassword() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("USer: ");
    try {
      await User.forgotPassword(values.email);
      message.success(`An email has been sent to ${values.email}`);
    } catch (error) {
      setFieldErrorsFromServer(error, form, values);
    }
  };

  return (
    <React.Fragment>
      <div className="login-container">
        <div className="lc-logo">
          <img src="images/logo.png" alt="" />
        </div>
        <Card bordered={false} className="login-card">
          <h4>Forgot Password</h4>
          <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined className="site-form-item-icon text-primary" />
                }
                placeholder="Email"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button block size="large" type="primary" htmlType="submit">
                Reset
              </Button>
            </Form.Item>
            <Divider plain>OR</Divider>
            <Form.Item className="mb-0 text-center">
              <Link to="/login">
                <ArrowLeftOutlined /> Back to Login
              </Link>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </React.Fragment>
  );
}
