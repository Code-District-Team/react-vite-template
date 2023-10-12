import { SearchOutlined } from "@ant-design/icons";
import { selectUser } from "~/redux/user/userSlice";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Space,
  Table,
  message,
} from "antd";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import FilterActions from "~/common/filterActions/filterActions";
import Product from "~/models/product";
import K from "~/utilities/constants";
import { isPermissionPresent } from "~/utilities/generalUtility";
import ProductModal from "./productModal";
import { useSelector } from "react-redux";
import CsvModal from "./csvModal";

const ProductAntd = () => {
  const [form] = Form.useForm();
  const editId = useRef(null);
  const searchInput = useRef(null);

  const [payload, setPayload] = useState({
    page: 1,
    limit: 10,
    query: "",
    filterType: "antd",
    sortBy: undefined,
    sortOrder: undefined,
  });
  const [productData, setProductData] = useState({ products: [], total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setisCsvModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const userData = useSelector(selectUser);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const downloadCSV = (csvContent, filename = "export.csv") => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCsvFile = async () => {
    try {
      // Create a payload with the selected row keys
      const body = {
        ids: selectedRowKeys,
      };

      const csvContent = await Product.exportCsvFile(body);

      // Use the helper function to download the CSV content
      downloadCSV(csvContent, "products_export.csv");
    } catch (error) {
      console.error("Failed to export CSV file", error);
    }
  };

  const formatServerErrors = (errorsObject) => {
    // Convert errorsObject to array
    const errorsArray = Object.values(errorsObject);

    return errorsArray
      .map((errorEntry) => {
        return `Row ${errorEntry.row}: ${errorEntry.errors.join(", ")}`;
      })
      .join("\n");
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await Product.importCsvFile(formData);
      setisCsvModalOpen(false);
      fetchProductDetails();
    } catch (error) {
      const serverErrors = error?.error?.data?.errors || null;
      if (serverErrors) {
        const formattedErrors = formatServerErrors(serverErrors);
        message.error(formattedErrors);
      } else {
        message.error("An error occurred while uploading the file.");
      }
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await Product.getProductData(payload);
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
      message.error("Failed to Search");
    }
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

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
        <FilterActions
          close={close}
          confirm={confirm}
          clearFilters={clearFilters}
          handleReset={handleReset}
        />
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

  const getColumnSearchDateProps = (dataIndex) => ({
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
        <DatePicker
          style={{
            marginBottom: 8,
            display: "block",
          }}
          value={selectedKeys[0] ? dayjs(selectedKeys[0]) : null}
          onChange={(date) => {
            setSelectedKeys(date ? [date.format("YYYY-MM-DD 00:00:00")] : []);
          }}
        />
        <FilterActions
          close={close}
          confirm={confirm}
          clearFilters={clearFilters}
          handleReset={handleReset}
        />
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

  const columns = [
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
    ...(isPermissionPresent(
      K.Permissions.WriteProducts,
      userData.permissionsHash,
    )
      ? [
          {
            title: "Action",
            key: "action",
            render: (_, data) => (
              <Space>
                <Button
                  onClick={() => {
                    editId.current = data.id;
                    showModal();
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
        ]
      : []),
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    const params = { page: pagination.current, limit: pagination.pageSize };
    if (sorter.field && sorter.order) {
      params.sortBy = sorter.field;
      params.sortOrder = sorter.order === "ascend" ? "ASC" : "DESC";
    } else {
      params.sortBy = undefined;
      params.sortOrder = undefined;
    }
    setPayload((prev) => ({ ...prev, ...params, filters }));
  };

  const handleSearch = async ({ target: { value } }) => {
    setPayload((prev) => ({ ...prev, query: value, page: 1 }));
  };

  const createProducts = async (values) => {
    try {
      const res = await Product.createProductData(
        values.name,
        values.quantity,
        values.price,
      );
      setProductData((prev) => ({
        total: prev.total + 1,
        products: [...prev.products, res],
      }));
      setIsModalOpen(false);
      message.success("Product created Successfully");
    } catch (error) {
      message.error("Failed to Create Product");
    }
  };

  const onFinish = (values) => {
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

  const handleButtonDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This operation cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await Product.deleteProductData(id);
          fetchProductDetails();
          message.success("Product deleted successfully");
        } catch (error) {
          message.error("Failed to Delete Product");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleButtonEdit = async (values) => {
    try {
      await Product.updateProductData(
        values.name,
        values.quantity,
        values.price,
        editId.current,
      );
      message.success("Product updated successfully");
      fetchProductDetails();
      setIsModalOpen(false);
    } catch (error) {
      message.error("Failed to Edit the Product");
    }
  };

  const showCsvModal = () => {
    setisCsvModalOpen(true);
  };

  const handleCsvCancelButton = () => {
    setisCsvModalOpen(false);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [payload]);

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
          <Button
            type="primary"
            size="large"
            onClick={() => {
              editId.current = null;
              showModal();
            }}
          >
            Create Product
          </Button>
        }
      >
        {" "}
        <Space>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              console.log("csvModal open", showCsvModal());
            }}
          >
            Import Csv
          </Button>

          <Button onClick={handleExportCsvFile} type="primary" size="large">
            Export Csv
          </Button>
        </Space>
        <Table
          rowKey="id"
          columns={columns}
          onChange={handleTableChange}
          dataSource={productData?.products}
          scroll={{ x: 950 }}
          pagination={{
            current: payload.page,
            total: productData.total,
            pageSize: payload.limit,
          }}
          rowSelection={rowSelection}
        />
      </Card>

      <ProductModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        form={form}
        onFinish={onFinish}
        editId={editId}
      />
      <CsvModal
        handleUpload={handleUpload}
        isCsvModalOpen={isCsvModalOpen}
        handleCancel={handleCsvCancelButton}
      ></CsvModal>
    </>
  );
};

export default ProductAntd;
