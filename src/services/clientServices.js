import { fetchHandler } from "../fatchHandler/fetchHandler";

const clientStatuses = ["active", "inactive", "on_hold", "terminated"];
const requirementStatuses = [
  "Open",
  "On Hold",
  "In Progress",
  "Filled",
  "Cancelled",
  "Closed",
];

export const getAllClients = ({
  page = 1,
  limit = 25,
  search = "",
  clientCategory = "",
  clientSource = "",
  companySize = "",
  status = "",
} = {}) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (search.trim()) params.append("search", search);
  if (status) params.append("status", status);
  if (clientCategory) params.append("clientCategory", clientCategory);
  if (clientSource) params.append("clientSource", clientSource);
  if (companySize) params.append("companySize", companySize);
  return fetchHandler(`/api/clients?${params.toString()}`);
};
export const getActiveClients = () => {
  return fetchHandler(`/api/clients?status=active`);
};
export const updateClientStatus = (id, status) => {
  return fetchHandler(`/api/clients/${id}`, "PUT", status);
};

export const getAllOptions = () => {
  return fetchHandler("/api/clients/options");
};

export const getClientById = (id) => fetchHandler(`/api/clients/${id}`);

export const addClients = (clientData) =>
  fetchHandler("/api/clients", "POST", clientData);

export const updateClient = (id, clientData) =>
  fetchHandler(`/api/clients/${id}`, "PUT", clientData);

export const getClientSettings = () => {
  return fetchHandler("/api/clients/options");
};

export const getClientsWithFilters = (filters = {}) => {
  const params = new URLSearchParams();
  params.append("page", filters.page || 1);
  params.append("limit", filters.limit || 10);
  if (filters.search) params.append("search", filters.search);
  if (filters.clientCategory)
    params.append("clientCategory", filters.clientCategory);
  if (filters.clientSource) params.append("clientSource", filters.clientSource);
  if (filters.companySize) params.append("companySize", filters.companySize);
  if (filters.status) params.append("status", filters.status);

  return fetchHandler(`/api/clients?${params.toString()}`);
};

export const getClientStats = ({
  startDate,
  endDate,
  status,
  clientCategory,
  clientSource,
  companySize,
} = {}) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (status) params.append("status", status);
  if (clientCategory) params.append("clientCategory", clientCategory);
  if (clientSource) params.append("clientSource", clientSource);
  if (companySize) params.append("companySize", companySize);
  return fetchHandler(`/api/clients/stats?${params.toString()}`);
};

// --------- Requirements ---------

export const getRequirementByClientId = (id, page = 1, limit = 25) =>
  fetchHandler(`/api/requirements/client/${id}?page=${page}&limit=${limit}`);

export const getRequirementById = (id) =>
  fetchHandler(`/api/requirements/${id}`);

export const getRequirementsOptions = () => {
  return fetchHandler("/api/requirements/options");
};

export const addClientsRequirement = (clientData) =>
  fetchHandler("/api/requirements", "POST", clientData);

export const updateClientsRequirement = (id, clientData) =>
  fetchHandler(`/api/requirements/${id}`, "PUT", clientData);

export const updateRequirementStatus = (id, status) => {
  return fetchHandler(`/api/requirements/${id}`, "PUT", status);
};

export const getAllRequirements = (
  page = 1,
  limit = 25,
  tab = "All",
  search = "",
) => {
  let url = `/api/requirements?page=${page}&limit=${limit}`;
  if (requirementStatuses.includes(tab)) {
    url += `&positionStatus=${tab}`;
  }
  if (search.trim() !== "") {
    url += `&search=${encodeURIComponent(search)}`;
  }
  return fetchHandler(url);
};

export const assignRequirement = (clientData) =>
  fetchHandler("/api/tasks/assign", "POST", clientData);

export const getRequirementOptions = () => {
  return fetchHandler("/api/requirements/options");
};
