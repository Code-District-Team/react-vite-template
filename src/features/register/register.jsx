import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography } from "antd";
import md5 from "md5";
import { PatternFormat } from "react-number-format";
import { Link } from "react-router-dom";
import Logo from "~/assets/images/logo.svg";
import User from "~/models/user";
import {
  redirectToUrl,
  setFieldErrorsFromServer,
} from "~/utilities/generalUtility";

const { Title } = Typography;

export default function Register() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await User.signUpCall(
        values.firstName,
        values.lastName,
        values.mobilePhone,
        values.email,
        md5(values.password),
        values.remember
      );

      redirectToUrl("/"); // * Pass domainPrefix as 2nd argumnet in case of multi tenant
    } catch (error) {
      setFieldErrorsFromServer(error, form, values);
    }
  };
  return (
    <div className="login-container">
      <div className="lc-logo">
        <img src={Logo} alt="logo" />
      </div>
      <Card bordered={false} className="login-card">
        <h4>Sign Up your account</h4>
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
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please input your First Name",
              },
            ]}
          >
            <Input
              type="name"
              prefix={
                <UserOutlined className="site-form-item-icon text-primary" />
              }
              placeholder="First Name"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please input your Last Name",
              },
            ]}
          >
            <Input
              type="name"
              prefix={
                <UserOutlined className="site-form-item-icon text-primary" />
              }
              placeholder="Last Name"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="mobilePhone"
            rules={[
              {
                required: true,
                message: "Please Enter Valid Phone Number",
              },
              {
                whitespace: true,
                message: "Only Spaces are not allowed",
              },
            ]}
          >
            <PatternFormat
              placeholder="Enter Mobile Number"
              prefix={
                <UserOutlined className="site-form-item-icon text-primary" />
              }
              customInput={Input}
              format={"+###########"}
            ></PatternFormat>
          </Form.Item>
          <Form.Item
            name="email"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your email",
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
            ></Input>
          </Form.Item>

          <Form.Item
            name="password"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                whitespace: true,
                message: "All spaces are not allowed",
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
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your confirm password!",
              },
              {
                whitespace: true,
                message: "All spaces are not allowed",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("The two passwords that you entered do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              size="large"
              autoComplete="false"
              prefix={
                <LockOutlined className="site-form-item-icon text-primary" />
              }
            />
          </Form.Item>
          <Title level={5} className="text-center">
            {"Have an Account?" + "  "}
            <Link to="/login">Login</Link>
          </Title>
          <Form.Item className="mb-0">
            <Button block size="large" type="primary" htmlType="submit">
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
