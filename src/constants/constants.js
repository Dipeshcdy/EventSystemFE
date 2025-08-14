// === Role Constants ===
export const Roles = {
  Admin: "Admin",
  Organizer: "Organizer",
  User: "User", // if used
};

export const EventTimeStatus = Object.freeze({
  Upcoming: "Upcoming",
  Past: "Past",
  Ongoing: "Ongoing",
});

// === Claim Types from JWT (matches .NET claim types) ===
export const Claims = {
  Role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  OrganizationId: "OrganizationId",
  OrganizationName: "OrganizationName",
  OrganizationCode: "OrganizationCode",
  ImageUrl: "ImageUrl",
};

// === Token Keys (for localStorage) ===
export const TokenKeys = {
  AccessToken: "accessToken",
  Permissions: "permissions",
};

// === API Messages (optional standard messages)
export const ApiMessages = {
  Unauthorized: "Unauthorized access",
  Forbidden: "You do not have permission",
  Success: "Request completed successfully",
};

// === Status Codes (optional)
export const StatusCodes = {
  OK: 200,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  ServerError: 500,
};


// src/constants.js

export const FORM_MODES = {
  ADD: "add",
  EDIT: "edit",
  VIEW: "view",
};
