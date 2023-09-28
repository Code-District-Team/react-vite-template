import { Button, Card, Form, Input, Table, message } from "antd";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import UserModal from "~/features/users/userModal";
import User from "~/models/user";
import K from "~/utilities/constants";
import {
  isPermissionPresent,
  numberSorting,
  setFieldErrorsFromServer,
  stringSorting,
} from "~/utilities/generalUtility";
import Spinner from "../spinner/spinner";

// const tableData = [
//   {
//     id: 1,
//     firstName: "Usama",
//     lastName: "Mehmood",
//     email: "usama.mehmood@codedistrict.com",
//     age: 26,
//     address: "New York No. 1 Lake Park",
//   },
//   {
//     id: 2,
//     firstName: "Haseeb",
//     lastName: "Awan",
//     email: "haseeb.awan@codedistrict.com",
//     age: 30,
//     address: "London No. 1 Lake Park",
//   },
//   {
//     id: 3,
//     firstName: "Ahmed",
//     lastName: "Ehsan",
//     email: "ahmed.ehsan@codedistrict.com",
//     age: 32,
//     address: "Sydney No. 1 Lake Park",
//   },
//   {
//     id: 4,
//     firstName: "Ali",
//     lastName: "Ehsan",
//     email: "ali.ehsan@codedistrict.com",
//     age: 32,
//     address: "Sydney No. 1 Lake Park",
//   },
// ];

const TableList = () => {
  const [searchedText, setSearchedText] = useState("");
  const [userData, setUserData] = useState([]);
  const userRole = User.getRole();
  const editId = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const getUserRolesData = async (values) => {
    try {
      const response = await User.GetUserRoles(values);
      setRoles(response);
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };
  const fetchUserDetails = async (values) => {
    try {
      const response = await User.userData(values);
      console.log("values");
      setUserData(response.data);
    } catch (error) {
      setFieldErrorsFromServer(error, values);
    }
  };

  const onSearch = (param) => {
    let value = undefined;
    if (param.target) value = param.target.value;
    else value = param;
    setSearchedText(value ? value : "");
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    if (!editId.current) {
      form.resetFields();
    }
    setIsModalOpen(true);
  };
  const onFinish = async (values) => {
    try {
      const response = await User.InviteUser(values.email, values.roleId);
      console.log(response);
      message.success("User Invite has been sent");
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await User.deleteUser(id);
      fetchUserDetails();
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };
  const columns = (searchedText) =>
    [
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
            record.firstName?.toLowerCase().includes(value.toLowerCase()) ||
            record.lastName?.toLowerCase().includes(value.toLowerCase()) ||
            record.email?.toLowerCase().includes(value.toLowerCase()) ||
            record.address?.toLowerCase().includes(value.toLowerCase())
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
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
      },
      {
        title: "Action",
        key: "action",
        hidden: !isPermissionPresent([K.Permissions.Admin], userRole),
        render: (_, data) => (
          <span>
            <Button onClick={() => handleDelete(data.id)}>Delete</Button>
          </span>
        ),
      },
    ].filter((column) => {
      return !column.hidden;
    });
  useEffect(() => {
    fetchUserDetails();
    getUserRolesData();
  }, []);
  if (roles.length == 0) {
    return <Spinner />;
  }
  return (
    <>
      <Card
        className="card-wrapper"
        title={
          <>
            <Input
              allowClear
              className="mb-3"
              size="large"
              placeholder="Search"
              onSearch={onSearch}
              onChange={debounce(onSearch, 500)}
            />
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
              Create User
            </Button>
          </>
        }
      >
        <Table
          rowKey="id"
          columns={columns(searchedText)}
          dataSource={userData}
        />
      </Card>
      <UserModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        form={form}
        onFinish={onFinish}
        editId={editId}
        roles={roles}
      />
    </>
  );
};

export default TableList;
