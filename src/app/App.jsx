import ThemeProvider from "~/features/theme/themeProvider";
import RouterProvider from "~/routes/routerProvider";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider />
    </ThemeProvider>
  );
}
