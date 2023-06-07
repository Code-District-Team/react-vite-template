import { Table, message } from "antd";
import { useEffect, useState } from "react";
import userList from "~/models/userList";
import Input from "antd/es/input/Input";

const columns = (searchedText) => {
  console.log("search text", searchedText);
  return [
    {
      title: "ID",
      dataIndex: "id",

      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Email",
      dataIndex: "email",
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          record.firstName.toLowerCase().includes(value.toLowerCase()) ||
          record.lastName.toLowerCase().includes(value.toLowerCase()) ||
          record.email.toLowerCase().includes(value.toLowerCase()) ||
          record.id === parseInt(value)
        );
      },
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
  ];
};

const TableList = () => {
  const [data, setData] = useState();
  // const [filteredData, setFilteredData] = useState();
  const [searchedText, setSearchedText] = useState("");

  // const onSearch = (value) => {
  //   if (value == "") {
  //     setFilteredData(data);
  //   } else {
  //     setFilteredData(
  //       data.filter(
  //         (obj) =>
  //           obj.firstName.toUpperCase().includes(value.toUpperCase()) ||
  //           obj.lastName.toUpperCase().includes(value.toUpperCase()) ||
  //           obj.email.toUpperCase().includes(value.toUpperCase())
  //       )
  //     );
  //   }
  // };
  useEffect(() => {
    console.log("Came in ");
    const fetchData = async () => {
      try {
        const list = await userList.getUserList({
          pageNo: 1,
          pageSize: 10,
        });
        console.log("List", list);
        setData(list.data.users);
        console.log("hs bList", list.data.users);
        // setFilteredData(list.data.users);
      } catch (error) {
        message.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Input.Search
        style={{ marginBottom: 4 }}
        name="searchValue"
        placeholder={"Input search text"}
        onSearch={(value) => {
          console.log("onsearch value", value);
          setSearchedText(value);
        }}
        onChange={(e) => {
          console.log("onchange value", e.target.value);
          setSearchedText(e.target.value);
        }}
      />
      <Table rowKey="id" columns={columns(searchedText)} dataSource={data} />
    </>
  );
};

export default TableList;
