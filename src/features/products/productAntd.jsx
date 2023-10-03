import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Space,
  Table,
  message,
} from "antd";
import { debounce } from "lodash";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Product from "~/models/product";
import User from "~/models/user";
import K from "~/utilities/constants";
import {
  isPermissionPresent,
  setFieldErrorsFromServer,
} from "~/utilities/generalUtility";
import ProductModal from "./productModal";

const ProductAntd = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    query: "",
    sortBy: undefined,
    sortOrder: undefined,
  });
  const [form] = Form.useForm();
  const [productData, setProductData] = useState({ products: [], total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const userRole = User.getRole();
  const editId = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    fetchProductDetails();
  }, [filters]);

  const fetchProductDetails = async () => {
    try {
      const response = await Product.getProductData(filters);
      setProductData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuickSearch = async (selectedKeys, confirm, dataIndex) => {
    try {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchDateProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <DatePicker
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] ? moment(selectedKeys[0], "YYYY-MM-DD") : null}
          onChange={(date) =>
            setSelectedKeys(date ? [date.format("YYYY-MM-DD"), "date"] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ marginRight: 8 }}
        />
        <button
          onClick={() => clearFilters && handleReset(clearFilters)}
          style={{ marginRight: 8 }}
        >
          Reset
        </button>
        <button onClick={() => confirm()} type="primary">
          Search
        </button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleQuickSearch(selectedKeys, confirm, dataIndex)
          }
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              confirm();
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => {
      return (
        <SearchOutlined
          style={{
            color: filtered ? "#1677ff" : undefined,
          }}
        />
      );
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
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
      ...getColumnSearchProps("name"),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: true,
      ...getColumnSearchProps("price"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: true,
      ...getColumnSearchProps("quantity"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: true,
      ...getColumnSearchDateProps("createdAt"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      sorter: true,
      ...getColumnSearchDateProps("updatedAt"),
    },
    {
      title: "Action",
      key: "action",
      hidden: !isPermissionPresent([K.Permissions.Admin], userRole),
      render: (_, data) => (
        <Space>
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
          <Button danger onClick={() => handleButtonDelete(data.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ].filter((column) => {
    return !column.hidden;
  });

  const onPageChange = (pagination, filters, sorter) => {
    const params = { page: pagination.current, limit: pagination.pageSize };
    if (sorter.field && sorter.order) {
      params.sortBy = sorter.field;
      params.sortOrder = sorter.order === "ascend" ? "ASC" : "DESC";
    }
    setFilters((prev) => ({ ...prev, ...params }));
  };

  const handleSearch = async ({ target: { value } }) => {
    setFilters((prev) => ({ ...prev, query: value }));
  };

  const createProducts = async (values) => {
    try {
      await Product.createProductData(
        values.name,
        parseInt(values.quantity),
        parseFloat(values.price),
      );
      fetchProductDetails();
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
      fetchProductDetails();
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
      fetchProductDetails();
      setIsModalOpen(false);
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };

  return (
    <>
      <Card
        className="card-wrapper"
        title={
          <Input
            allowClear
            size="large"
            placeholder="Search"
            onChange={debounce(handleSearch, 500)}
          />
        }
        extra={
          <>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                editId.current = false;
                showModal();
              }}
            >
              Create Product
            </Button>
          </>
        }
      >
        <Table
          rowKey="id"
          columns={Columns}
          onChange={onPageChange}
          dataSource={productData?.products}
          pagination={{
            current: filters.page,
            total: productData.total,
            defaultPageSize: 8,
            pageSize: 8,
          }}
          scroll={{ x: 950 }}
        />
      </Card>

      <ProductModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        form={form}
        onFinish={onFinish}
        editId={editId}
      />
    </>
  );
};

export default ProductAntd;
