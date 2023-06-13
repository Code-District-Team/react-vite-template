import { useState } from "react";
import { Table, Input, Card } from "antd";
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
        record.id.toString() === value ||
        record.age.toString() === value ||
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
    id: "1",
    firstName: "John",
    lastName: "Brown",
    email: "johnbrown@gmail.com",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    id: "2",
    firstName: "Jim",
    lastName: "Green",
    email: "jimgreen@gmail.com",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    id: "3",
    firstName: "Joe",
    lastName: "Black",
    email: "joeblack@gmail.com",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
];

const TableList = () => {
  const [searchedText, setSearchedText] = useState("");

  return (
    <>
      <Card className="ant-layout">
        <Input.Search
          style={{ marginBottom: 4 }}
          name="searchValue"
          placeholder="Input search text"
          onSearch={(value) => {
            setSearchedText(value);
          }}
          onChange={(e) => {
            setSearchedText(e.target.value);
          }}
        />
        <Table
          rowKey="id"
          columns={columns(searchedText)}
          dataSource={tableData}
        />
      </Card>
    </>
  );
};

export default TableList;
