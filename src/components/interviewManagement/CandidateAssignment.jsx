import React, { useState, useEffect } from "react";

// Services
import {
  getProfiles,
  assignCandidate,
  addNewCandidate,
} from "../../services/interviewService";

const CandidateAssignment = ({ requirement, onCandidateAssigned }) => {
  const [profiles, setProfiles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Static data for testing new candidate addition if needed
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateSkills, setNewCandidateSkills] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const data = await getProfiles();
    setProfiles(data);
  };

  const handleSearch = () => {
    const results = profiles.filter((p) =>
      requirement.skills.every((skill) => p.skills.includes(skill))
    );
    setSearchResults(results);
  };

  const handleAssign = async (candidate) => {
    await assignCandidate(requirement.id, candidate.id);
    setSelectedCandidate(candidate);
    onCandidateAssigned(candidate); // send to BDE
    alert(`Candidate ${candidate.name} assigned to BDE`);
  };

  const handleAddNewCandidate = async () => {
    // For now, simulate with static data if backend not ready
    const skillsArray = newCandidateSkills.split(",").map((s) => s.trim());
    const newCandidate = {
      id: Date.now(), // temporary id
      name: newCandidateName,
      skills: skillsArray,
    };
    setProfiles([...profiles, newCandidate]);
    await handleAssign(newCandidate);
    setNewCandidateName("");
    setNewCandidateSkills("");
  };

  return (
    <div className="p-4 border rounded mt-4">
      <h4>HR Candidate Assignment for "{requirement.jobTitle}"</h4>

      <button onClick={handleSearch} className="my-2">
        Search Candidates
      </button>

      {searchResults.length === 0 && <p>No matching candidates found.</p>}
      {searchResults.map((c) => (
        <div key={c.id} className="flex justify-between p-2 border my-1">
          <div>
            {c.name} | Skills: {c.skills.join(", ")}
          </div>
          <button onClick={() => handleAssign(c)}>Assign to BDE</button>
        </div>
      ))}

      <div className="mt-4 border-t pt-2">
        <h5>Add New Candidate</h5>
        <input
          type="text"
          placeholder="Candidate Name"
          value={newCandidateName}
          onChange={(e) => setNewCandidateName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={newCandidateSkills}
          onChange={(e) => setNewCandidateSkills(e.target.value)}
        />
        <button onClick={handleAddNewCandidate}>Add & Assign to BDE</button>
      </div>

      {selectedCandidate && (
        <p className="text-green-600 mt-2">
          Assigned Candidate: {selectedCandidate.name}
        </p>
      )}
    </div>
  );
};

export default CandidateAssignment;
