import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getBirthday = ({ year, month }) => {
  return fetchHandler(
    `/dashboard/birthdays?month=${month}&year=${year}`,
    "GET",
  );
};
