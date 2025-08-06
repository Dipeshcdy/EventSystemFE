import React from "react";
import { useAuth } from "../context/AuthContext";

const hasPermission = (userPermissions, requiredService, requiredModuleCode = null, allowedRoles = []) => {
  if (!Array.isArray(userPermissions)) return false;

  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

  return userPermissions.some(perm => {
    const serviceMatch = perm.service === requiredService;
    const moduleMatch = requiredModuleCode ? perm.module === requiredModuleCode : true;
    const roleMatch =
      normalizedAllowedRoles.length === 0 ||
      normalizedAllowedRoles.includes(perm.role?.toLowerCase());

    return serviceMatch && moduleMatch && roleMatch;
  });
};


const PermissionWrapper = ({ service, moduleCode = null, allowedRoles = [], children }) => {
  const { permissions } = useAuth();

  const isAllowed = Array.isArray(permissions) && permissions.some(perm => {
    const serviceMatch = perm.service === service;
    const moduleMatch = moduleCode ? perm.module === moduleCode : true;
    const roleMatch =
      allowedRoles.length === 0 ||
      allowedRoles.includes(perm.role?.toLowerCase());

    return serviceMatch && moduleMatch && roleMatch;
  });

  if (!isAllowed) return null;

  return <>{children}</>;
};


export default PermissionWrapper;
