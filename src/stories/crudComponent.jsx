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

const ProductFormModal = ({
  form,
  editId,
  onFinish,
  isModalOpen,
  setIsModalOpen,
}) => {
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      centered
      title="Create Product"
      open={isModalOpen}
      okText={editId ? "Update" : "Create"}
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

export const CRUDComponent = () => {
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
      render: (_, data) => (
        <Space>
          <Button
            onClick={() => {
              editId.current = data.id;
              setIsModalOpen(true);
              form.setFieldsValue(data);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            description="Are you sure to delete this product?"
            onConfirm={() => handleButtonDelete(data.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleButtonDelete = async (id) => {
    try {
      fetch(`http://localhost:8082/product/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          message.success("Product Deleted.");
        })
        .catch(() => {
          message.error("Failed to delete");
        });
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
        editId={editId.current}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};
