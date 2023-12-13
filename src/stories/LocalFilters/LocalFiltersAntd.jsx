import { Card, Input, Table } from "antd";
import "antd/dist/reset.css";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import User from "~/models/user";
import { stringSorting } from "~/utilities/generalUtility";

export const LocalFiltersAntd = ({ pageSize, pagination }) => {
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
  ];

  const onSearch = (evt) => {
    setSearchedText(evt.target.value);
  };

  const fetchUsers = async () => {
    try {
      const res = await User.getAll();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card
      title={
        <Input
          allowClear
          placeholder="Search in table"
          size="large"
          onChange={debounce(onSearch, 500)}
        />
      }
    >
      <Table
        rowKey="id"
        bordered
        columns={columns}
        dataSource={users}
        pagination={pagination ? { pageSize } : pagination}
      />
    </Card>
  );
};

LocalFiltersAntd.propTypes = {
  pageSize: PropTypes.number,
  pagination: PropTypes.bool,
};

LocalFiltersAntd.defaultProps = {
  pageSize: 10,
  pagination: true,
};
