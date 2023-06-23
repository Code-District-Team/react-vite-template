import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import md5 from "md5";
import { useDispatch } from "react-redux";
import User from "~/models/user";
import {
  redirectToUrl,
  setFieldErrorsFromServer,
} from "~/utilities/generalUtility";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    // console.log("change password", values);
    try {
      await dispatch(
        User.ChangePassword(
          md5(values.oldpassword),
          md5(values.password),
          values.remember
        )
      );

      redirectToUrl("/"); // * Pass domainPrefix as 2nd argumnet in case of multi tenant
    } catch (error) {
      setFieldErrorsFromServer(error, form, values);
    }
  };
  return (
    <div className="login-container">
      <div className="lc-logo">{/* <img src={Logo} alt="logo" /> */}</div>
      <Card bordered={false} className="login-card">
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
            name="oldpassword"
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

          {/* <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}
          <Form.Item noStyle>
            <Button block size="large" type="primary" htmlType="submit">
              Done
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;
