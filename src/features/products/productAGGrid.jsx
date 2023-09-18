import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductModal from "./productModal";
import { Button, Form, Input, message } from "antd";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";
import Product from "~/models/product";
import { debounce } from "lodash";
const ProductAGGrid = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const editId = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gridApi, setGridApi] = useState(null);
  const [productId, setProductId] = useState(null);

  const fetchProductDetails = async (queryParams) => {
    try {
      const response = await Product.getProductData(queryParams);
      return response.data;
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };
  const sortDict = {
    asc: "ASC",
    desc: "DESC",
  };
  const datasource = {
    async getRows(params) {
      console.log(params.request);
      const { startRow, endRow } = params.request;

      const limit = endRow - startRow;
      const value = startRow / limit + 1;
      const query = createQuery(
        value,
        limit,
        params.request.sortModel[0]?.colId,
        params.request.sortModel.length > 0
          ? sortDict[params.request.sortModel[0]["sort"]]
          : null,
        searchQuery,
      );
      const data = await fetchProductDetails(query);
      params.success({
        rowData: data.products,
        rowCount: data.total,
      });
    },
  };
  const onGridReady = (params) => {
    params.api.setServerSideDatasource(datasource);
  };

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

  const createProducts = async (values) => {
    try {
      await Product.createProductData(
        values.name,
        parseInt(values.quantity),
        parseFloat(values.price),
      );
      fetchProductDetails(createQuery(1, 100));
      setIsModalOpen(false);
      message.success("Product created Successfully");
    } catch (error) {
      setFieldErrorsFromServer(error);
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
      fetchProductDetails(createQuery(1, 100));
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
      fetchProductDetails(createQuery(1, 100));
      setIsModalOpen(false);
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };

  const buttonComponent = (params) => {
    const data = params.data; // Get the row data object
    const productId = data.id; // Extract the id from the row data object
    return (
      <>
        <span>
          <Button
            onClick={() => {
              console.log("data", productId);
              editId.current = true;
              showModal();
              setProductId(productId);
              form.setFieldsValue(data);
            }}
          >
            Edit
          </Button>
        </span>
        <span>
          <Button onClick={() => handleButtonDelete(productId)}>Delete</Button>
        </span>
      </>
    );
  };

  const gridRef = useRef(null);

  const columnDefs = [
    {
      field: "id",
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
    },
    {
      field: "updatedAt",
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
    <div className="ag-theme-alpine" style={{ height: 600, maxwidth: 100 }}>
      <Input
        allowClear
        className="mb-3"
        size="large"
        placeholder="Search"
        onChange={debounce((value) => {
          console.log("our value", value.target.defaultValue);
          setSearchQuery(value.target.defaultValue);
        }, 500)}
      ></Input>
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
        rowModelType="serverSide"
        onFinish={onFinish}
        editId={editId}
      />
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        animateRows={true}
        pagination={true}
        paginationPageSize={10}
        cacheBlockSize={10}
        onGridReady={(params) => {
          setGridApi(params.api);
          onGridReady;
        }}
        rowModelType={"serverSide"}
        domLayout="autoHeight"
        serverSideDatasource={datasource}
      />
    </div>
  );
};

export default ProductAGGrid;
