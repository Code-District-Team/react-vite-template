import { Table, message } from "antd";
import { useEffect, useState } from "react";
import userList from "~/models/userList";
import Search from "antd/es/input/Search";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: "Email",
    dataIndex: "email",
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

const TableList = () => {
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();

  const onSearch = (value) => {
    if (value == "") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(
          (obj) =>
            obj.firstName.toUpperCase().includes(value.toUpperCase()) ||
            obj.lastName.toUpperCase().includes(value.toUpperCase()) ||
            obj.email.toUpperCase().includes(value.toUpperCase())
        )
      );
    }
  };
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
        setFilteredData(list.data.users);
      } catch (error) {
        message.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Search
        name="searchValue"
        placeholder={"Input search text"}
        onSearch={onSearch}
      />
      <Table rowKey="id" columns={columns} dataSource={filteredData} />
    </>
  );
};

export default TableList;
