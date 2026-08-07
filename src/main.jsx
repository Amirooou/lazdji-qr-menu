import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AdminApp from "./admin/AdminApp.jsx";
import "./index.css";

// No router library for just two top-level destinations — a plain path
// check is simpler and dependency-free. If the admin panel grows enough
// sub-pages to want shareable deep links (Sprint 4's statistics dashboard,
// say), swap this for react-router-dom without touching either app's
// internals; both are already self-contained trees.
const isAdmin = window.location.pathname.startsWith("/admin");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{isAdmin ? <AdminApp /> : <App />}</React.StrictMode>
);
