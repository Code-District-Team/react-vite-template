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
      fetch("http://localhost:8082/product/get-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((jsonRes) => {
          setProducts(jsonRes);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onFinish = async (values) => {
    try {
      if (editId.current) {
        fetch(`http://localhost:8082/product/${editId.current}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then(() => {
            message.success(`Product Updated Successfully`);
            setIsModalOpen(false);
            setRefetch(!refetch);
          })
          .catch(() => {
            message.error("Failed to Update");
          });
      } else {
        fetch("http://localhost:8082/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((res) => res.json())
          .then((data) => {
            message.success(`Product Created Successfully`);
            setProducts((prev) => [...prev, data]);
            setIsModalOpen(false);
          })
          .catch(() => {
            message.error("Failed to Create");
          });
      }
    } catch (err) {
      message.error("Failed");
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
