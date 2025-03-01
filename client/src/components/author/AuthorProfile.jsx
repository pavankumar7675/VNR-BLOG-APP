import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AuthorProfile.css";

function AuthorProfile() {
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentuser"));
    if (currentUser) {
      setUserStatus(currentUser.blocked);
    }
  }, []);

  if (userStatus === null) {
    return <div className="text-center text-muted fs-4">Loading...</div>;
  }

  return (
    <div className="bg-dark min-vh-100 text-light p-4">
      {userStatus ? (
        <div className="text-center text-danger fs-3 fw-semibold">
          Your account is blocked. Please contact the admin.
        </div>
      ) : (
        <>
          <nav className="d-flex justify-content-center gap-4 border-bottom border-secondary pb-3">
            <NavLink
              to="articles"
              className={({ isActive }) =>
                `nav-button ${isActive ? "nav-button-active" : ""}`
              }
            >
              Articles
            </NavLink>
            <NavLink
              to="article"
              className={({ isActive }) =>
                `nav-button ${isActive ? "nav-button-active" : ""}`
              }
            >
              + Add Article
            </NavLink>
          </nav>
          <div className="mt-4">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}

export default AuthorProfile