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
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Highlighter from "react-highlight-words";
import Product from "~/models/product";
import User from "~/models/user";
import K from "~/utilities/constants";
import {
  isPermissionPresent,
  setFieldErrorsFromServer,
} from "~/utilities/generalUtility";
import ProductModal from "./productModal";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";

const ProductAntd = () => {
  const [productData, setProductData] = useState({ products: [], total: 0 });
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
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProductDetails();
    };
    fetchData();
  }, [limit, page]);

  const fetchProductDetails = async (values = {}) => {
    const body = {
      page: values.page || 1,
      limit: values.limit || 100,
      query: values.searchQuery || "",
      ...(values?.agGrid?.length && { agGrid: values.agGrid }),
    };
    // Conditionally adding sortBy and sortOrder to the body
    if (values.sortBy) {
      body.sortBy = values.sortBy;
    }
    if (values.sortOrder) {
      body.sortOrder = values.sortOrder;
    }
    try {
      const response = await Product.getProductData(body);
      setProductData(response.data);
    } catch (error) {
      setFieldErrorsFromServer(error);
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
          <span className="ml-3">
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
    return queryParam;
  };
  const filterMapping = (filters) => {
    return {
      agGrid: Object.keys(filters)
        .filter((keys) => filters[keys])
        .map((filterKey) => {
          let flag = !!filters[filterKey]?.[1];
          return {
            field: filterKey,
            [`condition${1}`]: {
              filterType: flag
                ? "date"
                : typeof productData.products[0][filterKey] != "number"
                ? "text"
                : "number",
              type:
                typeof productData.products[0][filterKey] == "number" || flag
                  ? "equals"
                  : "contains",
              [flag ? "dateFrom" : "filter"]:
                typeof productData.products[0][filterKey] == "number"
                  ? +filters[filterKey][0]
                  : filters[filterKey][0],
            },
          };
        }),
    };
  };
  const onPageChange = (pagination, filters, sorter) => {
    filters = filterMapping(filters);
    const { pageSize, current } = pagination;
    const params = { page: current, limit: pageSize, ...filters };
    if (sorter.field) {
      params.sortBy = sorter.field;
    }
    if (sorter.order) {
      params.sortOrder = sorter.order === "ascend" ? "ASC" : "DESC";
    }
    fetchProductDetails(params);
    setCurrentPage(current);
  };

  const handleSearch = async (e) => {
    try {
      const query = e.target.value;
      fetchProductDetails({
        page: 1,
        limit: 100,
        searchQuery: query,
      });
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
            current: currentPage,
            total: productData.total,
            defaultPageSize: 8,
            pageSize: 8,
          }}
          x-scroll={991}
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
