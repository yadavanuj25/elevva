import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LockWatcher = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    if (user?.isLocked) {
      navigate("/lock-screen");
    }
  }, [user.isLocked]);

  return null;
};

export default LockWatcher;
