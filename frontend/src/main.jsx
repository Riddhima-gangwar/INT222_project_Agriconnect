import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";

if (import.meta.env.PROD) {
  // Use relative paths or the current origin in production (Vercel)
  setBaseUrl("");
}

createRoot(document.getElementById("root")).render(<App />);
