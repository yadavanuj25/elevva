import { useCallback } from "react";

const normalizeSkill = (skill) => skill.trim().toLowerCase();

const useSkillHandlers = ({
  setFormData,
  setErrors,
  skillInput,
  setSkillInput,
}) => {
  const addSkills = useCallback(
    (input) => {
      if (!input?.trim()) return;

      const parsedSkills = input
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      setFormData((prev) => {
        const existingNormalized = prev.skills.map(normalizeSkill);
        const seen = new Set(existingNormalized);
        const uniqueSkills = [];

        for (const skill of parsedSkills) {
          const normalized = normalizeSkill(skill);
          if (!seen.has(normalized)) {
            seen.add(normalized);
            uniqueSkills.push(skill);
          }
        }

        if (!uniqueSkills.length) return prev;

        return {
          ...prev,
          skills: [...prev.skills, ...uniqueSkills],
        };
      });

      setErrors((prev) => ({ ...prev, skills: "" }));
      setSkillInput("");
    },
    [setFormData, setErrors, setSkillInput]
  );

  const handleSkillKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkills(skillInput);
      }
    },
    [addSkills, skillInput]
  );

  const handleSkillBlur = useCallback(() => {
    addSkills(skillInput);
  }, [addSkills, skillInput]);

  const handleRemoveSkill = useCallback(
    (skill) => {
      const normalized = normalizeSkill(skill);
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => normalizeSkill(s) !== normalized),
      }));
    },
    [setFormData]
  );

  return {
    addSkills,
    handleSkillKeyDown,
    handleSkillBlur,
    handleRemoveSkill,
  };
};

export default useSkillHandlers;
