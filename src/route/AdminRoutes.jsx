import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import EventCategory from "../pages/admin/EventCategory/EventCategory";

const AdminRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="eventcategory" element={<EventCategory />} />
    {/* <Route path="users" element={<Users />} /> */}
  </Routes>
);

export default AdminRoutes;