import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { decodeToken } from '../utils/jwtUtils';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const { accessToken, logout } = useAuth();
  if (!accessToken) {
    toast.error("Login First");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const decodedToken = decodeToken(accessToken);
  if (!decodedToken) {
    toast.error("Invalid token");
    logout();
    return <Navigate to="/login" replace />;
  }
  // const isSetupCompleted =decodedToken["IsSetupCompleted"]?.toLowerCase() === "true";
  // if(!isSetupCompleted)
  // {
  //   toast.error("Please Do setup First!");
  //   return <Navigate to="/setup" state={{ from: location }} replace />;
  // }
  const tokenRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (!allowedRoles || allowedRoles.includes(tokenRole)) {
    return <Outlet />;
  } else {
    toast.error("Not authorized");
    logout();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
