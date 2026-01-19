// // src/constants/permissionMap.js
// const PERMISSION_MAP = {
//   "6902f14821ac553ab13fa9a6": "users",
//   "6902f14821ac553ab13fa9a9": "roles",
//   "6902f14821ac553ab13fa9aa": "profile",
//   "6902f14821ac553ab13fa9ab": "clients",
//   "6902f14821ac553ab13fa9ad": "leads",
//   "6902f14821ac553ab13fa9ae": "reports",
//   "6902f14821ac553ab13fa9af": "settings",
// };
// "6911c3c0dd5bb631c65211be", "6911c3c0dd5bb631c65211c1";
// export default PERMISSION_MAP;

// Permission ID to Module Name Mapping (Based on MongoDB Database)
export const PERMISSION_MAP = {
  // Users Management
  "6902f14821ac553ab13fa9a8": "users", // users:delete
  "6902f14821ac553ab13fa9a5": "users", // users:create
  "6902f14821ac553ab13fa9a7": "users", // users:update
  "6902f14821ac553ab13fa9a3": "users", // users:read
  // Reports Management
  "6902f14821ac553ab13fa9af": "reports", // reports:manage
  // Customers Management
  "6902f14821ac553ab13fa9ac": "profiles", // customers:delete
  "6902f14821ac553ab13fa9a6": "profiles", // customers:update
  "6902f14821ac553ab13fa9a4": "profiles", // customers:read
  "6902f14821ac553ab13fa9a9": "profiles", // customers:create
  // Profile Management
  "6902f14821ac553ab13fa9ad": "profiles", // profile:manage
  // Settings Management
  "6902f14821ac553ab13fa9b0": "settings", // settings:manage
  // Deals Management
  "6902f14821ac553ab13fa9ae": "deals", // deals:manage
  // Profiles Management (Submit/Read/Update/Delete)
  "6911c3c6dd5bb631c65211be": "profiles", // profiles:create (Submit profiles)
  "6911c3c6dd5bb631c65211c0": "profiles", // profiles:read
  "6911c3c6dd5bb631c65211c4": "profiles", // profiles:update
  "6911c3c6dd5bb631c65211c7": "profiles", // profiles:delete
};

export const ALWAYS_ACCESSIBLE_MODULES = [
  "dashboard",
  "attendance",
  "settings",
  "chats",
];
// Role hierarchy (higher index = more permissions)
export const ROLE_HIERARCHY = [
  "user",
  "hr",
  "bde",
  "manager",
  "admin",
  "superadmin",
];

/**
 * Map permission IDs to module names
 */
export const mapPermissionsToModules = (permissionIds = []) => {
  return permissionIds.map((permId) => PERMISSION_MAP[permId]).filter(Boolean); // Remove undefined values
};

/**
 * Check if a role is admin or superadmin
 */
export const isAdminRole = (roleName) => {
  return ["admin", "superadmin"].includes(roleName?.toLowerCase());
};

/**
 * Check if user has specific permission
 */
export const checkPermission = (userModules = [], requiredModule, roleName) => {
  // Admin has all permissions
  if (isAdminRole(roleName)) {
    return true;
  }
  // Check if module is always accessible
  if (ALWAYS_ACCESSIBLE_MODULES.includes(requiredModule?.toLowerCase())) {
    return true;
  }
  // Check if user has the specific module
  return userModules.some(
    (module) => module?.toLowerCase() === requiredModule?.toLowerCase(),
  );
};

/**
 * Check if user has any of the required permissions
 */
export const checkAnyPermission = (
  userModules = [],
  requiredModules = [],
  roleName,
) => {
  if (isAdminRole(roleName)) {
    return true;
  }

  return requiredModules.some((module) =>
    checkPermission(userModules, module, roleName),
  );
};

/**
 * Check if user has all required permissions
 */
export const checkAllPermissions = (
  userModules = [],
  requiredModules = [],
  roleName,
) => {
  if (isAdminRole(roleName)) {
    return true;
  }

  return requiredModules.every((module) =>
    checkPermission(userModules, module, roleName),
  );
};

/**
 * Compare two roles and check if first role has higher or equal permission level
 */
export const hasHigherOrEqualRole = (role1, role2) => {
  const index1 = ROLE_HIERARCHY.findIndex((r) => r === role1?.toLowerCase());
  const index2 = ROLE_HIERARCHY.findIndex((r) => r === role2?.toLowerCase());
  return index1 >= index2;
};

/**
 * Get all accessible routes for a user
 */
export const getAccessibleRoutes = (userModules = [], roleName) => {
  const routes = {
    // Always accessible
    "/dashboard": true,
    "/attendance": true,
    "/settings": true,
    "/admin/super-dashboard": isAdminRole(roleName),
    "/admin/settings": true,
    "/chats": true,
    "/my-profile": true,
    // Profile management
    "/admin/profilemanagement/profiles": checkPermission(
      userModules,
      "profile",
      roleName,
    ),
    "/admin/profilemanagement/add-profile": checkPermission(
      userModules,
      "profile",
      roleName,
    ),
    "/admin/profilemanagement/edit-profile": checkPermission(
      userModules,
      "profile",
      roleName,
    ),
    "/admin/profilemanagement/view-profile": checkPermission(
      userModules,
      "profile",
      roleName,
    ),
    // Client management
    "/admin/clientmanagement/clients": checkPermission(
      userModules,
      "clients",
      roleName,
    ),
    "/admin/clientmanagement/add-client": checkPermission(
      userModules,
      "clients",
      roleName,
    ),
    "/admin/clientmanagement/edit-client": checkPermission(
      userModules,
      "clients",
      roleName,
    ),
    "/admin/clientmanagement/view-client": checkPermission(
      userModules,
      "clients",
      roleName,
    ),
    // Requirements
    "/admin/clientmanagement/clientrequirements": checkPermission(
      userModules,
      "requirements",
      roleName,
    ),
    "/admin/clientmanagement/add-clientrequirement": checkPermission(
      userModules,
      "requirements",
      roleName,
    ),
    // User management
    "/admin/usermanagement/users": checkPermission(
      userModules,
      "users",
      roleName,
    ),
    "/admin/usermanagement/add-user": checkPermission(
      userModules,
      "users",
      roleName,
    ),
    // Role management
    "/admin/rolemanagement/roles": checkPermission(
      userModules,
      "roles",
      roleName,
    ),
    "/admin/rolemanagement/add-roles": checkPermission(
      userModules,
      "roles",
      roleName,
    ),
    // Interviews
    "/admin/interviewmanagement": checkPermission(
      userModules,
      "interviews",
      roleName,
    ),
    // Reports
    "/reports": checkPermission(userModules, "reports", roleName),
    // Attendance
    "/attendance": checkPermission(userModules, "attendance", roleName),
    "/attendance/history": checkPermission(userModules, "attendance", roleName),
    // Leaves
    "/leaves": checkPermission(userModules, "leaves", roleName),
    "/leaves/apply": checkPermission(userModules, "leaves", roleName),
    // Tasks
    "/taskboard": checkPermission(userModules, "tasks", roleName),
  };
  return routes;
};

/* Filter navigation items based on user permissions
 */
export const filterNavigationItems = (
  navItems = [],
  userModules = [],
  roleName,
) => {
  return navItems
    .map((section) => {
      const filteredItems = section.items.filter((item) => {
        return checkPermission(userModules, item.module, roleName);
      });

      if (filteredItems.length === 0) return null;
      return { ...section, items: filteredItems };
    })
    .filter(Boolean);
};

/**
 * Get user's permission summary
 */
export const getPermissionSummary = (userModules = [], roleName) => {
  const allModules = Object.values(PERMISSION_MAP);

  return {
    role: roleName,
    isAdmin: isAdminRole(roleName),
    totalModules: userModules.length,
    accessibleModules: userModules,
    restrictedModules: allModules.filter(
      (module) => !checkPermission(userModules, module, roleName),
    ),
    alwaysAccessible: ALWAYS_ACCESSIBLE_MODULES,
  };
};

/**
 * Format role name for display
 */
export const formatRoleName = (roleName) => {
  if (!roleName) return "User";
  return roleName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Check if route is accessible
 */
export const canAccessRoute = (path, userModules = [], roleName) => {
  const accessibleRoutes = getAccessibleRoutes(userModules, roleName);

  // Check exact match
  if (accessibleRoutes[path] !== undefined) {
    return accessibleRoutes[path];
  }

  // Check if path starts with any accessible route
  const matchingRoute = Object.keys(accessibleRoutes).find((route) =>
    path.startsWith(route),
  );

  return matchingRoute ? accessibleRoutes[matchingRoute] : false;
};

// Export default object with all utilities
export default {
  PERMISSION_MAP,
  ALWAYS_ACCESSIBLE_MODULES,
  ROLE_HIERARCHY,
  mapPermissionsToModules,
  isAdminRole,
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  hasHigherOrEqualRole,
  getAccessibleRoutes,
  filterNavigationItems,
  getPermissionSummary,
  formatRoleName,
  canAccessRoute,
};
