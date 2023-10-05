import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import User from "~/models/user";
import { selectUser } from "~/redux/user/userSlice";
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
  const userData = useSelector(selectUser);
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
    const hasPermission = isPermissionPresent(
      routePermission,
      userData.permissionsHash,
    );

    if (hasPermission) {
      return <Outlet />;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  } else {
    return <Navigate to="/login" replace />;
  }
}
