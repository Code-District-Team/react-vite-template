import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography } from "antd";
import md5 from "md5";
import { PatternFormat } from "react-number-format";
import { Link, useLocation } from "react-router-dom";
import Logo from "~/assets/images/logo.svg";
import User from "~/models/user";
import {
  redirectToUrl,
  setFieldErrorsFromServer,
} from "~/utilities/generalUtility";

const { Title } = Typography;

export default function Register() {
  const [form] = Form.useForm();
  const location = useLocation(); // useLocation hook to get the current location object
  const searchParams = new URLSearchParams(location.search); // Create a URLSearchParams object with the current query string
  const email = searchParams.get("email")?.replace(/ /g, "+");
  email && form.setFieldsValue({ email });

  const onFinish = async (values) => {
    try {
      await User.signUpCall(
        values.firstName,
        values.lastName,
        values.mobilePhone,
        values.companyEmail,
        values.companyName,
        md5(values.password),
        values.remember,
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
              prefix={<UserOutlined className="text-primary" />}
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
              prefix={<UserOutlined className="text-primary" />}
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
              prefix={<UserOutlined className="text-primary" />}
              customInput={Input}
              format={"+###########"}
            ></PatternFormat>
          </Form.Item>
          <Form.Item
            name="companyName"
            rules={[
              {
                required: true,
                message: "Please input your Company Name",
              },
            ]}
          >
            <Input
              type="name"
              prefix={<UserOutlined className="text-primary" />}
              placeholder="Company Name"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="website"
            rules={[
              {
                required: true,
                message: "Please input your Company Website",
              },
            ]}
          >
            <Input
              type="website"
              prefix={<UserOutlined className="text-primary" />}
              placeholder="Company Website"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="companyEmail"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your Company email",
              },
            ]}
          >
            <Input
              type="email"
              prefix={<UserOutlined className="text-primary" />}
              placeholder="Company Email"
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
              prefix={<LockOutlined className="text-primary" />}
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
                    new Error(
                      "The two passwords that you entered do not match",
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              size="large"
              autoComplete="false"
              prefix={<LockOutlined className="text-primary" />}
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
