import { useEffect, useState } from "react";
import { Button, Card, Form, Input, Space } from "antd";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";
import User from "~/models/user";
import Logo from "~/assets/images/logo.svg";
function ProfilePage() {
  const [form] = Form.useForm();
  const [editUpdate, setEditUpdate] = useState(true);
  // const [idValue, setIdValue] = useState("");
  // let id = "";
  const fetchProfileData = async () => {
    try {
      const data = await User.ProfileData();
      // setProfileData(data);
      console.log("new data", data);
      // id = data.id;
      // setIdValue(id);
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
      setEditUpdate(true);
    } catch (error) {
      setFieldErrorsFromServer(error, form, values);
    }
  };
  const handleEdit = () => {
    setEditUpdate(false);
  };

  const handleCancelEdit = () => {
    setEditUpdate(true);
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
            <Input disabled={editUpdate} />
          </Form.Item>
          <Form.Item label="Last Name:" name="lastName">
            <Input type="text" disabled={editUpdate} />
          </Form.Item>
          <Form.Item label="Email:" name="email">
            <Input type="text" disabled={true} />
          </Form.Item>
          <Form.Item label="Mobile Phone:" name="mobilePhone">
            <Input type="text" disabled={editUpdate} />
          </Form.Item>
          <Form.Item label="Address:" name="address">
            <Input type="text" disabled={editUpdate} />
          </Form.Item>

          <Form.Item label="Status:" name="status" className="mb-0">
            <Input type="text" disabled={editUpdate} />
          </Form.Item>
          <Space>
            {!editUpdate ? (
              <div>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>{" "}
                <Button type="primary" onClick={handleCancelEdit}>
                  Cancel
                </Button>{" "}
              </div>
            ) : (
              <Button type="primary" onClick={handleEdit}>
                Edit
              </Button>
            )}
          </Space>
        </Form>
      </Card>
    </div>
  );
}

export default ProfilePage;
