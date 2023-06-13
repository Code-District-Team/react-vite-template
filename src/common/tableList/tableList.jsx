import { Input, Table } from "antd";
import { debounce } from "lodash";
import { useState } from "react";
import { numberSorting, stringSorting } from "~/utilities/generalUtility";

const columns = (searchedText) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    sorter: (a, b) => numberSorting(a, b, "id"),
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    filteredValue: [searchedText],
    onFilter: (value, record) => {
      return (
        [record.id, record.age].includes(+value) ||
        record.firstName.toLowerCase().includes(value.toLowerCase()) ||
        record.lastName.toLowerCase().includes(value.toLowerCase()) ||
        record.email.toLowerCase().includes(value.toLowerCase()) ||
        record.address.toLowerCase().includes(value.toLowerCase())
      );
    },
    key: "name",
    sorter: (a, b) => stringSorting(a, b, "firstName"),
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    sorter: (a, b) => stringSorting(a, b, "lastName"),
  },
  {
    title: "Email",
    dataIndex: "email",

    key: "email",
    sorter: (a, b) => stringSorting(a, b, "email"),
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    sorter: (a, b) => numberSorting(a, b, "age"),
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    sorter: (a, b) => stringSorting(a, b, "address"),
  },
];

const tableData = [
  {
    id: 1,
    firstName: "Usama",
    lastName: "Mehmood",
    email: "usama.mehmood@codedistrict.com",
    age: 26,
    address: "New York No. 1 Lake Park",
  },
  {
    id: 2,
    firstName: "Haseeb",
    lastName: "Awan",
    email: "haseeb.awan@codedistrict.com",
    age: 30,
    address: "London No. 1 Lake Park",
  },
  {
    id: 3,
    firstName: "Ahmed",
    lastName: "Ehsan",
    email: "ahmed.ehsan@codedistrict.com",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
  {
    id: 4,
    firstName: "Ali",
    lastName: "Ehsan",
    email: "ali.ehsan@codedistrict.com",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
];

const TableList = () => {
  const [searchedText, setSearchedText] = useState("");

  const onSearch = (param) => {
    let value = undefined;
    if (param.target) value = param.target.value;
    else value = param;
    setSearchedText(value ? value : "");
  };

  return (
    <>
      <Input.Search
        allowClear
        className="mb-3"
        size="large"
        placeholder="Search"
        onSearch={onSearch}
        onChange={debounce(onSearch, 500)}
      />
      <Table
        rowKey="id"
        columns={columns(searchedText)}
        dataSource={tableData}
      />
    </>
  );
};

export default TableList;
