import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Table, message } from "antd";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { createLogger } from "vite";
import Product from "~/models/product";
import User from "~/models/user";
import K from "~/utilities/constants";
import {
  isPermissionPresent,
  setFieldErrorsFromServer,
} from "~/utilities/generalUtility";

const ProductAntd = () => {
  // const [searchedText, setSearchedText] = useState("");

  const [productData, setProductData] = useState({ products: [], total: 0 });
  // const [productData, setProductData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation(); // useLocation hook to get the current location object
  const searchParams = new URLSearchParams(location.search); // Create a URLSearchParams object with the current query string
  const [form] = Form.useForm();
  const limit = searchParams.get("limit"); // Get 'limit' parameter
  const page = searchParams.get("page"); // Get 'page' parameter
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const userRole = User.getRole();
  const editId = useRef(null);
  console.log(productId);
  // const dispatch = useDispatch();

  const fetchProductDetails = async (queryParams) => {
    try {
      // const response = await Product.getProductData(limit, page);
      const response = await Product.getProductData(queryParams);

      setProductData(response.data);
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };

  useEffect(() => {
    fetchProductDetails(createQuery(1, 10));
  }, [limit, page]);

  const Columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product Name",
      dataIndex: "name",
      sorter: true,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Price",
      dataIndex: "price",
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
      key: "action",
      hidden: !isPermissionPresent(K.Permissions.Admin, userRole),
      render: (_, data) => (
        <>
          <span>
            <Button
              onClick={() => {
                editId.current = true;
                showModal();
                setProductId(data.id);
                form.setFieldsValue(data);
              }}
            >
              Edit
            </Button>
          </span>
          <span>
            <Button onClick={() => handleButtonDelete(data.id)}>Delete</Button>
          </span>
        </>
      ),
    },
  ].filter((column) => {
    return !column.hidden;
  });

  // const Data = [
  //   {
  //     id: 1,
  //     name: "Usama",
  //     price: "20",
  //     quantity: 20,
  //     createdAt: "2023-09-01T06:35:52.141Z",
  //     updatedAt: "2023-09-01T06:35:52.141Z",
  //   },
  // ];
  const createQuery = (page, limit, sortBy, sortOrder) => {
    let queryParam = `page=${page}&limit=${limit}`;
    if (sortBy) {
      queryParam += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    }
    if (searchQuery) {
      queryParam += `&query=${searchQuery}`;
    }
    return queryParam;
  };
  const sortDict = {
    ascend: "ASC",
    descend: "DESC",
    undefined: "ASC",
  };
  const onPageChange = (pagination, filter, sort) => {
    const { pageSize, current } = pagination;
    let queryParam = "";
    if (!sort) {
      queryParam = createQuery(current, pageSize);
    } else {
      queryParam = createQuery(
        current,
        pageSize,
        sort.field,
        sortDict[sort.order],
      );
    }
    // let queryParams = `limit=${pagination.pageSize}&page=${pagination.current}&query=${searchQuery}`;
    // if (sortDict[sort.order]) {
    //   queryParams += `&sortBy=${sort?.field}&sortOrder=${
    //     sortDict[sort.order]
    //   }&query=${searchQuery}`;
    // }
    // console.log("sort value", sort.order);
    fetchProductDetails(queryParam);
    setCurrentPage(current);
  };
  const handleSearch = async (e) => {
    try {
      const query = e.target.value;
      setSearchQuery(query);

      const queryParams = `limit=${10}&page=${1}&query=${query}`; //l or whatever your default values are
      fetchProductDetails(queryParams);
      setCurrentPage(1);
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };
  const createProducts = async (values) => {
    try {
      await Product.createProductData(
        values.name,
        parseInt(values.quantity),
        parseFloat(values.price),
      );
      fetchProductDetails(createQuery(1, 10));
      setIsModalOpen(false);
      message.success("Product created Successfully");
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
    console.log(values);
  };

  const onFinish = async (values) => {
    if (!editId.current) {
      createProducts(values);
    } else {
      handleButtonEdit(values);
    }
    form.resetFields();
    // const response = await Product.getProductData(limit, page);
  };

  const showModal = () => {
    if (!editId.current) {
      form.resetFields();
    }
    setIsModalOpen(true);
  };
  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleButtonDelete = async (id) => {
    console.log("id", id);
    try {
      await Product.deleteProductData(id);
      fetchProductDetails(createQuery(1, 10));
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };

  const handleButtonEdit = async (values) => {
    try {
      await Product.updateProductData(
        values.name,
        parseInt(values.quantity),
        parseFloat(values.price),
        productId,
      );
      message.success("Product updated successfully");
      fetchProductDetails(createQuery(1, 10));
      setIsModalOpen(false);
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };

  return (
    <>
      <Input.Search
        allowClear
        className="mb-3"
        size="large"
        placeholder="Search"
        onSearch={handleSearch}
        // onSearch={onSearch}
        onChange={debounce(handleSearch, 500)}
      ></Input.Search>
      <Button
        type="primary"
        onClick={() => {
          editId.current = false;
          showModal();
        }}
      >
        Create Product
      </Button>
      <Modal
        title="Enter Product Details "
        okText={editId.current ? "Update" : "Save"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="login-form"
          // initialValues={{
          //   remember: true,
          // }}
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
            <Input
              type="number"
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
            <Input
              type="number"
              prefix={
                <UserOutlined className="site-form-item-icon text-primary" />
              }
              placeholder="Price"
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        rowKey="id"
        columns={Columns}
        onChange={onPageChange}
        dataSource={productData.products}
        pagination={{
          current: currentPage,
          total: productData.total,
          defaultPageSize: 10,
          pageSize: 10,
        }}
      ></Table>
    </>
  );
};

export default ProductAntd;
