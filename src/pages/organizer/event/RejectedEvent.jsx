import { useAuth } from "../../../context/AuthContext";
import EventList from "./EventList";

const RejectedEvent = () => {
    const { setActivePage, setActiveSubMenu} = useAuth();
        setActivePage("organizerEvents");
        setActiveSubMenu("rejectedEvents");
  return <EventList status="Rejected" />;
};

export default RejectedEvent;
