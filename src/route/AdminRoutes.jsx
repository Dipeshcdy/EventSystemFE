import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import EventCategory from "../pages/admin/EventCategory/EventCategory";
import PendingOrganizer from "../pages/admin/Organizer/PendingOrganizer";
import ViewOrganizer from "../pages/admin/Organizer/ViewOrganizer";
import ApprovedOrganizer from "../pages/admin/Organizer/ApprovedOrganizer";
import RejectedOrganizer from "../pages/admin/Organizer/RejectedOrganizer";
import PendingEvents from "../pages/admin/Event/PendingEvent";
import AcceptedEvent from "../pages/admin/Event/AcceptedEvent";
import RejectedEvent from "../pages/admin/Event/RejectedEvent";
import EventView from "../pages/admin/Event/EventView";

const AdminRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="eventcategory" element={<EventCategory />} />
    <Route path="event/pending" element={<PendingEvents />} />
    <Route path="event/accepted" element={<AcceptedEvent />} />
    <Route path="event/rejected" element={<RejectedEvent />} />
    <Route path="event/:id" element={<EventView />} />
    <Route path="organizers/pending" element={<PendingOrganizer />} />
    <Route path="organizers/approved" element={<ApprovedOrganizer />} />
    <Route path="organizers/rejected" element={<RejectedOrganizer />} />
    <Route path="organizers/:id" element={<ViewOrganizer />} />
    {/* <Route path="users" element={<Users />} /> */}
  </Routes>
);

export default AdminRoutes;