import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { setLogoutFunction, setAuthToken } from '../services/axios';
import { decodeToken , getPermissions} from '../utils/jwtUtils';
import toast from 'react-hot-toast';
import { Roles } from '../constants/constants';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstRender = useRef(true);

  const [accessToken, setAccessToken] = useState(() => {
    const savedToken = localStorage.getItem('accessToken');
    return savedToken ? savedToken : null;
  });

  const [permissions, setPermissions] = useState([]);

  const [userRole, setUserRole] = useState(null);


  const [organizationId, setOrganizationId] = useState(null);
  const [organizationName, setOrganizationName] = useState(null);
  const [organizationCode, setOrganizationCode] = useState(null);
  const [orgLogo, setOrgLogo] = useState(null);


  //global states 
  const [activePage, setActivePage] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [loading, setLoading] = useState(true);

    const logout = () => {
    setAccessToken(null);
    setPermissions([]);
    navigate("/login");
  }
  setLogoutFunction(logout);

   useEffect(() => {
  if (accessToken) {
    const decoded = decodeToken(accessToken);
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      logout();
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    setAuthToken(accessToken);
    setOrganizationName(decoded.OrganizationName);
    setOrgLogo(decoded.ImageUrl);
    setOrganizationCode(decoded.OrganizationCode);
    setUserRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
    const userPermissions = getPermissions(accessToken);
    setPermissions(userPermissions);

  } else {
    localStorage.removeItem("accessToken");
    setAuthToken(null);
    setOrganizationName(null);
    setOrganizationCode(null);
    setOrgLogo(null);
    setUserRole(null);
    setPermissions([]);
  }

  if (isFirstRender.current) {
    isFirstRender.current = false;
  } else {
    handleRedirect();
  }
}, [accessToken]);

  useEffect(() => {
    if (permissions.length > 0) {
      localStorage.setItem('permissions', JSON.stringify(permissions));
    } else {
      localStorage.removeItem('permissions');
    }
  }, [permissions]);

  useEffect(() => {
    setLoading(true);
  }, [location.pathname]);

  const handleRedirect = () => {
    if (accessToken && userRole) {
      switch (userRole) {
        case Roles.Admin:
          navigate("/admin/dashboard");
          break;
        case Roles.Organizer:
          navigate("/organizer/dashboard");
          break;
        case Roles.User:
          navigate("/user/dashboard");
          break;
        default:
          navigate("/login");
          toast.error("Invalid role");
          break;
      }
    } else {
      navigate("/");
    }
  };
  return (
    <AuthContext.Provider value={{ accessToken, permissions,organizationId, organizationName, orgLogo, organizationCode, setAccessToken, setPermissions, logout, handleRedirect, activePage, setActivePage, activeSubMenu, setActiveSubMenu, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
