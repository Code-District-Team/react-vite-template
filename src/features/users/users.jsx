import { Button, Card, Form, Input, Modal, Table, message } from "antd";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import Spinner from "~/common/spinner/spinner";
import User from "~/models/user";
import K from "~/utilities/constants";
import { selectUser } from "~/redux/user/userSlice";
import {
  isPermissionPresent,
  numberSorting,
  setFieldErrorsFromServer,
  stringSorting,
} from "~/utilities/generalUtility";
import UserModal from "./userModal";
import { useSelector } from "react-redux";

export default function Users() {
  const [searchedText, setSearchedText] = useState("");
  const [userData, setUserData] = useState([]);
  const editId = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const userDataUpdate = useSelector(selectUser);
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
      const response = await User.getAll(values);
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
    if (!editId.current) form.resetFields();
    setIsModalOpen(true);
  };

  const onFinish = async (values) => {
    try {
      await User.inviteUser(values.email, values.roleId);
      message.success(`An email has been sent to ${values.email}`);
      setIsModalOpen(false);
    } catch (error) {
      setFieldErrorsFromServer(error);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This operation cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await User.deleteUser(id);
          fetchUserDetails();
        } catch (error) {
          setFieldErrorsFromServer(error);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
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
      hidden: !isPermissionPresent(
        K.Permissions.WriteProducts,
        userDataUpdate.permissionsHash,
      ),
      render: (_, data) => (
        <Button danger size="small" onClick={() => handleDelete(data.id)}>
          Delete
        </Button>
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
          <Input
            allowClear
            placeholder="Search"
            onSearch={onSearch}
            onChange={debounce(onSearch, 500)}
          />
        }
        extra={
          <Button
            type="primary"
            onClick={() => {
              editId.current = false;
              showModal();
            }}
          >
            Create User
          </Button>
        }
      >
        <Table rowKey="id" bordered columns={columns} dataSource={userData} />
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
}
