import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getRoles = () => fetchHandler("/api/roles");
