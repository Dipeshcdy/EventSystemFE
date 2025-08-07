import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import EventCategory from "../pages/admin/EventCategory/EventCategory";
import PendingOrganizer from "../pages/admin/Organizer/PendingOrganizer";
import ViewOrganizer from "../pages/admin/Organizer/ViewOrganizer";
import ApprovedOrganizer from "../pages/admin/Organizer/ApprovedOrganizer";
import RejectedOrganizer from "../pages/admin/Organizer/RejectedOrganizer";

const AdminRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="eventcategory" element={<EventCategory />} />
    <Route path="organizers/pending" element={<PendingOrganizer />} />
    <Route path="organizers/approved" element={<ApprovedOrganizer />} />
    <Route path="organizers/rejected" element={<RejectedOrganizer />} />
    <Route path="organizers/:id" element={<ViewOrganizer />} />
    {/* <Route path="users" element={<Users />} /> */}
  </Routes>
);

export default AdminRoutes;