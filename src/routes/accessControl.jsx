import { Navigate, Outlet } from "react-router-dom";
import User from "~/models/user";
import K from "~/utilities/constants";
import {
  isPermissionPresent,
  redirectIfInvalidTenant,
} from "~/utilities/generalUtility";

export default function AccessControl({ route }) {
  if (
    !route.authenticated ||
    (route.authenticated && User.isTokenAvailable())
  ) {
    // * Check domain prefix
    if (K.Network.URL.IsMultiTenant) redirectIfInvalidTenant();

    if (
      ["/login", "/forgot-password", "/set-password"].includes(route.path) &&
      User.isTokenAvailable()
    )
      return (
        <Navigate
          replace
          to={{ pathname: "/", state: { from: route.location } }}
        />
      );
    // Check permission
    const hasPermission = isPermissionPresent(route.permission, [
      K.Permissions.Admin,
    ]);

    if (hasPermission) {
      return <Outlet />;
    } else {
      return <Navigate replace to={{ pathname: "/unauthorized" }} />;
    }
  } else {
    return (
      <Navigate
        replace
        to={{ pathname: "/login", state: { from: route.location } }}
      />
    );
  }
}
