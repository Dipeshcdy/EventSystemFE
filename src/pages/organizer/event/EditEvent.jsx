import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import EventForm from "./EventForm";

const EditEvent = () => {
  const { id } = useParams();
  const { setActivePage, setActiveSubMenu } = useAuth();
  setActivePage("menu");
  setActiveSubMenu("");
  return <EventForm id={id} />;
};

export default EditEvent;
