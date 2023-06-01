import ErrorBoundary from "~/common/errorBoundary/errorBoundary";
import ThemeProvider from "~/features/theme/themeProvider";
import Routes from "~/routes/routerProvider";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
