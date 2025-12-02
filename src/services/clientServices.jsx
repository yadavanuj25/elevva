import { fetchHandler } from "../fatchHandler/fetchHandler";

const clientStatuses = ["active", "dead", "prospective", "terminated"];
const requirementStatuses = [
  "Open",
  "On Hold",
  "In Progress",
  "Filled",
  "Cancelled",
  "Closed",
];

export const getActiveClients = () => {
  return fetchHandler(`/api/clients?status=active`);
};
export const updateClientStatus = (id, status) => {
  return fetchHandler(`/api/clients/${id}`, "PUT", status);
};

// export const getAllClients = (
//   page = 1,
//   limit = 5,
//   tab = "All",
//   search = ""
// ) => {
//   let url = `/api/clients?page=${page}&limit=${limit}`;
//   if (tab.toLowerCase() === "active") url += "&status=active";
//   if (tab.toLowerCase() === "inactive") url += "&status=inactive";
//   if (tab.toLowerCase() === "dead") url += "&status=dead";
//   if (tab.toLowerCase() === "prospective") url += "&status=prospective";
//   if (tab.toLowerCase() === "terminated") url += "&status=terminated";
//   if (search.trim() !== "") url += `&search=${encodeURIComponent(search)}`;
//   return fetchHandler(url);
// };

export const getAllClients = (
  page = 1,
  limit = 5,
  tab = "All",
  search = ""
) => {
  let url = `/api/clients?page=${page}&limit=${limit}`;
  const tabLower = tab.toLowerCase();
  if (clientStatuses.includes(tabLower)) {
    url += `&status=${tabLower}`;
  }
  if (search.trim() !== "") {
    url += `&search=${encodeURIComponent(search)}`;
  }
  return fetchHandler(url);
};

export const getAllOptions = () => {
  return fetchHandler("/api/clients/options");
};

export const getClientById = (id) => fetchHandler(`/api/clients/${id}`);

export const addClients = (clientData) =>
  fetchHandler("/api/clients", "POST", clientData);

export const updateClient = (id, clientData) =>
  fetchHandler(`/api/clients/${id}`, "PUT", clientData);

// --------- Requirements ---------

export const getRequirementById = (id) =>
  fetchHandler(`/api/requirements/${id}`);

export const getRequirementsOptions = () => {
  return fetchHandler("/api/requirements/options");
};

export const addClientsRequirement = (clientData) =>
  fetchHandler("/api/requirements", "POST", clientData);

export const updateRequirementStatus = (id, status) => {
  return fetchHandler(`/api/requirements/${id}`, "PUT", status);
};

export const getAllRequirements = (
  page = 1,
  limit = 5,
  tab = "All",
  search = ""
) => {
  let url = `/api/requirements?page=${page}&limit=${limit}`;
  const tabLower = tab.toLowerCase();
  if (requirementStatuses.includes(tabLower)) {
    url += `&status=${tabLower}`;
  }
  if (search.trim() !== "") {
    url += `&search=${encodeURIComponent(search)}`;
  }
  return fetchHandler(url);
};
