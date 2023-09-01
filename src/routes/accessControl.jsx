import { Navigate, Outlet } from "react-router-dom";
import User from "~/models/user";
import K from "~/utilities/constants";
import {
  isPermissionPresent,
  redirectIfInvalidTenant,
} from "~/utilities/generalUtility";

export default function AccessControl({
  routePath,
  isAuthenticatedRoute,
  routePermission,
}) {
  if (
    !isAuthenticatedRoute ||
    (isAuthenticatedRoute && User.isTokenAvailable())
  ) {
    // * Check domain prefix
    if (K.Network.URL.IsMultiTenant) redirectIfInvalidTenant();

    if (
      ["/login", "/forgot-password", "/set-password"].includes(routePath) &&
      User.isTokenAvailable()
    )
      return <Navigate to="/" replace />;
    // Check permission
    const userRoles = User.getRole();
    const hasPermission = isPermissionPresent(routePermission, userRoles);

    if (hasPermission) {
      return <Outlet />;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  } else {
    return <Navigate to="/login" replace />;
  }
}
