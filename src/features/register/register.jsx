import { Button, Card, Form, Input, Divider, Image } from "antd";
import md5 from "md5";
// import { PatternFormat } from "react-number-format";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import googleImg from "../../assets/images/google-icon.svg";
import User from "~/models/user";

import {
  redirectToUrl,
  setFieldErrorsFromServer,
} from "~/utilities/generalUtility";

// const { Title } = Typography;

export default function Register() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await User.signUpCall(
        // values.firstName,
        // values.lastName,
        // values.mobilePhone,
        values.email,
        md5(values.password),
        // values.remember,
      );

      redirectToUrl("/"); // * Pass domainPrefix as 2nd argumnet in case of multi tenant
    } catch (error) {
      setFieldErrorsFromServer(error, form, values);
    }
  };
  return (
    <div className="login-container">
      <Card bordered={false} className="login-card">
        <div className="site-logo">
          <img src={Logo} alt="logo" />
        </div>
        <Form
          form={form}
          name="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item>
            <Button className="google-btn" block size="large">
              <Image className="googleImg" src={googleImg} />
              Continue with Google
            </Button>
          </Form.Item>
          <span className="auth-text"> or sign up with email</span>
          <Form.Item
            className="inputField"
            name="email"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your email",
              },
            ]}
          >
            <Input type="email" placeholder="Email" size="large"></Input>
          </Form.Item>

          <Form.Item
            className="inputField"
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
              placeholder="Password"
              size="large"
              autoComplete="false"
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <Button
              className="authBtn"
              block
              size="large"
              type="primary"
              htmlType="submit"
            >
              Sign Up
            </Button>
          </Form.Item>

          <span className="text-center authentications mb-0">
            Already have an account?
            <Link to="/login" className="auth-clr">
              Sign in
            </Link>
          </span>
        </Form>
        <Divider />
        <div className="conditions">
          <Link>Terms & Conditions</Link>
          <Link>Privacy Policy</Link>
        </div>
      </Card>
    </div>
  );
}
