import {
  Route,
  RouterProvider as Provider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import RouteWithSubRoutes from "./routeWithSubRoutes";
import routes from "./routes";

const router = createBrowserRouter(
  createRoutesFromElements(
    routes.map((route) => (
      <Route key={route.path} element={<RouteWithSubRoutes route={route} />}>
        <Route
          path={route.path}
          element={
            route.layout ? (
              <route.layout>
                <route.component route={route} />
              </route.layout>
            ) : (
              <route.component route={route} />
            )
          }
        />
      </Route>
    ))
  )
);

export default function RouterProvider() {
  return <Provider router={router} />;
}
