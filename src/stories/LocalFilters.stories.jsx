import { LocalFilters } from "./LocalFilters";

export default {
  title: "Features",
  component: LocalFilters,
  parameters: {},
  // tags: ["autodocs"],
};

export const ClientSideFilters = {
  args: {
    pageSize: 10,
  },

  render: ({ pageSize }) => {
    return <LocalFilters pageSize={pageSize} />;
  },
};
