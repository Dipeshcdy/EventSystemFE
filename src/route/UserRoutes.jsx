import { Routes, Route } from "react-router-dom";
import Events from "../pages/user/Events";
import EventView from "../pages/user/EventView";
import Tickets from "../pages/user/Tickets";
import UpcomingEvents from "../pages/user/UpcomingEvents";
import PastEvents from "../pages/user/PastEvents";

const UserRoutes = () => (
    <>
         <Route path="/upcoming-events" element={<UpcomingEvents />} />
         <Route path="/past-events" element={<PastEvents />} />
         <Route path="/myTickets" element={<Tickets />} />
         <Route path="/event/:id" element={<EventView />} />
        {/* <Route path="/profile" element={<UserProfile />} />
        <Route path="/tickets" element={<UserTickets />} />
        <Route path="/checkout" element={<Checkout />} /> */}
    </>
);

export default UserRoutes;
