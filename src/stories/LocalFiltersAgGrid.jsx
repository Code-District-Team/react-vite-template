import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { Card, Input } from "antd";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchUsers } from "./utilities/utilities";

export const LocalFiltersAgGrid = ({ pageSize, pagination }) => {
  const gridRef = useRef(null);
  const [users, setUsers] = useState([]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      flex: 1,
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
          pagination={pagination}
          paginationPageSize={pageSize}
        />
      </div>
    </Card>
  );
};

LocalFiltersAgGrid.propTypes = {
  pageSize: PropTypes.number,
  pagination: PropTypes.bool,
};

LocalFiltersAgGrid.defaultProps = {
  pageSize: 10,
  pagination: true,
};
