import React, { useState } from "react";
import "../../../src/style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EmployeeLogin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const validate = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.email) {
      toast.error("Please enter your email.");
      return false;
    } else if (!emailPattern.test(values.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!values.password) {
      toast.error("Please enter your password.");
      return false;
    } else if (values.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    axios
      .post("http://localhost:4000/employee/employee_login", values)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          localStorage.setItem("userid", result.data.id);
          toast.success("Login successful!");
          navigate("/employee-dashboard");
        } else {
          toast.error(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error during login:", err);
        toast.error("Server error, please check the server.");
      });
  };

  return (
    <div className="justify-content-center align-items-center">
      <div className="p-3">
        <h2>Employee Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-0"
            />
          </div>
          <button className="btn btn-success w-100 rounded-0 mb-2">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;
