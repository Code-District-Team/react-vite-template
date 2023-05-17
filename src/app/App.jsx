import "antd/dist/reset.css";
import ErrorBoundary from "~/common/errorBoundary/errorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <h2>App</h2>
    </ErrorBoundary>
  );
}
