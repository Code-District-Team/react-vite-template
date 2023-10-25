import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import md5 from "md5";
import User from "~/models/user";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";

const ChangePassword = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await User.changePassword(md5(values.oldPassword), md5(values.password));
      message.success("Password changed successfully!");
    } catch (error) {
      setFieldErrorsFromServer(error, form, values);
    }
  };
  return (
    <Card title="Change Password" className="card-wrapper" bordered={false}>
      <div className="login-container pt-0">
        <Form name="change-password-form" onFinish={onFinish} layout="vertical">
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
              prefix={<LockOutlined className=" text-primary" />}
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
              prefix={<LockOutlined className="text-primary" />}
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
              prefix={<LockOutlined className="text-primary" />}
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
  );
};

export default ChangePassword;
