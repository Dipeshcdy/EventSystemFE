import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/organizer/Dashboard";
import CreateEvent from "../pages/organizer/event/CreateEvent";
import PendingEvent from "../pages/organizer/event/PendingEvent";
import AcceptedEvent from "../pages/organizer/event/AcceptedEvent";
import RejectedEvent from "../pages/organizer/event/RejectedEvent";
import ViewEvent from "../pages/organizer/event/ViewEvent";
import EditEvent from "../pages/organizer/event/EditEvent";
import EventScanningUsers from "../pages/organizer/event/EventScanningUsers";
import ReportList from "../pages/organizer/Report/ReportList";

const OrganizerRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="report" element={<ReportList />} />
    <Route path="event/create" element={<CreateEvent />} />
    <Route path="event/:id" element={<EditEvent />} />
    <Route path="event/:id/view" element={<ViewEvent />} />
    <Route path="event/pending" element={<PendingEvent />} />
    <Route path="event/accepted" element={<AcceptedEvent />} />
    <Route path="event/rejected" element={<RejectedEvent />} />
    <Route path="event/:eventId/scanning-users" element={<EventScanningUsers />} />
  </Routes>
);

export default OrganizerRoutes;