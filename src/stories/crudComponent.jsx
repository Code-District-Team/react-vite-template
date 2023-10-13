import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import Product from "~/models/product";

const CreateModal = ({
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      // TODO: Will be without payload
      fetch("http://localhost:8082/product/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: 1,
          limit: 10,
          query: "",
          filterType: "antd",
          sortBy: undefined,
          sortOrder: undefined,
        }),
      })
        .then((res) => res.json())
        .then((jsonRes) => {
          setProducts(jsonRes.data.products);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onFinish = async (values) => {
    try {
      const response = !editId.current
        ? await fetch("http://localhost:8082/product", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
        : await fetch(`http://localhost:8082/product/${editId.current}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

      console.log(response);
      const data = await response.json();
      console.log(data);

      message.success(
        `Product ${editId.current ? "Updated" : "Created"} Successfully`,
      );
      setProducts((prev) => [...prev, data]);
      setIsModalOpen(false);
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
          <Button danger onClick={() => handleButtonDelete(data.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleButtonDelete = async (id) => {
    try {
      await Product.deleteProductData(id);
    } catch (error) {
      message.error("Failed to Delete Product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      <CreateModal
        form={form}
        onFinish={onFinish}
        editId={editId.current}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};
