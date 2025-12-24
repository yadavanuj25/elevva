import React, { useState, useRef } from "react";
import { X } from "lucide-react";

const SkillsInput = ({
  label = "Skills",
  skills = [],
  value,
  onChange,
  onKeyDown,
  onBlur,
  onRemove,
  error,
  placeholder = "Type a skill and press Enter",
  required = false,
}) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="col-span-2">
      <label className="block font-medium mb-1">
        {label} {required && "*"}
      </label>

      <div
        onClick={() => inputRef.current?.focus()}
        className={`flex flex-wrap gap-2 border rounded-md p-2 min-h-[48px] cursor-text transition
          ${
            error
              ? "border-red-500"
              : isFocused
              ? "border-dark dark:border-white"
              : "border-gray-300 dark:border-gray-600"
          }`}
      >
        {skills.map((skill, i) => (
          <span
            key={i}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            {skill}
            <X
              size={14}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(skill);
              }}
              className="cursor-pointer hover:text-red-500"
            />
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          placeholder={placeholder}
          className="flex-grow bg-transparent outline-none text-sm"
        />
      </div>
      {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
    </div>
  );
};

export default SkillsInput;
