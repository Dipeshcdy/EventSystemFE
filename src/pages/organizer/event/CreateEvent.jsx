import EventForm from "./EventForm";
import { useAuth } from "../../../context/AuthContext";

const createEvent = () => {
  const { setActivePage, setActiveSubMenu } = useAuth();
  setActivePage("organizerEvents");
  setActiveSubMenu("createEvent");
  return <EventForm />;
};

export default createEvent;
