import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import md5 from "md5";
import User from "~/models/user";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";

const ChangePassword = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await User.changePassword(
        md5(values.oldPassword),
        md5(values.password),
        values.remember
      );
      message.success("Password changed successfully!");
    } catch (error) {
      setFieldErrorsFromServer(error, form, values);
    }
  };
  return (
    <>
      <Card bordered={false} className="login-card">
        <div className="login-container">
          <div className="lc-logo">{/* <img src={Logo} alt="logo" /> */}</div>
          <h4>Change Password</h4>
          <Form
            name="set-password-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your old password!",
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
                placeholder="Old Password"
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
                placeholder="New Password"
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
            <Form.Item noStyle>
              <Button block size="large" type="primary" htmlType="submit">
                Done
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </>
  );
};

export default ChangePassword;
