import {
  DashboardOutlined,
  ProjectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import K from "~/utilities/constants";

// Template a navigation item
// {
//     name: 'User',
//     path: '/user/list',
//     icon: <ProjectOutlined />,
//     roles: [],
//     children: [], // If item has children, then the path field will be ignored.
// }

const defaultChildren = (basePath) => [
  { path: basePath, name: "List" },
  { path: `${basePath}/store/create`, name: "Create", roles: [K.Roles.Admin] },
];

const navigations = [
  {
    name: "Projects",
    icon: <ProjectOutlined />,
    roles: [],
    children: defaultChildren("/projects"),
  },
  {
    name: "Users",
    icon: <UserOutlined />,
    children: defaultChildren("/users"),
  },
  {
    name: "Dashboard",
    path: "/",
    icon: <DashboardOutlined />,
  },
];

export default navigations;
