// import { useEffect } from "react";
import { Button, Card, Form, Input, Space } from "antd";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";
import User from "~/models/user";
import Logo from "~/assets/images/logo.svg";
function ProfilePage() {
  const [form] = Form.useForm();
  const data = User.getUserObjectFromCookies();

  const onFinish = async (values) => {
    const { email, status, ...rest } = values;
    rest.id = User.getId();
    try {
      await User.updateProfileData(rest);
    } catch (error) {
      setFieldErrorsFromServer(error, form, values);
    }
  };

  return (
    <div className="login-container-profile">
      <div className="lc-logo">
        <img src={Logo} alt="logo" />
      </div>
      <Card>
        <h1>Profile Page</h1>

        <Form
          onFinish={onFinish}
          form={form}
          name="profile-form"
          initialValues={data.user}
        >
          <Form.Item name={"firstName"} label={"FirstName  "}>
            <Input />
          </Form.Item>
          <Form.Item label="Last Name:" name="lastName">
            <Input type="text" />
          </Form.Item>

          <Form.Item label="Mobile Phone:" name="mobilePhone">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Address:" name="address">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Email:" name="email">
            <Input type="text" disabled={true} />
          </Form.Item>
          <Form.Item label="Status:" name="status" className="mb-0">
            <Input type="text" disabled={true} />
          </Form.Item>
          <Space>
            <div>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Space>
        </Form>
      </Card>
    </div>
  );
}

export default ProfilePage;
