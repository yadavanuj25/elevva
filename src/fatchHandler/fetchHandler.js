const BASE_URL = "https://crm-backend-qbz0.onrender.com";

export const fetchHandler = async (
  url,
  method = "GET",
  data = null,
  headers = {}
) => {
  try {
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP Error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error.message);
    throw error;
  }
};
