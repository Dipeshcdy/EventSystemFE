import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import EventForm from "./EventForm";

const ViewEvent = () => {
  const { id } = useParams();
  const { setActivePage, setActiveSubMenu } = useAuth();
  setActivePage("menu");
  setActiveSubMenu("");
  return <EventForm id={id} isViewMode={true} />;
};

export default ViewEvent;
