import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BlockedApp from "./blocked-app";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BlockedApp />
  </StrictMode>,
);
