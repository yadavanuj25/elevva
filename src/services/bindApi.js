// import axios from "axios";
// let authStore = {
//   refreshAuth: null,
//   logout: null,
// };
// export const bindAuthActions = (actions) => {
//   authStore = actions;
// };
// const api = axios.create({
//   baseURL: import.meta.env.VITE_BASE_URL,
// });
// /* Attach token */
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
// /* Sync permissions on ANY response */
// api.interceptors.response.use(
//   async (response) => {
//     if (authStore.refreshAuth) {
//       authStore.refreshAuth(); // 🔁 LIVE SYNC
//     }
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       authStore.logout?.();
//     }
//     return Promise.reject(error);
//   },
// );

// export default api;

import axios from "axios";

let authStore = {
  refreshAuth: null,
  logout: null,
};
export const bindAuthActions = (actions) => {
  authStore = actions;
};
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});
/* Attach token to every request */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
/* 
  CRITICAL: Sync permissions after EVERY API response
  This ensures that if admin changes permissions, the logged-in user
  gets updated permissions immediately on their next API call
*/
api.interceptors.response.use(
  async (response) => {
    // Refresh auth to get latest permissions after any successful API call
    if (authStore.refreshAuth) {
      authStore.refreshAuth();
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - logout immediately
    if (error.response?.status === 401) {
      authStore.logout?.();
    }
    return Promise.reject(error);
  },
);

export default api;
