import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./app/globals.css";
import "./styles/admin.css";
import "./styles/admin-security.css";
import { installAdminRequestProtection } from "./security/adminAccess";

installAdminRequestProtection();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
