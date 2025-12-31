export const getProfiles = async () => {
  const res = await fetch("/api/profiles");
  return res.json();
};

export const assignCandidate = async (requirementId, candidateId) => {
  const res = await fetch(`/api/requirements/${requirementId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ candidateId }),
  });
  return res.json();
};

export const addNewCandidate = async (candidateData) => {
  const res = await fetch("/api/profiles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidateData),
  });
  return res.json();
};
