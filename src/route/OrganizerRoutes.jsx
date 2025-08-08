import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/organizer/Dashboard";
import EventForm from "../pages/organizer/event/EventForm";
import CreateEvent from "../pages/organizer/event/CreateEvent";
import PendingEvent from "../pages/organizer/event/PendingEvent";
import AcceptedEvent from "../pages/organizer/event/AcceptedEvent";
import RejectedEvent from "../pages/organizer/event/RejectedEvent";
import ViewEvent from "../pages/organizer/event/ViewEvent";
import EditEvent from "../pages/organizer/event/EditEvent";

const OrganizerRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="event/create" element={<CreateEvent />} />
    <Route path="event/:id" element={<EditEvent />} />
    <Route path="event/:id/view" element={<ViewEvent />} />
    <Route path="event/pending" element={<PendingEvent />} />
    <Route path="event/accepted" element={<AcceptedEvent />} />
    <Route path="event/rejected" element={<RejectedEvent />} />
  </Routes>
);

export default OrganizerRoutes;