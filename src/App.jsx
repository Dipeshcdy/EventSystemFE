import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrganizationSetup from "./pages/OrganizationSetup";
import Layout from "./components/Layout";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import ProtectedRoute from "./route/ProtectedRoute";
import { Roles } from "./constants/constants";
import AdminRoutes from "./route/AdminRoutes";
import OrganizerRegister from "./pages/OrganizerRegister";
import VerifyEmail from "./pages/VerifyEmail";
import OrganizerRoutes from "./route/OrganizerRoutes";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/organizer" element={<OrganizerRegister />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/setup" element={<OrganizationSetup />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
         {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={[Roles.Admin]} />}>
          <Route element={<Layout />}>
            {/* Example: /admin/dashboard */}
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Route>
        </Route>

         {/* Organizer Routes */}
        <Route element={<ProtectedRoute allowedRoles={[Roles.Organizer]} />}>
          <Route element={<Layout />}>
            <Route path="/organizer/*" element={<OrganizerRoutes />} />
          </Route>
        </Route>

        {/* User Routes */}
        {/* <Route element={<ProtectedRoute allowedRoles={[Roles.User]} />}>
          <Route element={<Layout />}>
            <Route path="/user/*" element={<UserRoutes />} />
          </Route>
        </Route> */}
      </Routes>
    </>
  );
}

export default App;
