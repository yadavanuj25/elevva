import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/leave.css";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { MessageProvider } from "./auth/MessageContext.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AttendanceProvider } from "./context/AttendanceContext.jsx";
import { LeaveProvider } from "./context/LeaveProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AttendanceProvider>
          <AuthProvider>
            <MessageProvider>
              <ScrollToTop />
              <LeaveProvider>
                <App />
              </LeaveProvider>
            </MessageProvider>
          </AuthProvider>
        </AttendanceProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
