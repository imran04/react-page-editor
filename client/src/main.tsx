// Polyfill for react-form-builder2
(window as any).global = window;

import { createRoot } from "react-dom/client";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);