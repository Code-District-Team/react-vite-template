import { Button, Form, Input, Modal, Select } from "antd";

const UserModal = ({ isModalOpen, handleCancel, form, onFinish, roles }) => {
  return (
    <>
      <Modal
        title="Create User"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        footer={false}
      >
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
      </Modal>
    </>
  );
};

export default UserModal;
