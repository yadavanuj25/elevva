import { BASE_URL } from "../config/api";
import { swalWarning } from "../utils/swalHelper";

export const fetchHandler = async (
  url,
  method = "GET",
  data = null,
  headers = {},
) => {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  };

  if (!(data instanceof FormData)) {
    options.headers["Content-Type"] = "application/json";
  }

  if (data) {
    options.body = data instanceof FormData ? data : JSON.stringify(data);
  }
  try {
    const response = await fetch(`${BASE_URL}${url}`, options);
    const responseData = await response.json().catch(() => ({}));

    //  TOKEN EXPIRED / UNAUTHORIZED

    if (response.status === 401) {
      swalWarning("Session expired. Redirecting to login...");
      localStorage.clear();
      // redirect globally (works outside React)
      window.location.replace("/login");
      return Promise.reject({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    if (!response.ok) {
      throw responseData; //  THROW FULL API RESPONSE
    }
    return responseData;
  } catch (error) {
    return Promise.reject({
      success: false,
      message: error?.message || "Network error",
    });
  }
};
