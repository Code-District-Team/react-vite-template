import ErrorBoundary from "~/common/errorBoundary/errorBoundary";
import ThemeProvider from "~/features/theme/themeProvider";
import RouterProvider from "~/routes/routerProvider";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
