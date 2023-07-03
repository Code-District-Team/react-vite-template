import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, message } from "antd";
import md5 from "md5";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "~/assets/images/logo.svg";
import User from "~/models/user";

export default function SetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values) => {
    const token = location.search.substring(7);
    try {
      dispatch(
        User.resetPassword(md5(values.password), token, values.remember)
      );
      message.success("Your password has been changed successfully.");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="lc-logo">
        <img src={Logo} alt="logo" />
      </div>
      <Card bordered={false} className="login-card">
        <h4>Set Password</h4>
        <Form
          name="set-password-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 8,
                message: "Password must be atleast 8 characters long!",
              },
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined className="site-form-item-icon text-primary" />
              }
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Confirm Password is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("The passwords does not match.");
                },
              }),
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined className="site-form-item-icon text-primary" />
              }
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item noStyle>
            <Button block size="large" type="primary" htmlType="submit">
              Done
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
