import { Navigate } from "react-router-dom";
import User from "~/models/user";
import K from "~/utilities/constants";
import { isPermissionPresent } from "~/utilities/generalUtility";

export default function RouteWithSubRoutes({ route }) {
  if (
    !route.authenticated ||
    (route.authenticated && User.isTokenAvailable())
  ) {
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
    // Check roles
    const hasPermission = isPermissionPresent(route.permission, [
      K.Permissions.Admin,
    ]);

    if (hasPermission) {
      const component = (
        <route.component {...route} route={route}></route.component>
      );
      return route.layout ? (
        <route.layout>{component}</route.layout>
      ) : (
        component
      );
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