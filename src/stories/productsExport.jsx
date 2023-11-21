import { Button, Card, Space, Table, message } from "antd";
import { useEffect, useState } from "react";
import CsvModal from "~/features/products/csvModal";
import Product from "~/models/product";
import { downloadCSV } from "~/utilities/generalUtility";

export const ImportExportProducts = () => {
  const [products, setProducts] = useState([]);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [serverErrors, setServerErrors] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
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
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Failed to export CSV file", error);
    }
  };

  const formatServerErrors = (errorsObject) => {
    // Convert errorsObject to array
    const errorsArray = Object.values(errorsObject);

    return errorsArray
      .map(
        (errorEntry) =>
          `Row ${errorEntry.row}: ${errorEntry.errors.join(", ")}`,
      )
      .join("\n");
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await Product.importCsvFile(formData);
      setIsCsvModalOpen(false);
      setRefetch(!refetch);
      message.success("Products added successfully");
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

  const fetchProducts = async () => {
    try {
      const response = await Product.getAll();
      setProducts(response);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product Name",
      dataIndex: "name",
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
  ];

  const showCsvModal = () => {
    setIsCsvModalOpen(true);
  };

  const handleCancel = () => {
    setIsCsvModalOpen(false);
    setServerErrors([]);
  };

  useEffect(() => {
    fetchProducts();
  }, [refetch]);

  return (
    <>
      <Card
        className="card-wrapper"
        extra={
          <Space>
            <Button type="primary" size="large" onClick={showCsvModal}>
              Import CSV
            </Button>

            <Button
              disabled={selectedRowKeys.length === 0}
              onClick={handleExportCsvFile}
              type="primary"
              size="large"
            >
              Export CSV
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={products}
          scroll={{ x: 950 }}
          rowSelection={rowSelection}
        />
      </Card>

      <CsvModal
        serverErrors={serverErrors}
        handleUpload={handleUpload}
        isCsvModalOpen={isCsvModalOpen}
        handleCancel={handleCancel}
      />
    </>
  );
};
