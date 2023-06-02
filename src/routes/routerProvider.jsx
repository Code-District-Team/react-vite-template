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
      <Route key={route.path} element={<AccessControl route={route} />}>
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

/* const router2 = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="projects">
        <Route index element={<Projects />} />
        <Route path="create" element={<CreateProjects />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
console.log(router2); */

export default function RouterProvider() {
  return <Provider router={router} />;
}

/*
{route?.children?.map((childRoute) => {
            return (
              <Route
                key={childRoute.path}
                element={<RouteWithSubRoutes route={childRoute} />}
              >
                <Route
                  path={childRoute.path}
                  element={
                    childRoute.layout ? (
                      <childRoute.layout>
                        <childRoute.component route={route} />
                      </childRoute.layout>
                    ) : (
                      <childRoute.component route={route} />
                    )
                  }
                />
              </Route>
            );
          })}
 */
