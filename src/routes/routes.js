import { lazy } from "react";
import AGGridTable from "~/features/agGridTable/agGridTable";
import ChangePassword from "~/features/changepassword/changePassword";
import Counter from "~/features/counter/Counter";
import Dashboard from "~/features/dashboard/dashboard";
import ForgotPassword from "~/features/forgotPassword/forgotPassword";
import Login from "~/features/login/login";
import Tenants from "~/features/multiTenants/tenants";
import UserTenants from "~/features/multiTenants/userTenants";
import NotFound from "~/features/notFound/notFound";
import Register from "~/features/register/register";
import SetPassword from "~/features/setPassword/setPassword";
import Settings from "~/features/settings/settings";
import Unauthorized from "~/features/unauthorized/unauthorized";
import CreateUser from "~/features/users/createUser";
import GuestPageLayout from "~/layout/guestPageLayout";
import LoggedInPageLayout from "~/layout/loggedInPageLayout";
import K from "~/utilities/constants";

const Users = lazy(() => import("~/features/users/users"));
const Profile = lazy(() => import("~/features/profile/profile"));
const Projects = lazy(() => import("~/features/projects/projects"));
const ProductAntd = lazy(() => import("~/features/products/productAntd"));
const ProductAGGrid = lazy(() => import("~/features/products/productAGGrid"));
const ProductGridView = lazy(
  () => import("~/features/products/productGridView"),
);
const ProductListView = lazy(
  () => import("~/features/products/productListView"),
);
const RolesPermission = lazy(
  () => import("~/features/rolesPermission/rolesPermission"),
);
/* 
  * Template for a route
  {
    path: '/login',
    name: "Login",
    component: Login,
    authenticated: false,
    permission: [],
    children: [],
    exact: true,
    layout: LoggedInPageLayout
  }
*/

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    layout: GuestPageLayout,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    layout: GuestPageLayout,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    layout: GuestPageLayout,
  },
  {
    path: "/set-password",
    name: "SetPassword",
    component: SetPassword,
    layout: GuestPageLayout,
  },
  {
    path: "/profile",
    name: "ProfilePage",
    component: Profile,
    layout: LoggedInPageLayout,
  },
  {
    path: "/projects",
    name: "Projects",
    component: Projects,
    authenticated: true,
    permission: K.Permissions.Admin,
    // children: defaultCrudChildren, // TODO: need to implement children functionality in routes
    layout: LoggedInPageLayout,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    authenticated: true,
    // permission: K.Permissions.ReadUser,
    layout: LoggedInPageLayout,
  },
  {
    path: "/users/create",
    name: "Create",
    component: CreateUser,
    authenticated: true,
    // permission: K.Permissions.Admin,
    layout: LoggedInPageLayout,
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    authenticated: true,
    layout: LoggedInPageLayout,
  },
  {
    path: "/counter",
    name: "Counter",
    component: Counter,
    layout: LoggedInPageLayout,
  },
  {
    path: "/change-password",
    name: "ChangePassword",
    component: ChangePassword,
    layout: LoggedInPageLayout,
  },
  {
    path: "/unauthorized",
    name: "Unauthorized",
    component: Unauthorized,
    authenticated: true,
    layout: GuestPageLayout,
  },
  {
    path: "/projects/ag-grid",
    name: "Ag-Grid",
    component: AGGridTable,
    authenticated: true,
    // permission: K.Permissions.ReadProducts,
    layout: LoggedInPageLayout,
  },
  {
    path: "/products/product-ag-grid",
    name: "Prod-AG-Grid",
    authenticated: true,
    // permission: K.Permissions.ReadProducts,
    component: ProductAGGrid,
    layout: LoggedInPageLayout,
  },
  {
    path: "/products/product-antd",
    name: "Prod-Antd",
    // permission: K.Permissions.ReadProducts,
    authenticated: true,
    component: ProductAntd,
    layout: LoggedInPageLayout,
  },
  {
    path: "/products/grid-view-virtual-listing",
    name: "Grid-View",
    permission: K.Permissions.ReadProducts,
    authenticated: true,
    component: ProductGridView,
    layout: LoggedInPageLayout,
  },
  {
    path: "/products/list-view-virtual-listing",
    name: "List-View",
    permission: K.Permissions.ReadProducts,
    authenticated: true,
    component: ProductListView,
    layout: LoggedInPageLayout,
  },
  {
    path: "/config",
    name: "Configurations",
    // permission: K.Permissions.Admin,
    authenticated: true,
    component: RolesPermission,
    layout: LoggedInPageLayout,
  },
  {
    path: "/config/tenants",
    name: "Tenants",
    // permission: K.Permissions.Admin,
    authenticated: true,
    component: Tenants,
    layout: LoggedInPageLayout,
  },
  {
    path: "/config/user-tenants/:id",
    name: "TenantsName",
    // permission: K.Permissions.Admin,
    authenticated: true,
    component: UserTenants,
    layout: LoggedInPageLayout,
  },
  {
    path: "/config/settings",
    name: "Settings",
    // permission: K.Permissions.Admin,
    authenticated: true,
    component: Settings,
    layout: LoggedInPageLayout,
  },

  {
    path: "*",
    name: "Not Found",
    component: NotFound,
    layout: GuestPageLayout,
  },
];

export default routes;
