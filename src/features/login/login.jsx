import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, message } from "antd";
import md5 from "md5";
import qs from "qs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import User from "~/models/user";
import {
  deleteQueryParam,
  redirectToUrl,
  setFieldErrorsFromServer,
} from "~/utilities/generalUtility";

export default function Login() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();
  const paramJson = qs.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    console.log("paramJson: ", paramJson);
    if (paramJson.err) {
      message.error(paramJson.err);
      deleteQueryParam("err");
    }
  }, []);

  const onFinish = async (values) => {
    try {
      await dispatch(
        User.loginCall(values.email, md5(values.password), values.remember)
      );
      redirectToUrl("/");
    } catch (error) {
      setFieldErrorsFromServer(error, form, values);
    }
  };

  return (
    <div className="login-container">
      <div className="lc-logo">
        <img src="images/logo.png" alt="" />
      </div>
      <Card bordered={false} className="login-card">
        <h4>Login to your account</h4>
        <Form
          form={form}
          name="login-form"
          initialValues={{
            remember: true,
          }}
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
              type="email"
              prefix={
                <UserOutlined className="site-form-item-icon text-primary" />
              }
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined className="site-form-item-icon text-primary" />
              }
              placeholder="Password"
              size="large"
              autoComplete="false"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Link to="/forgot-password" className="float-right" href="">
              Forgot password
            </Link>
          </Form.Item>
          <Form.Item className="mb-0">
            <Button block size="large" type="primary" htmlType="submit">
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
