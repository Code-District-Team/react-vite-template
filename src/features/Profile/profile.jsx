import { useEffect } from "react";
import { Button, Card, Form, Input, Space } from "antd";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";
import User from "~/models/user";
import Logo from "~/assets/images/logo.svg";
function ProfilePage() {
  const [form] = Form.useForm();

  const fetchProfileData = async () => {
    try {
      const data = await User.ProfileData();

      console.log("new data", data);

      form.setFieldsValue(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProfileData();
  }, []);

  const onFinish = async (values) => {
    try {
      console.log("values", values);
      const body = {
        firstName: values.firstName,
        lastName: values.lastName,
        mobilePhone: values.mobilePhone,
        address: values.address,
        id: values.id,
      };
      await User.UpdateProfileData(body);
      fetchProfileData();
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
          initialValues={{ remember: true }}
        >
          <Form.Item name={"id"} label={"id"} style={{ display: "none" }} />

          <Form.Item name={"firstName"} label={"FirstName  "}>
            <Input />
          </Form.Item>
          <Form.Item label="Last Name:" name="lastName">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Email:" name="email">
            <Input type="text" disabled={true} />
          </Form.Item>
          <Form.Item label="Mobile Phone:" name="mobilePhone">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Address:" name="address">
            <Input type="text" />
          </Form.Item>

          <Form.Item label="Status:" name="status" className="mb-0">
            <Input type="text" disabled={true} />
          </Form.Item>
          <Space>
            <div>
              <Button type="primary" htmlType="submit">
                Save
              </Button>{" "}
            </div>
          </Space>
        </Form>
      </Card>
    </div>
  );
}

export default ProfilePage;
