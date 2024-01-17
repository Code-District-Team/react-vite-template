import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import User from "~/models/user";
import { Card, Table } from "antd";
import Search from "antd/es/input/Search";
import { debounce } from "lodash";
import { stringSorting } from "~/utilities/generalUtility";

const UserTenants = () => {
  const { id } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [searchedText, setSearchedText] = useState("");

  const columnDefs = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "LastName",
      dataIndex: "lastName",
    },

    {
      title: "Email",
      dataIndex: "email",
      filteredValue: [searchedText],
      sorter: (a, b) => stringSorting(a, b, "email"),
      onFilter: (value, record) => {
        if (typeof record.email === "string") {
          return record.email.toLowerCase().includes(value.toLowerCase());
        }
        return false;
      },
    },

    {
      title: "Address",
      dataIndex: "address",
    },

    {
      title: "Mobile Phone",
      dataIndex: "mobilePhone",
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
    },
    {
      title: "Deleted At",
      dataIndex: "deletedAt",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await User.getTenantById(id);
        setCompanyData(data);
        console.log("data", data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, [id]);

  if (!companyData) {
    console.log("cData", companyData);
    return <div>Loading...</div>;
  }

  const onSearch = (param) => {
    console.log(param.target.value);
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
        // extra={
        //   <Button
        //     type="primary"
        //     size="large"
        //     // onClick={() => {
        //     //   setTargetKeys([]);
        //     //   form.setFieldsValue({ name: "" });
        //     //   showModal();
        //     // }}
        //   >
        //     Add New
        //   </Button>
        // }
      >
        <Table
          rowKey="id"
          dataSource={companyData}
          columns={columnDefs}
          scroll={{ x: 600 }}
        />
      </Card>
    </>
  );
};

export default UserTenants;
