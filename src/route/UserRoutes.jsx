import { Routes, Route } from "react-router-dom";
import Events from "../pages/user/Events";
import EventView from "../pages/user/EventView";

const UserRoutes = () => (
    <>
         <Route path="/events" element={<Events />} />
         <Route path="/event/:id" element={<EventView />} />
        {/* <Route path="/profile" element={<UserProfile />} />
        <Route path="/tickets" element={<UserTickets />} />
        <Route path="/checkout" element={<Checkout />} /> */}
    </>
);

export default UserRoutes;
