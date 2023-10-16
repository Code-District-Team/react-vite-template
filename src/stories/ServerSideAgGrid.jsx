import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { Card, Input } from "antd";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import { useCallback, useMemo, useRef, useState } from "react";

const columnDefs = [
  {
    field: "id",
  },
  {
    field: "name",
    filter: "agTextColumnFilter",
  },
  {
    field: "price",
    filter: "agNumberColumnFilter",
  },
  {
    field: "quantity",
    filter: "agNumberColumnFilter",
  },
  {
    field: "createdAt",
    filter: "agDateColumnFilter",
  },
  {
    field: "updatedAt",
  },
];

export const ServerSideAgGrid = ({ pageSize }) => {
  const gridRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      flex: 1,
    }),
    [],
  );

  const onSearch = (evt) => {
    setSearchQuery(evt.target.value);
  };

  const datasource = useCallback(
    {
      async getRows(params) {
        const { startRow, endRow } = params.request;
        const limit = endRow - startRow;
        const page = startRow / limit + 1;

        const payload = Object.keys(params.request.filterModel).map((key) =>
          "condition1" in params.request.filterModel[key]
            ? {
                field: key,
                ...params.request.filterModel[key],
              }
            : {
                field: key,
                condition1: params.request.filterModel[key],
              },
        );

        const body = {
          page,
          limit,
          filterType: "ag-grid",
          query: searchQuery,
          sortBy: params.request.sortModel[0]?.colId ?? undefined,
          sortOrder:
            params.request.sortModel[0]?.sort.toUpperCase() ?? undefined,
          agGrid: payload.length ? payload : undefined,
        };
        fetch("http://localhost:8082/product/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((res) => res.json())
          .then(({ data }) => {
            params.success({
              rowData: data.products,
              rowCount: data.total,
            });
          })
          .catch(() => {
            params.fail();
          });
      },
    },
    [searchQuery],
  );

  const onGridReady = (params) => {
    params.api.setServerSideDatasource(datasource);
  };

  return (
    <Card
      title={
        <Input
          allowClear
          placeholder="Search in table"
          size="large"
          onChange={debounce(onSearch, 500)}
        />
      }
    >
      <div className="ag-theme-alpine" style={{ height: 400, maxwidth: 100 }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={pageSize}
          cacheBlockSize={pageSize}
          onGridReady={onGridReady}
          rowModelType="serverSide"
          domLayout="autoHeight"
          serverSideDatasource={datasource}
        />
      </div>
    </Card>
  );
};

ServerSideAgGrid.propTypes = {
  pageSize: PropTypes.number,
};

ServerSideAgGrid.defaultProps = {
  pageSize: 10,
};
