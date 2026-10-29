import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./lib/installableApp";
import { captureReferral } from "./features/referral/videoReferral";

// Remember a NICS Video ?ref= invite before any page changes the URL.
captureReferral();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

registerServiceWorker();
