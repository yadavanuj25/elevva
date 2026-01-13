const BASE_URL = "https://countriesnow.space/api/v0.1";

export const getCountries = async () => {
  const response = await fetch(`${BASE_URL}/countries`);
  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }
  return response.json();
};

export const getStatesByCountry = async (country) => {
  const response = await fetch(
    `https://countriesnow.space/api/v0.1/countries/states`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ country }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch states");
  }

  return response.json();
};
