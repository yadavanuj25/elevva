import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { MessageProvider } from "./auth/MessageContext.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <App />
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
