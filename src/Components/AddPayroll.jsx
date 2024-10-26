import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddPayroll = () => {
  const [payroll, setPayroll] = useState({
    employee_id: "",
    salary: "",
    bonus: "",
    deductions: "",
    payment_date: "",
  });

  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all employees for the dropdown
    axios
      .get("http://localhost:4000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployees(result.data.Result);
        } else {
          toast(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all required fields are filled in
    if (!payroll.employee_id || !payroll.salary || !payroll.payment_date) {
      toast("Please fill in all the required fields.");
      return;
    }

    // Send payroll data to the backend
    axios
      .post("http://localhost:4000/auth/add_payroll", payroll)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/payroll");
        } else {
          toast(result.data.Error);
        }
      })
      .catch((err) => {
        toast(
          err.response.data.Error ||
            "Something went wrong while adding payroll."
        );
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Payroll</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="employee" className="form-label">
              Employee
            </label>
            <select
              name="employee"
              id="employee"
              className="form-select"
              onChange={(e) =>
                setPayroll({ ...payroll, employee_id: e.target.value })
              }
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option
                  key={emp._id}
                  value={emp._id}
                  disabled={emp.status !== "active"}
                >
                  {emp.name} {emp.status !== "active" ? "(Inactive)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="salary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="salary"
              placeholder="Enter Salary"
              onChange={(e) =>
                setPayroll({ ...payroll, salary: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="bonus" className="form-label">
              Bonus
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="bonus"
              placeholder="Enter Bonus (if any)"
              onChange={(e) =>
                setPayroll({ ...payroll, bonus: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="deductions" className="form-label">
              Deductions
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="deductions"
              placeholder="Enter Deductions (if any)"
              onChange={(e) =>
                setPayroll({ ...payroll, deductions: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="payment_date" className="form-label">
              Payment Date
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="payment_date"
              onChange={(e) =>
                setPayroll({ ...payroll, payment_date: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Payroll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPayroll;
