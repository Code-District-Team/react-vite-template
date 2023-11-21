import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";
import FilterActions from "~/common/filterActions/filterActions";
import Product from "~/models/product";
import { selectUser } from "~/redux/user/userSlice";
import K from "~/utilities/constants";
import { isPermissionPresent } from "~/utilities/generalUtility";
import CsvModal from "./csvModal";
import ProductModal from "./productModal";
import ElementWrapper from "../stripeForm/wrapper";
import StripeModalWithSaveCard from "../stripeForm/stripeModalWithSaveCard";
import CheckoutForm from "../stripeForm/checkoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
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
  const [isStripeModalOpen, setIsStripModalOpen] = useState(false);
  const [isStripeOwnModalOpen, setIsStripeOwnModalOpen] = useState(false);
  const [isCsvModalOpen, setisCsvModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const userData = useSelector(selectUser);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [serverErrors, setServerErrors] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const stripePromise = loadStripe(K.Stripe.Key);
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
      message.success("Product Created successfully");
      fetchProductDetails();
    } catch (error) {
      const serverErrors = error?.error?.data?.errors || null;
      if (serverErrors) {
        const formattedErrors = formatServerErrors(serverErrors);
        setServerErrors(formattedErrors.split("\n"));
      } else {
        message.error("An error occurred while uploading the file.");
      }
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await Product.getByFilters(payload);
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

  const handleBuyWithSavedCard = async (amount) => {
    const body = {
      amount,
    };
    try {
      const response = await Product.stripeDeductAmount(body);

      if (response.status === "succeeded") {
        message.success("Payment successful");
      }

      if (response.status === "requires_action") {
        const { id, url, client_secret, status } = response;

        let paymentWindow = window.open(
          url,
          "PopupWindow",
          "width=600,height=400,scrollbars=no,resizable=no",
        );

        // Define the event listener function
        const handleMessage = async (event) => {
          if (event.data === "paymentCompleted") {
            paymentWindow.close();
            window.removeEventListener("message", handleMessage);

            await Product.stripeVerifyPayment(id, client_secret, status);
          }
        };

        // Add the event listener
        window.addEventListener("message", handleMessage);
      }
    } catch (error) {
      message.error("Payment was not successful");
    }
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
            render: (_, record) => (
              <Space split={<Divider type="vertical" />}>
                <Button
                  className="p-0"
                  type="link"
                  onClick={() => {
                    editId.current = record.id;
                    showModal();
                    form.setFieldsValue(record);
                  }}
                >
                  Edit
                </Button>
                <Popconfirm
                  description="Are you sure to delete this product?"
                  onConfirm={() => handleButtonDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger className="p-0">
                    Delete
                  </Button>
                </Popconfirm>

                <Button
                  type="link"
                  className="p-0"
                  onClick={() => {
                    StripeOwnModal(record.price);
                  }}
                >
                  Buy Now
                </Button>
                <Button
                  type="link"
                  className="p-0"
                  onClick={() => {
                    handleBuyWithSavedCard(record.price);
                  }}
                >
                  Buy with Saved Card
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
      const res = await Product.create(values);
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

  const handleButtonDelete = async (id) => {
    try {
      await Product.delete(id);
      setProductData((prev) => ({
        products: prev.products.filter((item) => item.id !== id),
        total: prev.total - 1,
      }));
      message.success("Product deleted successfully");
    } catch (error) {
      message.error("Failed to Delete Product");
    }
  };

  const handleButtonEdit = async (values) => {
    try {
      await Product.update(editId.current, values);
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
  const StripeOwnModal = (amount) => {
    setIsStripeOwnModalOpen(true);
    getClientSecret(amount);
  };

  const CloseStripeOwnModel = () => {
    setIsStripeOwnModalOpen(false);
  };
  const handleStripCancel = () => {
    setIsStripModalOpen(false);
  };

  const handleCsvCancelButton = () => {
    setisCsvModalOpen(false);
    setServerErrors([]);
  };
  let showChildMessage = (message) => {
    message.success(message);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [payload]);

  const getClientSecret = async (amount) => {
    const body = {
      amount,
    };
    const response = await Product.stripeCreatePaymentIntent(body);
    setClientSecret(response.clientSecret);
  };
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <Card
        className="card-wrapper"
        title={
          <Input
            allowClear
            placeholder="Search"
            onChange={debounce(handleSearch, 500)}
          />
        }
        extra={
          <Space>
            <Button type="primary" size="large" onClick={showCsvModal}>
              Import CSV
            </Button>

            <Button onClick={handleExportCsvFile} type="primary" size="large">
              Export CSV
            </Button>
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
          </Space>
        }
      >
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
        serverErrors={serverErrors}
        handleUpload={handleUpload}
        isCsvModalOpen={isCsvModalOpen}
        handleCancel={handleCsvCancelButton}
      />
      <ElementWrapper>
        <StripeModalWithSaveCard
          isStripeModalOpen={isStripeModalOpen}
          handleStripCancel={handleStripCancel}
        />
      </ElementWrapper>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            isStripeOwnModalOpen={isStripeOwnModalOpen}
            CloseStripeOwnModel={CloseStripeOwnModel}
            parentMessage={showChildMessage}
          />
        </Elements>
      )}
      {<div>{clientSecret}</div>}
    </>
  );
};

export default ProductAntd;
