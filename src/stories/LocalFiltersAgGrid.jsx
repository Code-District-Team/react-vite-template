import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { Button, Card, Input } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchUsers } from "./utilities/utilities";

export const LocalFiltersAgGrid = ({ pageSize }) => {
  const gridRef = useRef(null);
  const [users, setUsers] = useState([]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
    }),
    [],
  );

  const onSearch = (param) => {
    let value = undefined;
    if (param.target) value = param.target.value;
    else value = param;
    gridRef.current.api.setQuickFilter(value);
  };

  const columnDefs = [
    {
      headerName: "ID",
      field: "id",
    },
    {
      headerName: "First Name",
      field: "firstName",
    },
    {
      headerName: "Last Name",
      field: "lastName",
    },
    {
      headerName: "Email",
      field: "email",
    },
    {
      headerName: "Status",
      field: "status",
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: () => (
        <Button
          danger
          size="small" //onClick={() => handleDelete(data.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const fetchData = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Card
      title={
        <Input
          allowClear
          placeholder="Search in table"
          size="large"
          onSearch={onSearch}
          onChange={onSearch}
        />
      }
    >
      <div className="ag-theme-alpine" style={{ height: 400, maxwidth: 100 }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={users}
          pagination
          paginationPageSize={pageSize}
        />
      </div>
    </Card>
  );
};
