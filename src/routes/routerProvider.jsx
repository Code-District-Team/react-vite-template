import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import RouteWithSubRoutes from "./routeWithSubRoutes";
import routes from "./routes";

const router = createBrowserRouter(
  createRoutesFromElements(
    routes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={<RouteWithSubRoutes route={route} />}
      />
    ))
  )
);

export default function Routes() {
  return <RouterProvider router={router} />;
}
