import React, { useEffect, useState } from "react";
import { getAllRequirements } from "../services/clientServices";
import CandidateAssignment from "../components/interviewManagement/CandidateAssignment";

const InterviewDashboard = ({ loggedInHrId }) => {
  const [requirements, setRequirements] = useState([]);

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    const data = await getAllRequirements();
    const hrRequirements = data.filter((r) => r.hrId === loggedInHrId);
    setRequirements(hrRequirements);
  };

  const handleCandidateAssigned = (requirementId, candidate) => {
    const updatedReq = requirements.map((r) => {
      if (r.id === requirementId) return { ...r, assignedCandidate: candidate };
      return r;
    });
    setRequirements(updatedReq);
  };

  return (
    <div className="p-4">
      <h1>Interview Management - HR Stage</h1>

      {requirements.map((req) => (
        <div key={req.id} className="border p-2 my-2">
          <p>
            <strong>Job:</strong> {req.jobTitle}
          </p>
          <p>
            <strong>Skills:</strong> {req.skills.join(", ")}
          </p>

          <CandidateAssignment
            requirement={req}
            onCandidateAssigned={(candidate) =>
              handleCandidateAssigned(req.id, candidate)
            }
          />
        </div>
      ))}
    </div>
  );
};

export default InterviewDashboard;
