import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useMemo, useRef, useState } from "react";
import ProductModal from "./productModal";
import { Button, Form, message } from "antd";
// import { debounce } from "lodash";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";
import Product from "~/models/product";
// import { current } from "@reduxjs/toolkit";
const ProductAGGrid = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const editId = useRef(null);
  // const [productData, setProductData] = useState({ products: [], total: 0 });
  // const [searchQuery, setSearchQuery] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  const [productId, setProductId] = useState(null);

  const fetchProductDetails = async (queryParams) => {
    try {
      // const response = await Product.getProductData(limit, page);
      const response = await Product.getProductData(queryParams);
      return response.data;
      // setProductData(response.data);
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
        // filterModel?.name?.filter,
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
    // if (query) {
    //   queryParam += `&query=${query}`;
    // }
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

  // const handleSearch = async (e) => {
  //   try {
  //     const query = e.target.value;
  //     setSearchQuery(query);
  //     const queryParams = `limit=${10}&page=${1}&query=${query}`; //l or whatever your default values are
  //     fetchProductDetails(queryParams);
  //     // setCurrentPage(1);
  //   } catch (error) {
  //     setFieldErrorsFromServer(error);
  //   }
  // };

  const handleButtonDelete = async (id) => {
    console.log("id here", id);
    debugger;
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
  const columnDefs = [
    {
      field: "id",
    },
    {
      field: "name",
      // filter: "agTextColumnFilter",
    },
    {
      field: "price",
    },
    {
      field: "quantity",
    },
    {
      field: "createdAt",
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
  //   useEffect(() => {

  //     fetch("https://www.ag-grid.com/example-assets/olympic-win")
  //       .then((result) => result.json())

  //       .then((rowData) => setRowData(rowData));
  //   }, []);
  return (
    <div className="ag-theme-alpine" style={{ height: 600, maxwidth: 100 }}>
      {/* <Input.Search
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
      </Button> */}
      <ProductModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        form={form}
        rowModelType="serverSide"
        onFinish={onFinish}
        editId={editId}
      />
      <AgGridReact
        // rowData={productData.products}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        animateRows={true}
        pagination={true}
        paginationPageSize={10}
        cacheBlockSize={10}
        onGridReady={onGridReady}
        rowModelType={"serverSide"}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default ProductAGGrid;
