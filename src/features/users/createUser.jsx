// import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, message } from "antd";

// import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import Logo from "~/assets/images/logo.svg";
import Spinner from "~/common/spinner/spinner";
import User from "~/models/user";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";
const CreateUser = () => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  // const handleMenuClick = (e) => {
  //   message.info("Click on menu item.");
  //   console.log("click", e);
  // };

  const getUserRolesData = async (values) => {
    try {
      const response = await User.GetUserRoles(values);
      setRoles(response);
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };
  const onFinish = async (values) => {
    try {
      const response = await User.InviteUser(values.email, values.roleId);
      console.log(response);
      message.success("User Invite has been sent");
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };
  useEffect(() => {
    getUserRolesData();
  }, []);
  if (roles.length == 0) {
    return <Spinner />;
  }
  return (
    <div className="login-container">
      <div className="lc-logo">
        <img src={Logo} alt="logo" />
      </div>
      <Card bordered={false} className="login-card">
        <h4>Invite User</h4>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="roleId"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role">
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <Button block size="large" type="primary" htmlType="submit">
              Send Invitation
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateUser;
