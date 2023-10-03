// import { useState, useEffect } from "react";

import {
  Input,
  Button,
  Typography,
  Form,
  Modal,
  Transfer,
  Card,
  // message,
  Table,
  message,
} from "antd";
// import LayoutCss from "layout/layout.module.scss";

// import RoleAndPermission from "~/models/role/rolesAndPermission";
// import User from "~/models/user";
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
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listing, setListing] = useState({
    roles: [],
    permissions: [],
  });
  // const [sourceKeys, setSourceKeys] = useState([]);
  const [searchedText, setSearchedText] = useState("");
  // const [tableData, setTableData] = useState([]);
  // const [tempListing, setTempListing] = useState([]);
  // console.log("sourceKeys", sourceKeys);
  const actionColumnRenderer = (params, record) => {
    console.log("params", params, record);
    return (
      <>
        <Button
          type="link"
          // className={LayoutCss.appListingCardActions}
          onClick={() => handleEdit(record.id)}
        >
          Edit
        </Button>
        <Button
          type="link"
          style={{ color: "red" }}
          // className={LayoutCss.appListingCardActions}
          onClick={() => handleDelete(record.id)}
        >
          Delete
        </Button>

        {/* <Button type="link" className={LayoutCss.appListingCardActions}>
      Delete
    </Button> */}
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
    // form.resetdataIndexs();
  };
  const createRole = async (data) => {
    try {
      console.log("hsbdata", data);
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
    console.log("hsbtargetkeys", targetKeys);
    const data = { ...values, permissionIds: targetKeys, id: editId };
    console.log("hsbdata2", data);
    if (editId) await updateRole(data);
    else await createRole(data);
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([getAllRoles(), getAllPermissions()]);
      console.log("permissionshsb", getAllPermissions);
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

      // Extracting the permission IDs from the response
      const permissions = res.permissions.map((pr) => pr.id);
      console.log("Extracted Permission IDs:", permissions);

      setEditId(roleId);
      setTargetKeys([...permissions]);
      form.setFieldsValue({ name: res.name });

      showModal();
    } catch (error) {
      console.error("Detailed Error:", error);
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
      console.log("update response", res);

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
        className="roles-permission-card"
        // className={[LayoutCss.appCard, LayoutCss.rolesPermissionCard]}
        title={
          <>
            <Search
              allowClear={(e) => console.log({ e })}
              placeholder="Search"
              onSearch={onSearch}
              onChange={debounce(onSearch, 500)}

              // className={LayoutCss.appListingCardRolesTableSearch}
            />
          </>
        }
        extra={
          <>
            <div
            // className={LayoutCss.appListingCardRolesTable}
            >
              <Button
                type="primary"
                onClick={() => {
                  setTargetKeys([]);
                  form.setFieldsValue({ name: "" });
                  showModal();
                }}
                //   className={LayoutCss.appListingCardRolesTableButton}
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
        width={1050}
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
        </Form>
        <Title level={5} className="rolesTableTypography">
          Select Permissions
        </Title>
        <Transfer
          oneWay
          showSearch
          className="rolesPermissionTransfer"
          pagination={{ pageSize: 6 }}
          titles={["Source", "Target"]}
          dataSource={listing.permissions}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          rowKey={(record) => record.id}
          onChange={onChange}
          filterOption={filterOption}
          onSelectChange={onSelectChange}
          render={(item) => item.displayName}
        />
      </Modal>
    </>
  );
}
