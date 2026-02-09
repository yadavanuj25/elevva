import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/leave.css";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { MessageProvider } from "./auth/MessageContext.jsx";
import ScrollToTop from "./utils/ScrollToTop.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AttendanceProvider } from "./context/AttendanceContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AttendanceProvider>
          <AuthProvider>
            <MessageProvider>
              <ScrollToTop />

              <App />
            </MessageProvider>
          </AuthProvider>
        </AttendanceProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
