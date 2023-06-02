import {
  RouterProvider as Provider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import AccessControl from "./accessControl";
import routes from "./routes";

const router = createBrowserRouter(
  createRoutesFromElements(
    routes.map((route) => (
      <Route
        key={route.path}
        element={
          <AccessControl
            routePath={route.path}
            routePermission={route.permission}
            isAuthenticated={route.authenticated}
          />
        }
      >
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