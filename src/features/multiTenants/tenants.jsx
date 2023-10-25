import { Card, Table } from "antd";
import Search from "antd/es/input/Search";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import User from "~/models/user";
import { stringSorting } from "~/utilities/generalUtility";

const Tenants = () => {
  const [listing, setListing] = useState({});
  const [searchedText, setSearchedText] = useState("");

  const columnDefs = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      filteredValue: [searchedText],
      sorter: (a, b) => stringSorting(a, b, "companyName"),
      onFilter: (value, record) => {
        if (typeof record.companyName === "string") {
          return record.companyName.toLowerCase().includes(value.toLowerCase());
        }
        return false;
      },
      render: (text, record) => (
        <Link
          to={`/config/user-tenants/${record.id}`}
          onClick={() => handleCompanyClick(record.id)}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Company Email",
      dataIndex: "companyEmail",
    },
    {
      title: "Company Website",
      dataIndex: "companyWebsite",
    },
    {
      title: "Payment Method",
      dataIndex: "isPaymentMethodAttached",
    },
    {
      title: "Stripe Id",
      dataIndex: "stripeCustomerId",
    },
    {
      title: "Creted At",
      dataIndex: "createdAt",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
    },
  ];

  const getAllTenants = async () => {
    const tenants = await User.getAllTenant();
    console.log("tenants", tenants);
    setListing((prev) => {
      return { ...prev, tenants };
    });
  };

  const onSearch = (param) => {
    console.log(param.target.value);
    let value = undefined;
    if (param.target) value = param.target.value;
    else value = param;
    setSearchedText(value ? value : "");
  };

  const handleCompanyClick = async (companyId) => {
    try {
      // Set loading state here if you have one
      const response = await User.getTenantById(companyId);
      console.log(response);
      // Do something with the data, e.g., set it in state
    } catch (error) {
      console.error("Error fetching company data:", error);
      // Handle error here
    }
  };
  useEffect(() => {
    getAllTenants();
  }, []);
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
          dataSource={listing.tenants}
          columns={columnDefs}
          scroll={{ x: 600 }}
        />
      </Card>
    </>
  );
};

export default Tenants;
