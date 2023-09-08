import { Button, Form, Input, Table, message } from "antd";
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
import ProductModal from "./productModal";

const ProductAntd = () => {
  const [productData, setProductData] = useState({ products: [], total: 0 });
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
      sorter: true,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: true,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      sorter: true,
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
  };
  const onPageChange = (pagination, filter, sort) => {
    const { pageSize, current } = pagination;
    let queryParam = "";
    console.log("sort", sort);
    if (!sort.column) {
      queryParam = createQuery(current, pageSize);
    } else {
      queryParam = createQuery(
        current,
        pageSize,
        sort.field,
        sortDict[sort.order],
      );
    }
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
  };

  const onFinish = async (values) => {
    if (!editId.current) {
      createProducts(values);
    } else {
      handleButtonEdit(values);
    }
    form.resetFields();
  };

  const showModal = () => {
    if (!editId.current) {
      form.resetFields();
    }
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleButtonDelete = async (id) => {
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
      <ProductModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        form={form}
        onFinish={onFinish}
        editId={editId}
      />
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
