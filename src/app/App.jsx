import "antd/dist/reset.css";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "~/common/errorBoundary/errorBoundary";
import ThemeConfig from "~/features/themeConfig/themeConfig";
import RouteWithSubRoutes from "~/routes/routeWithSubRoutes";
import routes from "~/routes/routes";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeConfig>
        <Routes>
          {routes.map((route, i) => (
            <Route
              key={i}
              path={route.path}
              element={<RouteWithSubRoutes route={route} />}
            />
          ))}
        </Routes>
      </ThemeConfig>
    </ErrorBoundary>
  );
}
