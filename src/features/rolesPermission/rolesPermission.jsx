import {
  Input,
  Button,
  Typography,
  Form,
  Modal,
  Transfer,
  Card,
  Table,
  message,
} from "antd";

import { debounce } from "lodash";
import { useEffect, useState } from "react";
import RoleAndPermission from "~/models/roleAndPermission";
import User from "~/models/user";
import { stringSorting } from "~/utilities/generalUtility";

const { Title, Paragraph } = Typography;
const { Search } = Input;

export default function RolesPermission() {
  const [form] = Form.useForm();
  const [targetKeys, setTargetKeys] = useState([]);
  // const [selectedKeys, setSelectedKeys] = useState([]);
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
        <Button type="link" danger onClick={() => handleDelete(record.id)}>
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
      // sortable: true,
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        if (typeof record.name === "string") {
          return record.name.toLowerCase().includes(value.toLowerCase());
        }
        return false; // If record.name isn't a string, we don't want it to match
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
    // form.resetdataIndexs();
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
    if (editId) await updateRole({ ...values, id: editId });
    else await createRole(values);
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

      // Extracting the permission IDs from the response
      const permissions = res.permissions.map((pr) => pr.id);

      setEditId(roleId);
      setTargetKeys(permissions);
      form.setFieldsValue({ name: res.name, permissionIds: permissions });

      showModal();
    } catch (error) {
      message.error("Failed to prepare role for editing.");
    }
  };

  const handleDelete = async (roleId) => {
    setEditId(roleId);
    try {
      // Find the role from the listing.roles state using the roleId
      const roleToDelete = listing.roles.find((role) => role.id === roleId);
      const roleName = roleToDelete ? roleToDelete.name : "";

      // Include only the roleName in the data sent to deleteRole
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
      // Extract the necessary data from the provided data object
      const { id, name, permissionIds } = data;

      // Construct the request body
      const body = {
        name: name,
        permissionIds: permissionIds,
      };

      // Call the updateRole method in the RoleAndPermission module
      const res = await RoleAndPermission.updateRole(id, body);

      message.success("Role updated successfully");
      // Re-fetch roles or permissions
      getAllRoles(); // This is the function that fetches the list initially.

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
        className="card-wrapper"
        title={
          <Search
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
              setTargetKeys([]);
              form.setFieldsValue({ name: "" });
              showModal();
            }}
          >
            <i className={"icon-plus "}></i>
            <span>Add New</span>
          </Button>
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
        </div>
      </Card>

      <Modal
        open={isModalVisible}
        okText={editId ? "Update" : "Save"}
        wrapClassName="vertical-center-modal"
        onCancel={handleCancel}
        centered
        destroyOnClose
        closeIcon={<i className="icon-closeable"></i>}
        onOk={form.submit}
        okButtonProps={{
          loading: isLoading,
          disabled: targetKeys.length === 0,
        }}
        className="s2-theme-style roles-permissions-modal"
        title={
          <Title className="ant-modal-title">
            {!editId ? "Create New" : "Update"} Roles & Permissions
            <Paragraph className="rolesTableModal">
              Please fill in all the details
            </Paragraph>
          </Title>
        }
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Role Name"
            name="name"
            rules={[
              { required: true, message: "Please enter role name!" },
              { min: 3, message: "Name must be at least 3 characters" },
              {
                max: 150,
                message: "Name cannot be longer than 150 characters",
              },
            ]}
          >
            <Input placeholder="Enter" className="rolesTableInput" />
          </Form.Item>

          <Title level={5} className="rolesTableTypography">
            Select Permissions
          </Title>
          <Form.Item name="permissionIds">
            <Transfer
              oneWay
              showSearch
              pagination={{ pageSize: 6 }}
              titles={["Source", "Target"]}
              dataSource={listing.permissions}
              targetKeys={targetKeys}
              rowKey={(record) => record.id}
              onChange={onChange}
              filterOption={filterOption}
              render={(item) => item.displayName}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
