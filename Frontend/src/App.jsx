import AppRouter from "./routes/AppRouter";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkErrorBoundary from "./components/NetworkErrorBoundary";
import AsyncBoundary from "./components/AsyncBoundary";

function App() {
  return (
    <ErrorBoundary>
      <NetworkErrorBoundary>
        <AsyncBoundary>
          <AppRouter />
        </AsyncBoundary>
      </NetworkErrorBoundary>
    </ErrorBoundary>
  );
}

export default App;
