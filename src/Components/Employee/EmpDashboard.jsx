import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const EmpDashboard = () => {
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // Get current path

  useEffect(() => {
    let user_id = localStorage.getItem("userid");
    axios
      .get("http://localhost:4000/employee/detail/" + user_id)
      .then((result) => {
        setEmployee(result?.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:4000/employee/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          localStorage.removeItem("userid");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link
              to="/employee-dashboard"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                Emp Dashboard
              </span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to="/employee-dashboard"
                  className={`nav-link text-white px-0 align-middle ${
                    location.pathname === "/employee-dashboard" ? "active" : ""
                  }`}
                >
                  <i className="bi-house-door ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline px-2">Home</span>
                </Link>
              </li>

              <li className="w-100">
                <Link
                  to="/employee-dashboard/attendance"
                  className={`nav-link text-white px-0 align-middle ${
                    location.pathname === "/employee-dashboard/attendance"
                      ? "active"
                      : ""
                  }`}
                >
                  <i className="bi-calendar-check ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline px-2">
                    Attendance
                  </span>
                </Link>
              </li>

              <li className="w-100">
                <Link
                  to="/employee-dashboard/pending-leaves"
                  className={`nav-link text-white px-0 align-middle ${
                    location.pathname === "/employee-dashboard/pending-leaves"
                      ? "active"
                      : ""
                  }`}
                >
                  <i className="bi-file-earmark-text ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline px-2">Leaves</span>
                </Link>
              </li>

              <li className="w-100">
                <Link
                  to="/employee-dashboard/monthly-payroll"
                  className={`nav-link text-white px-0 align-middle ${
                    location.pathname === "/employee-dashboard/monthly-payroll"
                      ? "active"
                      : ""
                  }`}
                >
                  <i className="bi-cash ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline px-2">Payroll</span>
                </Link>
              </li>

              <li className="w-100" onClick={handleLogout}>
                <Link className="nav-link px-0 align-middle text-white">
                  <i className="bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline px-2">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-4 d-flex justify-content-right shadow">
            <h4 className="mb-0">Welcome back, {employee.name}👋!!</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmpDashboard;
