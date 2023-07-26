import { Button, Card, Form, Input,Divider  } from "antd";
import md5 from "md5";
// import { PatternFormat } from "react-number-format";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import User from "~/models/user";

import {
  redirectToUrl,
  setFieldErrorsFromServer,
} from "~/utilities/generalUtility";

// const { Title } = Typography;

export default function SetPassword() {
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
         
          <Form.Item
          className="inputField"
            name="password"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your new password!",
              },
              {
                whitespace: true,
                message: "All spaces are not allowed",
              },
            ]}
          >
            <Input.Password
              placeholder="New Password"
              size="large"
              autoComplete="false"
            />
          </Form.Item>
          <Form.Item
          className="inputField"
            name="newpassword"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please ire enter your  password!",
              },
              {
                whitespace: true,
                message: "All spaces are not allowed",
              },
            ]}
          >
            <Input.Password
              placeholder="Re-enter password"
              size="large"
              autoComplete="false"
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <Button  className="authBtn proceedBtn" block size="large" type="primary" htmlType="submit">
            Proceed to sign in
            </Button>
          </Form.Item>
         
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
 