import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import Product from "~/models/product";

const ProductFormModal = ({ form, onFinish, isModalOpen, setIsModalOpen }) => {
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      centered
      title="Product Form"
      open={isModalOpen}
      okText="Save"
      onOk={form.submit}
      onCancel={handleCancel}
      afterClose={() => {
        form.resetFields();
      }}
    >
      <Form name="product-form" form={form} onFinish={onFinish}>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter product name",
            },
          ]}
        >
          <Input placeholder="Name" />
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
            style={{ width: "100%" }}
            placeholder="Quantity"
            min={1}
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
            style={{ width: "100%" }}
            placeholder="Price"
            min={1}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const ProductsCRUD = () => {
  const [form] = Form.useForm();
  const editId = useRef(null);
  const [products, setProducts] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await Product.getAll();
      setProducts(res);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Product Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text) => `$${text.toLocaleString("en")}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              editId.current = record.id;
              setIsModalOpen(true);
              form.setFieldsValue(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            description="Are you sure to delete this product?"
            onConfirm={() => deleteProduct(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const createNewProduct = async (values) => {
    try {
      const data = await Product.create(values);
      message.success(`Product Created Successfully`);
      setProducts((prev) => [...prev, data]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };
  const updateProduct = async (id, values) => {
    try {
      try {
        const res = await Product.update(id, values);
        message.success(res);
        setIsModalOpen(false);
        setRefetch(!refetch);
      } catch (err) {
        console.error(err);
      }
      setRefetch(!refetch);
    } catch (err) {
      console.error(err);
    }
  };

  const onFinish = async (values) => {
    if (editId.current) updateProduct(editId.current, values);
    else createNewProduct(values);
  };

  const deleteProduct = async (id) => {
    try {
      const res = await Product.delete(id);
      message.success(res);
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      message.error("Failed to Delete Product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refetch]);

  return (
    <>
      <Card
        extra={
          <Button
            type="primary"
            size="large"
            onClick={() => {
              editId.current = null;
              setIsModalOpen(true);
            }}
          >
            Create Product
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={products}
          scroll={{ x: 900 }}
        />
      </Card>
      <ProductFormModal
        form={form}
        onFinish={onFinish}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};
