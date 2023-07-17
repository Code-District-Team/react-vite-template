import { Button, Card, Form, Input } from "antd";
import User from "~/models/user";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";

export default function ProfilePage() {
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
    <div className="profile-container">
      <Card title="User Profile">
        <Form
          onFinish={onFinish}
          form={form}
          name="profile-form"
          initialValues={data.user}
          layout="horizontal"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item name="firstName" label="FirstName">
            <Input size="middle" />
          </Form.Item>
          <Form.Item label="Last Name:" name="lastName">
            <Input size="middle" />
          </Form.Item>
          <Form.Item label="Mobile Phone:" name="mobilePhone">
            <Input size="middle" />
          </Form.Item>
          <Form.Item label="Address:" name="address">
            <Input size="middle" />
          </Form.Item>
          <Form.Item label="Email:" name="email">
            <Input size="middle" disabled />
          </Form.Item>
          <Form.Item label="Status:" name="status">
            <Input size="middle" disabled />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 12,
              span: 12,
            }}
          >
            <Button type="primary" size="middle" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
