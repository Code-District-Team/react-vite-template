import { Input, Table, message } from "antd";
import { useEffect, useState } from "react";
import userList from "~/models/userList";

const columns = (searchedText) => {
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
  const [data, setData] = useState([]);
  const [searchedText, setSearchedText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await userList.getUserList({
          pageNo: 1,
          pageSize: 10,
        });

        setData(list.data.users);
      } catch (error) {
        message.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Input.Search
        placeholder={"Input search text"}
        onSearch={(value) => {
          setSearchedText(value);
        }}
        onChange={(e) => {
          setSearchedText(e.target.value);
        }}
      />
      <Table rowKey="id" columns={columns(searchedText)} dataSource={data} />
    </>
  );
};

export default TableList;
