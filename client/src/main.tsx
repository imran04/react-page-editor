// Polyfill for react-form-builder2
(window as any).global = window;

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);