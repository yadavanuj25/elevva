export const hasPermission = (permissions, resource, action) => {
  if (!permissions?.[resource]) return false;
  return permissions[resource].includes(action);
};

export const hasModuleAccess = (permissions, resource) => {
  return Boolean(permissions?.[resource]?.length);
};
