import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProductModal from "./productModal";
import { Button, Card, Form, Input, message } from "antd";
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
  const datasource = useCallback(
    {
      async getRows(params) {
        console.log(params.request);
        const { startRow, endRow } = params.request;
        const payload = Object.keys(params.request.filterModel).map((key) => {
          // ['name',price].map((key)=>{}) filter['name']
          let result = {
            field: key,
          };
          if (params.request.filterModel[key].condition1) {
            result = {
              ...result,
              ...params.request.filterModel[key],
            };
          } else {
            result["condition1"] = params.request.filterModel[key];
          }
          return result;
        });
        console.log("Payload", payload);
        const limit = endRow - startRow;
        const page = startRow / limit + 1;
        // const query = createQuery(
        //   value,
        //   limit,
        //   params.request.sortModel[0]?.colId,
        //   params.request.sortModel.length > 0
        //     ? sortDict[params.request.sortModel[0]["sort"]]
        //     : null,
        //   searchQuery,
        // );

        const body = {
          page,
          limit,
          query: searchQuery,
          sortBy: params.request.sortModel[0]?.colId,
          sortOrder:
            params.request.sortModel.length > 0
              ? sortDict[params.request.sortModel[0]["sort"]]
              : null,
          agGrid: payload.length == 0 ? null : payload,
        };
        const data = await fetchProductDetails(body);
        params.success({
          rowData: data.products,
          rowCount: data.total,
        });
      },
    },
    [searchQuery],
  );
  const onGridReady = (params) => {
    params.api.setServerSideDatasource(datasource);
  };

  const createQuery = (page, limit, sortBy, sortOrder) => {
    let queryParam = `page=${page}&limit=${limit}`;
    if (sortBy) {
      queryParam += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    }
    // if (searchQuery) {
    //   queryParam += `&query=${searchQuery}`;
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
        <span className="ml-3">
          <Button onClick={() => handleButtonDelete(productId)}>Delete</Button>
        </span>
      </>
    );
  };

  const gridRef = useRef(null);

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
          <>
            <Input
              size="large"
              placeholder="Search"
              onChange={debounce((value) => {
                console.log("our value", value.target.defaultValue);
                setSearchQuery(value.target.defaultValue);
              }, 500)}
            ></Input>
          </>
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
        <div className="ag-theme-alpine" style={{ height: 600, maxwidth: 100 }}>
          <ProductModal
            isModalOpen={isModalOpen}
            handleCancel={handleCancel}
            form={form}
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
      </Card>
    </>
  );
};

export default ProductAGGrid;
