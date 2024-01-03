import { ServerSideAgGrid } from "./ServerSideAgGrid";

export default {
  title: "Features/Server Side Filters/Ag Grid",
  component: ServerSideAgGrid,
  parameters: {},
};

export const Table = {
  args: {
    pageSize: 10,
    // pagination: true,
  },
};
