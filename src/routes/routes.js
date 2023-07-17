import ProfilePage from "~/features/Profile/profile";
import ChangePassword from "~/features/changepassword/changePassword";
import { Counter } from "~/features/counter/Counter";
import Dashboard from "~/features/dashboard/dashboard";
import ForgotPassword from "~/features/forgotPassword/forgotPassword";
import Login from "~/features/login/login";
import NotFound from "~/features/notFound/notFound";
import Projects from "~/features/projects/projects";
import Register from "~/features/register/register";
import SetPassword from "~/features/setPassword/setPassword";
import Unauthorized from "~/features/unauthorized/unauthorized";
import Users from "~/features/users/users";
import GuestPageLayout from "~/layout/guestPageLayout";
import LoggedInPageLayout from "~/layout/loggedInPageLayout";
import K from "~/utilities/constants";

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

/* const defaultCrudChildren = [
  {
    path: "store/create",
    name: "Create",
    // component: CreateProjects,
    // layout: LoggedInPageLayout,
  },
]; */

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
    component: ProfilePage,
    layout: LoggedInPageLayout,
    permission: [K.Permissions.User],
  },
  {
    path: "/projects",
    name: "Projects",
    component: Projects,
    authenticated: true,
    permission: [K.Permissions.Admin],
    // children: defaultCrudChildren, // TODO: need to implement children functionality in routes
    layout: LoggedInPageLayout,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    authenticated: true,
    permission: [],
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
    path: "*",
    name: "Not Found",
    component: NotFound,
    layout: GuestPageLayout,
  },
];

export default routes;
