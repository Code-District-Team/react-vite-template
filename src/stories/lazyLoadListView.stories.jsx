import { LocalFiltersAntd } from "./LocalFiltersAntd";

export default {
  title: "Features/Lazy Loading/List View",
  component: LocalFiltersAntd,
  parameters: {},
};

export const List = {
  args: {
    pageSize: 10,
    pagination: true,
  },
};
