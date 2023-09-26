import { UserOutlined } from "@ant-design/icons";
import { Form, Input, InputNumber, Modal } from "antd";

const ProductModal = ({
  editId,
  isModalOpen,
  handleCancel,
  form,
  onFinish,
}) => {
  return (
    <>
      <Modal
        title="Enter Product Details "
        okText={editId.current ? "Update" : "Save"}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="login-form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter product name",
              },
            ]}
          >
            <Input
              type="text"
              prefix={
                <UserOutlined className="site-form-item-icon text-primary" />
              }
              placeholder="Name"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            rules={[
              {
                required: true,
                message: "Please enter Quantity",
              },
            ]}
          >
            <InputNumber
              prefix={
                <UserOutlined className="site-form-item-icon text-primary" />
              }
              placeholder="Quantity"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="price"
            rules={[
              {
                required: true,
                message: "Please enter price",
              },
            ]}
          >
            <InputNumber
              prefix={
                <UserOutlined className="site-form-item-icon text-primary" />
              }
              placeholder="Price"
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductModal;
