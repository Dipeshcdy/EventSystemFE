import { jwtDecode } from "jwt-decode";
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
export const getToken = () => {
  return localStorage.getItem("token") ?? "";
};
export const getRole = (token) => {
  const decodedToken = decodeToken(token);
  const role =
    decodedToken[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
    return role;
};
export const getOrganizationId = (token) => {
  const decodedToken = decodeToken(token);
  const orgId =
    decodedToken.OrganizationId;
    return orgId;
};

export const getOrganizationType = (token) => {
  const decodedToken = decodeToken(token);
  const orgType = decodedToken?.OrganizationType ?? null;
  return orgType;
}
export const logout = (navigate) => {
  localStorage.removeItem("token");
  navigate("/");
};
export const handleRedirect = (navigate) => {
  const token = localStorage.getItem("token") ?? "";
  if (token) {
    navigate("/dashboard");
  } else {
    navigate("/");
  }
};

export const getPermissions = (token) => {
  const decodedToken = decodeToken(token);
  const raw = decodedToken?.Permissions;

  if (!raw) return {};

  try {
    const parsed = JSON.parse(JSON.parse(raw));
    const flatPermissions = [];

    for (const [service, data] of Object.entries(parsed)) {
      const serviceLevel = data?.ServicePermissionType ?? null;
      const modules = data?.Modules ?? [];

      modules.forEach((mod) => {
        flatPermissions.push({
          service,
          module: mod.ModuleCode,        
          role: mod.PermissionType,      
          serviceRole: serviceLevel,     
        });
      });
    }

    return flatPermissions;
  } catch (err) {
    console.error("Permission parsing failed:", err);
    return {};
  }
};
