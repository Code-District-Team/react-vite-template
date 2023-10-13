import { Button, Card, Input, Table } from "antd";
import "antd/dist/reset.css";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { stringSorting } from "~/utilities/generalUtility";
import PropTypes from "prop-types";
import { fetchUsers } from "./utilities/utilities";

export const LocalFiltersAntd = ({ pageSize }) => {
  const [searchedText, setSearchedText] = useState("");
  const [users, setUsers] = useState([]);

  const onTableFilter = (value, record) => {
    return (
      [record.id, record.age].includes(+value) ||
      record.firstName?.toLowerCase().includes(value.toLowerCase()) ||
      record.lastName?.toLowerCase().includes(value.toLowerCase()) ||
      record.email?.toLowerCase().includes(value.toLowerCase()) ||
      record.address?.toLowerCase().includes(value.toLowerCase())
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => stringSorting(a, b, "id"),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      filteredValue: [searchedText],
      onFilter: onTableFilter,
      sorter: (a, b) => stringSorting(a, b, "firstName"),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: (a, b) => stringSorting(a, b, "lastName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => stringSorting(a, b, "email"),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <Button
          danger
          size="small" //onClick={() => handleDelete(data.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const onSearch = (param) => {
    let value = undefined;
    if (param.target) value = param.target.value;
    else value = param;
    setSearchedText(value ? value : "");
  };

  const fetchData = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card
      title={
        <Input
          allowClear
          placeholder="Search in table"
          size="large"
          onSearch={onSearch}
          onChange={debounce(onSearch, 500)}
        />
      }
    >
      <Table
        rowKey="id"
        bordered
        columns={columns}
        dataSource={users}
        pagination={{ pageSize }}
      />
    </Card>
  );
};

LocalFiltersAntd.propTypes = {
  pageSize: PropTypes.number,
};

LocalFiltersAntd.defaultProps = {
  pageSize: 10,
};
