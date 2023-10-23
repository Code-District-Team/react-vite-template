import { Button, Card, Form, Input, Modal, Table, message } from "antd";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import RoleAndPermission from "~/models/roleAndPermission";
// import User from "~/models/user";
import { stringSorting } from "~/utilities/generalUtility";
import RolesModal from "./rolesModal";

const { Search } = Input;

export default function RolesPermission() {
  const [form] = Form.useForm();
  const [targetKeys, setTargetKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const editId = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchedText, setSearchedText] = useState("");
  const [listing, setListing] = useState({
    roles: [],
    permissions: [],
  });
  const actionColumnRenderer = (_, record) => {
    return (
      <>
        <Button
          type="link"
          onClick={() => {
            handleEdit(record.id);
            console.log("hsbrecordid", record.id);
          }}
        >
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
    editId.current = null;
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
    editId.current = null;
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
    const data = { ...values, permissionIds: targetKeys, id: editId.current };
    if (editId.current) await updateRole(data);
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

  const handleEdit = async (roleid) => {
    try {
      const filtered = listing.roles.filter((obj) => obj.id === roleid);
      setTargetKeys(filtered[0].permissions.map((item) => item.id));
      editId.current = filtered[0].id;
      form.setFieldsValue({ name: filtered[0].name });

      showModal();
    } catch (error) {
      message.error("Failed to prepare role for editing.");
    }
  };

  const handleDelete = async (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This operation cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await RoleAndPermission.deleteRole(record.id, { name: record.name });
          setListing((prev) => ({
            ...prev,
            roles: prev.roles.filter(({ id }) => id !== record.id),
          }));
        } catch (error) {
          message.error(error);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const updateRole = async (data) => {
    try {
      const { id, ...restValues } = data;

      const res = await RoleAndPermission.updateRole(id, restValues);
      const { name } = res;
      message.success("Role updated successfully");
      form.setFieldsValue({ name: name });

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
          rowKey="id"
          dataSource={listing.roles}
          columns={columnDefs}
          scroll={{ x: 600 }}
        />
      </Card>
      <RolesModal
        isModalVisible={isModalVisible}
        editId={editId.current}
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
