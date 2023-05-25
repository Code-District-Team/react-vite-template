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
          {routes.map((route, i) => (
            <Route
              key={i}
              path={route.path}
              element={<RouteWithSubRoutes route={route} />}
            />
          ))}
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
