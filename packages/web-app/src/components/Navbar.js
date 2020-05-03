import React from "react";
import { NavLink } from "react-router-dom";
import Img from "../favicon.ico";
import authHelper from "../services/auth-helper";

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <NavLink className="navbar-brand" to="/">
      <img src={Img} width="50" height="50" alt="" />
      Subs Tracker
    </NavLink>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav">
        <li className="nav-item">
          {authHelper.isAuthenticated() && (
            <NavLink activeClassName="active" className="nav-link" to="/teams">
              Teams
            </NavLink>
          )}
        </li>
        <li className="nav-item">
          <NavLink activeClassName="active" className="nav-link" to="/pay">
            Pay
          </NavLink>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          {authHelper.isAuthenticated() ? (
            <a
              className="nav-link"
              href="/signout"
              onClick={() => authHelper.signout()}
            >
              Logout
            </a>
          ) : (
            <NavLink activeClassName="active" className="nav-link" to="/login">
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </div>
  </nav>
);

export default Navbar;
