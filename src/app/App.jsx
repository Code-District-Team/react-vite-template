import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Spinner from "~/common/spinner/spinner";
import ThemeProvider from "~/theme/themeProvider";
import User from "~/models/user";
import { setPermissionsHash } from "~/redux/user/userSlice";
import RouterProvider from "~/routes/routerProvider";

export default function App() {
  const dispatch = useDispatch();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (
      User.isTokenAvailable() &&
      !(window.location !== window.parent.location)
    ) {
      const userRoles = User.getRole();
      dispatch(setPermissionsHash(userRoles));
    }
    setShouldLoad(true);
  }, []);

  if (!shouldLoad) return <Spinner />;

  return (
    <ThemeProvider>
      <RouterProvider />
    </ThemeProvider>
  );
}
