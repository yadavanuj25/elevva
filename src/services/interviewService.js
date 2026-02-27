import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getProfiles = () => fetchHandler("/api/profiles");

export const assignCandidate = (requirementId, candidateId) =>
  fetchHandler(`/api/requirements/${requirementId}/assign`, "POST", { candidateId });

export const addNewCandidate = (candidateData) =>
  fetchHandler("/api/profiles", "POST", candidateData);
