import { useEffect, useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";
import User from "~/models/user";

function ProfilePage() {
  const [form] = Form.useForm();
  // Profile data state
  const [profileData, setProfileData] = useState({
    // Add more fields as needed
  });
  // const [editMode, setEditMode] = useState(false);
  const fetchProfileData = async () => {
    try {
      const data = await User.ProfileData();
      setProfileData(data);
      console.log(profileData);
      form.setFieldsValue(data);
      console.log({ data });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // Fetch profile data from the server and update the state
    // form.setFieldsValue({ firstname: "profileData?.firstName" });
    fetchProfileData();
    //form.setFieldValue("firstName", "DSDSD");
  }, []);

  const onFinish = async (values) => {
    try {
      console.log("values", values);
      const body = {
        firstName: values.firstName,
        lastName: values.lastName,
        mobilePhone: values.mobilePhone,
      };
      await User.UpdateProfileData(body);
      // setProfileData(values);
      // redirectToUrl("/"); // * Pass domainPrefix as 2nd argument in case of multi tenant
    } catch (error) {
      setFieldErrorsFromServer(error, form, values);
    }
  };

  return (
    <Card>
      <div>
        <h1>Profile Page</h1>

        <Form
          onFinish={onFinish}
          form={form}
          name="profile-form"
          initialValues={{ remember: true, firstName: "Haseeeb" }}
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

          <Form.Item label="Status:" name="status">
            <Input type="text" />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </div>
    </Card>
  );
}

export default ProfilePage;
