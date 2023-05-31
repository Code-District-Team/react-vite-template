import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "~/common/errorBoundary/errorBoundary";
import ThemeProvider from "~/features/theme/themeProvider";
import RouteWithSubRoutes from "~/routes/routeWithSubRoutes";
import routes from "~/routes/routes";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.name}
              element={route.layout ? <route.layout /> : null}
            >
              <Route
                path={route.path}
                element={<RouteWithSubRoutes route={route} />}
              />
            </Route>
          ))}
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
