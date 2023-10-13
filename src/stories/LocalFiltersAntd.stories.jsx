import { LocalFiltersAntd } from "./LocalFiltersAntd";

export default {
  title: "Features/ClientSideFilters/Ant Design",
  component: LocalFiltersAntd,
  parameters: {},
  // tags: ["autodocs"],
};

export const Table = {
  args: {
    pageSize: 10,
  },

  render: ({ pageSize }) => {
    return <LocalFiltersAntd pageSize={pageSize} />;
  },
};
