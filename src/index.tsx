import { createRoot } from "react-dom/client";
import { RelayEnvironmentProvider } from "react-relay";
import { RelayEnvironment } from "./RelayEnvironment";
import { App } from "./App";
import { ErrorBoundary } from "react-error-boundary";
import { RecoilRoot } from "recoil";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("`root` element not found");
}

createRoot(rootElement).render(
  <ErrorBoundary fallback={<div>A fatal error occured!</div>}>
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </RelayEnvironmentProvider>
  </ErrorBoundary>
);
