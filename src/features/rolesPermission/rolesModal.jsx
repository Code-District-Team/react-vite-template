import { Input, Form, Modal, Transfer, Typography } from "antd";

const { Title, Paragraph } = Typography;

const RolesModal = ({
  isModalVisible,
  editId,
  handleCancel,
  form,
  isLoading,
  targetKeys,
  onFinish,
  listing,
  onChange,
  filterOption,
}) => {
  return (
    <Modal
      open={isModalVisible}
      okText={editId ? "Update" : "Save"}
      wrapClassName="vertical-center-modal"
      onCancel={handleCancel}
      centered
      destroyOnClose
      onOk={form.submit}
      okButtonProps={{
        loading: isLoading,
        disabled: targetKeys.length === 0,
      }}
      className="s2-theme-style roles-permissions-modal"
      title={
        <Title className="ant-modal-title">
          {!editId ? "Create New" : "Update"} Roles & Permissions
          <Paragraph className="rolesTableModal">
            Please fill in all the details
          </Paragraph>
        </Title>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Role Name"
          name="name"
          rules={[
            { required: true, message: "Please enter role name!" },
            { min: 3, message: "Name must be at least 3 characters" },
            {
              max: 150,
              message: "Name cannot be longer than 150 characters",
            },
          ]}
        >
          <Input placeholder="Enter" className="rolesTableInput" />
        </Form.Item>
      </Form>
      <Title level={5} className="rolesTableTypography">
        Select Permissions
      </Title>
      {console.log("here", listing, targetKeys)}
      <Transfer
        oneWay
        showSearch
        className="rolesPermissionTransfer"
        pagination={{ pageSize: 6 }}
        titles={["Source", "Target"]}
        dataSource={listing.permissions}
        targetKeys={targetKeys}
        rowKey={(record) => record.id}
        onChange={onChange}
        filterOption={filterOption}
        render={(item) => item.displayName}
      />
    </Modal>
  );
};

export default RolesModal;
