import { Button, Card, Form, Input, Table, message } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import RoleAndPermission from "~/models/roleAndPermission";
import User from "~/models/user";
import { stringSorting } from "~/utilities/generalUtility";
import RolesModal from "./rolesModal";

const { Search } = Input;

export default function RolesPermission() {
  const [form] = Form.useForm();
  const [targetKeys, setTargetKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchedText, setSearchedText] = useState("");
  const [listing, setListing] = useState({
    roles: [],
    permissions: [],
  });
  const actionColumnRenderer = (_, record) => {
    return (
      <>
        <Button type="link" onClick={() => handleEdit(record.id)}>
          Edit
        </Button>
        <Button
          type="link"
          danger
          onClick={() => {
            handleDelete(record);
          }}
        >
          Delete
        </Button>
      </>
    );
  };

  const columnDefs = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Role Name",
      dataIndex: "name",
      filteredValue: [searchedText],
      sorter: (a, b) => stringSorting(a, b, "name"),
      onFilter: (value, record) => {
        if (typeof record.name === "string") {
          return record.name.toLowerCase().includes(value.toLowerCase());
        }
        return false;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: actionColumnRenderer,
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setEditId(null);
    setIsModalVisible(false);
    form.resetdataIndexs();
    setTargetKeys([]);
  };

  const getAllRoles = async () => {
    const roles = await RoleAndPermission.getAllRoles();
    setListing((prev) => {
      return { ...prev, roles };
    });
  };

  const getAllPermissions = async () => {
    const permissions = await RoleAndPermission.getAllPermissions();
    setListing((prev) => {
      return {
        ...prev,
        permissions: permissions.map((perm) => ({
          ...perm,
          displayName: perm.name,
        })),
      };
    });
  };

  const setInitialValues = () => {
    setIsModalVisible(false);
    setTargetKeys([]);
    setEditId(null);
  };
  const createRole = async (data) => {
    try {
      const res = await RoleAndPermission.createRole(data);
      message.success("Role created successfully");
      setListing((prev) => ({
        ...prev,
        roles: [...prev.roles, res],
      }));
      setInitialValues();
    } catch (error) {
      message.error(error.message);
    }
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    const data = { ...values, permissionIds: targetKeys, id: editId };
    if (editId) await updateRole(data);
    else await createRole(data);
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([getAllRoles(), getAllPermissions()]);
    })();
  }, []);

  const onChange = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  const filterOption = (inputValue, option) =>
    option.displayName.toLowerCase().indexOf(inputValue) > -1;

  const handleEdit = async (roleId) => {
    try {
      const res = await RoleAndPermission.getRoleById(roleId, User.getId());

      if (!res || !res.permissions) {
        throw new Error("Unexpected data structure from getRoleById.");
      }

      const permissions = res.permissions.map((pr) => pr.id);

      setEditId(roleId);
      setTargetKeys([...permissions]);
      form.setFieldsValue({ name: res.name });

      showModal();
    } catch (error) {
      message.error("Failed to prepare role for editing.");
    }
  };

  const handleDelete = async (record) => {
    try {
      await RoleAndPermission.deleteRole(record.id, { name: record.name });
      setListing((prev) => ({
        ...prev,
        roles: prev.roles.filter(({ id }) => id !== record.id),
      }));
    } catch (error) {
      message.error(error);
    }
  };

  const updateRole = async (data) => {
    try {
      const { id, ...restValues } = data;

      // const res =
      await RoleAndPermission.updateRole(id, restValues);
      message.success("Role updated successfully");
      getAllRoles();
      // TODO: Need to update state on update remove above API Call
      /* setListing((prev) => {
        return {
          ...prev,
          roles: prev.roles.map((item) => {
            if (item.id === res.id) return res;
            return item;
          }),
        };
      }); */

      setInitialValues();
    } catch (error) {
      message.error(error.message);
    }
  };

  const onSearch = (param) => {
    let value = undefined;
    if (param.target) value = param.target.value;
    else value = param;
    setSearchedText(value ? value : "");
  };

  return (
    <>
      <Card
        className="card-wrapper"
        title={
          <Search
            allowClear
            size="large"
            placeholder="Search"
            onSearch={onSearch}
            onChange={debounce(onSearch, 500)}
          />
        }
        extra={
          <Button
            type="primary"
            size="large"
            onClick={() => {
              setTargetKeys([]);
              form.setFieldsValue({ name: "" });
              showModal();
            }}
          >
            Add New
          </Button>
        }
      >
        <Table
          dataSource={listing.roles}
          columns={columnDefs}
          scroll={{ x: 600 }}
        />
      </Card>
      <RolesModal
        isModalVisible={isModalVisible}
        editId={editId}
        handleCancel={handleCancel}
        form={form}
        isLoading={isLoading}
        targetKeys={targetKeys}
        onFinish={onFinish}
        listing={listing}
        onChange={onChange}
        filterOption={filterOption}
      />
    </>
  );
}
