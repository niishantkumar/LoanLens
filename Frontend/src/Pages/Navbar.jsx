import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <nav
            className="navbar navbar-expand-lg fixed-top border-bottom shadow"
            style={{ backgroundColor: "#E8F1FA" }}
        >
            <div className="container-fluid p-3 ps-4 pe-5">
                {/* LOGO */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="/icon.png" alt="logo" style={{ height: "40px" }} />
                    <span className="fs-4 ms-2 fw-bold" style={{ color: "#002B49" }}>
                        LoanLens
                    </span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto align-items-center fw-semibold">
                        {/* 🔐 IF USER LOGGED IN */}
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <NavLink
                                        to="/"
                                        className={({ isActive }) =>
                                            `nav-link custom-link ${isActive ? "active-link" : ""}`
                                        }
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/dashboard"
                                        className={({ isActive }) =>
                                            `nav-link custom-link ${isActive ? "active-link" : ""}`
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li className="nav-item d-flex align-items-center me-3 ms-lg-3">
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-light dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="bi bi-person-circle me-2"></i>
                                            {user.username}
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <button className="dropdown-item text-danger" onClick={handleLogout}>
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item me-2">
                                    <button className="btn btn-outline-primary" onClick={() => navigate("/login")}>
                                        Login
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-primary" onClick={() => navigate("/signup")}>
                                        Signup
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;