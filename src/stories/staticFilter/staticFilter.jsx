import { Button, Card, Input, Select, Table } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import User from "~/models/user";

import { numberSorting, stringSorting } from "~/utilities/generalUtility";

export default function StaticFilter () {
    const [searchedText, setSearchedText] = useState("");
    const [userData, setUserData] = useState([]);
    const [status, setStatus] = useState(null);

    const getAllUsers = async (status) => {
        try {
            const response = await User.getAll(status);
            setUserData(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const onSearch = (param) => {
        let value = undefined;
        if (param.target) value = param.target.value;
        else value = param;
        setSearchedText(value ? value : "");
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
            title: (
                <Select
                    options={[
                        { value: "active", label: "Active" },
                        { value: "inActive", label: "In Active" },
                    ]}
                    style={{ width: "100%" }}
                    size="large"
                    value={status}
                    placeholder={"Status"}

                    onChange={(value) => {
                        getAllUsers(value);
                        setStatus(value)

                    }}
                >
                    Status
                </Select>
            ),

            dataIndex: "status",
        },
    ].filter((column) => {
        return !column.hidden;
    });

    useEffect(() => {
        getAllUsers();
    }, []);
    return (
        <>
            <Card
                className="card-wrapper"
                title={
                    <Input
                        allowClear
                        placeholder="Search"
                        style={{ width: "50%" }}
                        onChange={debounce(onSearch, 500)}
                    />
                }
                extra={
                    <>
                        <Button type="primary" onClick={() => { getAllUsers(); setStatus(null) }}>Reset Filter</Button>
                    </>
                }
            >
                <Table rowKey="id" bordered columns={columns} dataSource={userData} />
            </Card>
        </>
    );
}