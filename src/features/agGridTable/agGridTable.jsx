import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useMemo } from "react";
import { Data as rowData } from "~/redux/stubs/data";
import { Card } from "antd";

const AGGridTable = () => {
  const columnDefs = [
    {
      field: "make",
    },
    {
      field: "model",
    },
    {
      field: "price",
    },
    {
      field: "color",
    },
    {
      field: "condition",
    },
  ];

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
    }),
    [],
  );
  return (
    <Card className="card-wrapper">
      <div className="ag-theme-alpine" style={{ height: 600, maxwidth: 100 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          // rowSelection="multiple"
          // animateRows={true}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </Card>
  );
};

export default AGGridTable;
