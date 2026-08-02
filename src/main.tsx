import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { checkSupabaseConnection } from "@/utils/supabaseHealth";

if (import.meta.env.DEV) {
  void checkSupabaseConnection();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
