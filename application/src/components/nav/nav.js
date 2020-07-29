import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./nav.css";
import { logoutUser } from "../../redux/actions/authActions";

const Nav = ({ logoutUser }) => {
    return (
        <div className="nav-strip">
            <Link to={"/order"} className="nav-link">
                <div className="nav-link-style">
                    <label className="nav-label">Order Form</label>
                </div>
            </Link>
            <Link to={"/view-orders"} className="nav-link" id="middle-link">
                <div className="nav-link-style">
                    <label className="nav-label">View Orders</label>
                </div>
            </Link>
            <Link to={"/login"} className="nav-link">
                <div className="nav-link-style">
                    <label className="nav-label" onClick={() => logoutUser()}>Log Out</label>
                </div>
            </Link>
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
  logoutUser: e => dispatch(logoutUser(e))
})

export default connect(null, mapDispatchToProps)(Nav);