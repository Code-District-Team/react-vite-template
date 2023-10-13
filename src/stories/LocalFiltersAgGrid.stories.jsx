import { LocalFiltersAgGrid } from "./LocalFiltersAgGrid";

export default {
  title: "Features/ClientSideFilters/Ag Grid",
  component: LocalFiltersAgGrid,
  parameters: {},
  // tags: ["autodocs"],
};

export const Table = {
  args: {
    pageSize: 10,
    pagination: true,
  },

  //   render: ({ pageSize }) => {
  //     return <LocalFiltersAgGrid pageSize={pageSize} />;
  //   },
};
