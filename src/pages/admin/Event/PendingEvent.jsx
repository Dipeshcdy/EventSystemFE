import { useAuth } from "../../../context/AuthContext";
import EventList from "./EventList";

const PendingEvents = () => {
  const { setActivePage, setActiveSubMenu} = useAuth();
  setActivePage("events");
  setActiveSubMenu("pendingEvents");
  return <EventList status="Pending" />;
};

export default PendingEvents;
