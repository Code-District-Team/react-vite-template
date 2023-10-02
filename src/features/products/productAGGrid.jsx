import { AgGridReact } from "ag-grid-react";
import { Button, Card, Form, Input, message } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Product from "~/models/product";
import ProductModal from "./productModal";

const sortDict = {
  asc: "ASC",
  desc: "DESC",
};

const ProductAGGrid = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [form] = Form.useForm();
  const editId = useRef(null);
  const gridRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gridApi, setGridApi] = useState(null);
  const [productId, setProductId] = useState(null);

  const datasource = useCallback(
    {
      async getRows(params) {
        const { startRow, endRow } = params.request;
        const payload = Object.keys(params.request.filterModel).map((key) => {
          if ("condition1" in params.request.filterModel[key]) {
            return {
              field: key,
              ...params.request.filterModel[key],
            };
          } else {
            return {
              field: key,
              condition1: params.request.filterModel[key],
            };
          }
        });
        const limit = endRow - startRow;
        const page = startRow / limit + 1;

        const body = {
          page,
          limit,
          query: searchQuery,
          sortBy: params.request.sortModel[0]?.colId,
          sortOrder:
            params.request.sortModel.length > 0
              ? sortDict[params.request.sortModel[0]["sort"]]
              : null,
          agGrid: payload.length === 0 ? null : payload,
        };
        try {
          const { data } = await Product.getProductData(body);
          params.success({
            rowData: data.products,
            rowCount: data.total,
          });
        } catch (err) {
          params.fail();
        }
      },
    },
    [searchQuery, refreshTable],
  );
  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.setServerSideDatasource(datasource);
  };

  const createProducts = async (values) => {
    try {
      await Product.createProductData(
        values.name,
        values.quantity,
        values.price,
      );
      setIsModalOpen(false);
      setRefreshTable(!refreshTable);
      message.success("Product created Successfully");
    } catch (err) {
      console.error(err);
    }
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
  const onFinish = async (values) => {
    if (!editId.current) {
      createProducts(values);
    } else {
      handleButtonEdit(values);
    }
    form.resetFields();
  };

  const handleButtonDelete = async (id) => {
    try {
      await Product.deleteProductData(id);
      setRefreshTable(!refreshTable);
    } catch (error) {
      console.error(error);
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
      setIsModalOpen(false);
      setRefreshTable(!refreshTable);
    } catch (error) {
      console.error(error);
    }
  };

  const buttonComponent = (params) => {
    const data = params.data; // Get the row data object
    const productId = data.id; // Extract the id from the row data object
    return (
      <>
        <Button
          onClick={() => {
            editId.current = true;
            showModal();
            setProductId(productId);
            form.setFieldsValue(data);
          }}
        >
          Edit
        </Button>
        <Button className="ml-2" onClick={() => handleButtonDelete(productId)}>
          Delete
        </Button>
      </>
    );
  };

  const columnDefs = [
    {
      field: "id",
      flex: 1,
    },
    {
      field: "name",
      filter: "agTextColumnFilter",
    },
    {
      field: "price",
      filter: "agNumberColumnFilter",
    },
    {
      field: "quantity",
      filter: "agNumberColumnFilter",
    },
    {
      field: "createdAt",
      filter: "agDateColumnFilter",
      flex: 1,
    },
    {
      field: "updatedAt",
      flex: 1,
    },
    {
      field: "actions",
      cellRenderer: buttonComponent,
    },
  ];

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      floatingfilter: true,
    }),
    [],
  );

  useEffect(() => {
    if (gridApi) {
      gridApi.purgeServerSideCache; // This will refresh the data by calling getRows again
    }
  }, [searchQuery, gridApi]);

  return (
    <>
      <Card
        className="card-wrapper"
        title={
          <Input
            size="large"
            placeholder="Search"
            onChange={debounce((value) => {
              setSearchQuery(value.target.defaultValue);
            }, 500)}
          />
        }
        extra={
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
        }
      >
        <div className="ag-theme-alpine" style={{ height: 600, maxwidth: 100 }}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            cacheBlockSize={10}
            onGridReady={onGridReady}
            rowModelType="serverSide"
            domLayout="autoHeight"
            serverSideDatasource={datasource}
          />
        </div>
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

export default ProductAGGrid;
