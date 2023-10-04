import { Input, Button, Typography, Form, Card, Table, message } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import RoleAndPermission from "~/models/roleAndPermission";
import User from "~/models/user";
import { stringSorting } from "~/utilities/generalUtility";
import RolesModal from "./rolesModal";

const { Title, Paragraph } = Typography;
const { Search } = Input;

export default function RolesPermission() {
  const [form] = Form.useForm();
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listing, setListing] = useState({
    roles: [],
    permissions: [],
  });
  const [searchedText, setSearchedText] = useState("");
  const actionColumnRenderer = (params, record) => {
    return (
      <>
        <Button type="link" onClick={() => handleEdit(record.id)}>
          Edit
        </Button>
        <Button
          type="link"
          style={{ color: "red" }}
          onClick={() => handleDelete(record.id)}
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
      sortable: true,
    },
    {
      title: "Role Name",
      dataIndex: "name",
      sorter: (a, b) => stringSorting(a, b, "name"),
      filteredValue: [searchedText],
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
      sortable: true,
      resizable: false,
      headerClass: "text-center",
      cellStyle: { textAlign: "center" },
      render: (id, record) => actionColumnRenderer(id, record),
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
  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
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
      const res = await RoleAndPermission.createRole(User.getId(), data);
      message.success("Role created successfully");
      setListing((prev) => {
        return {
          ...prev,
          roles: [...prev.roles, res],
        };
      });
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
      console.log("Fetched Role Response:", res);

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

  const handleDelete = async (roleId) => {
    setEditId(roleId);
    try {
      const roleToDelete = listing.roles.find((role) => role.id === roleId);
      const roleName = roleToDelete ? roleToDelete.name : "";
      const data = { name: roleName };

      const res = await RoleAndPermission.deleteRole(roleId, data);
      console.log("Response", res);
      getAllRoles();
    } catch (error) {
      message.error(error);
    }
  };

  const updateRole = async (data) => {
    try {
      const { id, name, permissionIds } = data;

      const body = {
        name: name,
        permissionIds: permissionIds,
      };
      const res = await RoleAndPermission.updateRole(id, body);
      message.success("Role updated successfully");
      getAllRoles();
      setListing((prev) => {
        return {
          ...prev,
          roles: prev.roles.map((item) => {
            if (item.id === res.id) return res;
            return item;
          }),
        };
      });

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
        className="roles-permission-card"
        title={
          <>
            <Search
              allowClear={(e) => console.log({ e })}
              placeholder="Search"
              onSearch={onSearch}
              onChange={debounce(onSearch, 500)}
            />
          </>
        }
        extra={
          <>
            <div>
              <Button
                type="primary"
                onClick={() => {
                  setTargetKeys([]);
                  form.setFieldsValue({ name: "" });
                  showModal();
                }}
              >
                <i className={"icon-plus "}></i>
                <span>Add New</span>
              </Button>
            </div>
          </>
        }
      >
        <div
          className="ag-theme-alpine s2-theme-style"
          style={{
            height: 735,
          }}
        >
          <Table
            dataSource={listing.roles}
            columns={columnDefs}
            scroll={{ x: 600 }}
          />
          <RolesModal
            isModalVisible={isModalVisible}
            editId={editId}
            Title={Title}
            Paragraph={Paragraph}
            handleCancel={handleCancel}
            form={form}
            isLoading={isLoading}
            targetKeys={targetKeys}
            onFinish={onFinish}
            listing={listing}
            selectedKeys={selectedKeys}
            onChange={onChange}
            filterOption={filterOption}
            onSelectChange={onSelectChange}
          />
        </div>
      </Card>
    </>
  );
}
