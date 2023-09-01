import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useMemo } from "react";
import { Data as rowData } from "~/redux/stubs/data";

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
  //   useEffect(() => {

  //     fetch("https://www.ag-grid.com/example-assets/olympic-win")
  //       .then((result) => result.json())

  //       .then((rowData) => setRowData(rowData));
  //   }, []);
  return (
    <div className="ag-theme-alpine" style={{ height: 600, maxwidth: 100 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        animateRows={true}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
};

export default AGGridTable;
