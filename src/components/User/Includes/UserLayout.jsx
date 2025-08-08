import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const UserLayout = () => {
  const { loading } = useAuth();
  return (
    <>
        <>
          <Nav />
          <div className="pb-20">
            <Outlet />
          </div>
          <Footer />
        </>
    </>
  );
};

export default UserLayout;
