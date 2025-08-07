import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/organizer/Dashboard";
import EventForm from "../pages/organizer/event/EventForm";

const OrganizerRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="event/create" element={<EventForm />} />
  </Routes>
);

export default OrganizerRoutes;