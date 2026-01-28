import { jwtDecode } from "jwt-decode";

export const getTokenExpiryTime = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000;
  } catch {
    return null;
  }
};
