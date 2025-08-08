import { useAuth } from "../../../context/AuthContext";
import EventList from "./EventList";

const AcceptedEvent = () => {
    const { setActivePage, setActiveSubMenu} = useAuth();
    setActivePage("events");
    setActiveSubMenu("acceptedEvents");
  return <EventList status="Accepted" />;
};

export default AcceptedEvent;