import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import EmployeeLogin from "./Employee/EmployeeLogin";

const Start = () => {
  const [isEmployee, setIsEmployee] = useState(true);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:4000/verify")
      .then((result) => {
        if (result.data.Status) {
          if (result.data.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/employee_detail/" + result.data._id);
          }
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center w-100 vh-100 loginPage">
      <div className="p-4 rounded border shadow-sm loginForm" style={{ width: "500px" }}>
        <h2 className="text-center mb-4">LogIn !!</h2>
        <div className="tab-container">
          <button
            type="button"
            className={`tab-button ${isEmployee ? "active" : "inactive"} me-2`}
            onClick={() => setIsEmployee(true)}
          >
            Employee
          </button>
          <button
            type="button"
            className={`tab-button ${isEmployee ? "inactive" : "active"}`}
            onClick={() => setIsEmployee(false)}
          >
            Admin
          </button>
        </div>
        <div className="border-top pt-3">
          {isEmployee ? <EmployeeLogin /> : <Login />}
        </div>
      </div>
    </div>
  );
};

export default Start;
