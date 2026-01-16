// const BASE_URL = "https://crm-backend-qbz0.onrender.com";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchHandler = async (
  url,
  method = "GET",
  data = null,
  headers = {}
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

  const response = await fetch(`${BASE_URL}${url}`, options);

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw responseData; //  THROW FULL API RESPONSE
  }

  return responseData;
};
