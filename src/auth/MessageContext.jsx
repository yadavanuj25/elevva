import { createContext, useContext, useState } from "react";
const AppContext = createContext();
export const MessageProvider = ({ children }) => {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 5000);
  };
  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  return (
    <AppContext.Provider
      value={{ successMsg, errorMsg, showSuccess, showError }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useMessage = () => useContext(AppContext);
