import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Edit, Eye, MoreVertical, Trash } from "lucide-react";

const ActionMenu = ({ onEdit, onView, onDelete }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menu =
    open &&
    (() => {
      if (!buttonRef.current) return null;
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 160;
      let left = buttonRect.right + window.scrollX - menuWidth;
      const top = buttonRect.bottom + window.scrollY;
      if (left < 10) left = 10;
      return (
        <div
          ref={menuRef}
          className="absolute z-50 bg-white dark:bg-darkBg text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md shadow-md "
          style={{ top, left, minWidth: menuWidth }}
        >
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm   hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit size={16} className="text-blue-500" /> Edit
          </button>
          <button
            onClick={() => {
              onView();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm  hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Eye size={16} className="text-green-500" /> View
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Trash size={16} className="text-red-500" /> Delete
          </button>
        </div>
      );
    })();

  return (
    <>
      <div className="relative" ref={buttonRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-1 rounded text-gray-700 bg-gray-300 dark:bg-gray-600  dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700"
        >
          <MoreVertical size={16} />
        </button>
      </div>
      {open && createPortal(menu, document.body)}
    </>
  );
};

export default ActionMenu;
