import { Routes, Route } from "react-router-dom";
import Events from "../pages/user/Events";
import EventView from "../pages/user/EventView";
import Tickets from "../pages/user/Tickets";

const UserRoutes = () => (
    <>
         <Route path="/events" element={<Events />} />
         <Route path="/myTickets" element={<Tickets />} />
         <Route path="/event/:id" element={<EventView />} />
        {/* <Route path="/profile" element={<UserProfile />} />
        <Route path="/tickets" element={<UserTickets />} />
        <Route path="/checkout" element={<Checkout />} /> */}
    </>
);

export default UserRoutes;
