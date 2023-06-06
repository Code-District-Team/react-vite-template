import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useCallback, useMemo, useRef } from "react";
import { Data } from "~/redux/stubs/data";
import Input from "antd/es/input/Input";
import { Button } from "antd";

const rowData = Data;
const AgList = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
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
    []
  );
  //   useEffect(() => {

  //     fetch("https://www.ag-grid.com/example-assets/olympic-win")
  //       .then((result) => result.json())

  //       .then((rowData) => setRowData(rowData));
  //   }, []);

  const onFilterTextChange = useCallback(() => {
    // console.log("value", gridRef);
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

  const resetSearchFilter = () => {
    // Reset the filter model
    gridRef.current.api.setFilterModel({});
    gridRef.current.columnApi.applyColumnState({
      defaultState: { sort: null },
    });
    gridRef.current.api.setQuickFilter("");
    document.getElementById("filter-text-box").value = "";
  };
  return (
    <div style={containerStyle}>
      <div className="example-wrapper"></div>
      <div className="example-header">
        <Input
          style={{ width: "200px" }}
          type="text"
          id="filter-text-box"
          placeholder="Search..."
          onInput={onFilterTextChange}
          // onChange={onFilterTextChange}
        />

        <Button onClick={resetSearchFilter}>Reset</Button>
        <div className="ag-theme-alpine" style={{ height: 600, maxwidth: 100 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection="multiple"
            animateRows={true}
            pagination={true}
            paginationPageSize={10}
            ref={gridRef}
          ></AgGridReact>
        </div>
      </div>
    </div>
  );
};

export default AgList;
