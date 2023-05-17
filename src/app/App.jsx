import "antd/dist/reset.css";
import ErrorBoundary from "~/common/errorBoundary/errorBoundary";
import { Counter } from "~/features/counter/Counter";

export default function App() {
  return (
    <ErrorBoundary>
      <Counter />
    </ErrorBoundary>
  );
}
