import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Input, Space, Table, message } from "antd";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";

const FilterActions = ({ confirm, close, clearFilters, handleReset }) => {
  return (
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
  );
};

export const ServerSideAntd = () => {
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [productData, setProductData] = useState({ products: [], total: 0 });
  const [payload, setPayload] = useState({
    page: 1,
    limit: 5,
    query: "",
    filterType: "antd",
    sortBy: undefined,
    sortOrder: undefined,
  });

  const handleSearch = async ({ target: { value } }) => {
    setPayload((prev) => ({ ...prev, query: value, page: 1 }));
  };

  const handleQuickSearch = async (selectedKeys, confirm, dataIndex) => {
    try {
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
      confirm();
    } catch (error) {
      message.error("Failed to Search");
    }
  };

  const handleReset = (clearFilters) => {
    setSearchText("");
    clearFilters();
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
            handleQuickSearch(selectedKeys, confirm, dataIndex);
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

  const fetchProducts = async () => {
    fetch("http://localhost:8082/product/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(({ data }) => {
        setProductData(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchProducts();
  }, [payload]);

  return (
    <Card
      title={
        <Input
          allowClear
          size="large"
          placeholder="Search"
          onChange={debounce(handleSearch, 500)}
        />
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        onChange={handleTableChange}
        scroll={{ x: 950 }}
        dataSource={productData.products}
        pagination={{
          current: payload.page,
          total: productData.total,
          pageSize: payload.limit,
        }}
      />
    </Card>
  );
};

/* ServerSideAntd.propTypes = {
  pageSize: PropTypes.number,
};

ServerSideAntd.defaultProps = {
  pageSize: 10,
};
 */
