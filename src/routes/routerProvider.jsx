import { Suspense } from "react";
import {
  RouterProvider as Provider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import ErrorBoundary from "~/common/errorBoundary/errorBoundary";
import Spinner from "~/common/spinner/spinner";
import AccessControl from "./accessControl";
import routes from "./routes";

const router = createBrowserRouter(
  createRoutesFromElements(
    routes.map((route) => (
      <Route
        key={route.path}
        element={
          <ErrorBoundary>
            <AccessControl
              routePath={route.path}
              routePermission={route.permission}
              isAuthenticatedRoute={route.authenticated}
            />
          </ErrorBoundary>
        }
      >
        <Route
          path={route.path}
          element={
            route.layout ? (
              <route.layout>
                <Suspense fallback={<Spinner />}>
                  <route.component route={route} />
                </Suspense>
              </route.layout>
            ) : (
              <route.component route={route} />
            )
          }
        />
      </Route>
    )),
  ),
);

export default function RouterProvider() {
  return <Provider router={router} />;
}
