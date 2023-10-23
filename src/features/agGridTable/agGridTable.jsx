import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { Card } from "antd";
import { tableData } from "./sampleData";

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
          rowData={tableData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </Card>
  );
};

export default AGGridTable;
