import { Input, Table } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import { createLogger } from "vite";
import Product from "~/models/product";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";

const ProductAntd = () => {
  // const [searchedText, setSearchedText] = useState("");

  const [userData, setUserData] = useState({ products: [], total: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation(); // useLocation hook to get the current location object
  const searchParams = new URLSearchParams(location.search); // Create a URLSearchParams object with the current query string

  const limit = searchParams.get("limit"); // Get 'limit' parameter
  const page = searchParams.get("page"); // Get 'page' parameter
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProductDetails = async (queryParams) => {
    try {
      // const response = await Product.getProductData(limit, page);
      const response = await Product.getProductData(queryParams);

      setUserData(response.data);
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

  // const Data = [
  //   {
  //     id: 1,
  //     name: "Usama",
  //     price: "20",
  //     quantity: 20,
  //     createdAt: "2023-09-01T06:35:52.141Z",
  //     updatedAt: "2023-09-01T06:35:52.141Z",
  //   },
  // ];
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
    undefined: "ASC",
  };
  const onPageChange = (pagination, filter, sort) => {
    const { pageSize, current } = pagination;
    let queryParam = "";
    if (!sort) {
      queryParam = createQuery(current, pageSize);
    } else {
      queryParam = createQuery(
        current,
        pageSize,
        sort.field,
        sortDict[sort.order],
      );
    }
    // let queryParams = `limit=${pagination.pageSize}&page=${pagination.current}&query=${searchQuery}`;
    // if (sortDict[sort.order]) {
    //   queryParams += `&sortBy=${sort?.field}&sortOrder=${
    //     sortDict[sort.order]
    //   }&query=${searchQuery}`;
    // }
    // console.log("sort value", sort.order);
    fetchProductDetails(queryParam);
    setCurrentPage(current);
  };
  const handleSearch = async (e) => {
    try {
      const query = e.target.value;
      setSearchQuery(query);

      const queryParams = `limit=${10}&page=${1}&query=${query}`; // or whatever your default values are
      fetchProductDetails(queryParams);
      setCurrentPage(1);
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
      <Table
        rowKey="id"
        columns={Columns}
        onChange={onPageChange}
        dataSource={userData.products}
        pagination={{
          current: currentPage,
          total: userData.total,
          defaultPageSize: 10,
          pageSize: 10,
        }}
      ></Table>
    </>
  );
};

export default ProductAntd;
