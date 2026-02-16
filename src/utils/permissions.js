export const hasPermission = (permissions, resource, action) => {
  if (!permissions?.[resource]) return false;
  return permissions[resource].includes(action);
};

export const hasModuleAccess = (permissions, resource) => {
  return Boolean(permissions?.[resource]?.length);
};

/**
 * permissions.js
 *
 * Utility helpers for permission checks.
 * Compatible with the AuthContext which stores permissions as:
 *   { customers: Set(["read","create","update","delete"]), ... }
 *
 * Prefer using the `can()` helper from useAuth() directly in components.
 * Use these utilities only when you need permission checks outside React
 * (e.g. helper files, service layers, non-component logic).
 */

// export const hasPermission = (permissions, resource, action) => {
//   if (!permissions?.[resource]) return false;
//   // Support both Set (new AuthContext) and Array (legacy / tests)
//   const entry = permissions[resource];
//   if (entry instanceof Set) return entry.has(action);
//   if (Array.isArray(entry)) return entry.includes(action);
//   return false;
// };

// export const hasModuleAccess = (permissions, resource) => {
//   const entry = permissions?.[resource];
//   if (!entry) return false;
//   if (entry instanceof Set) return entry.size > 0;
//   if (Array.isArray(entry)) return entry.length > 0;
//   return false;
// };
