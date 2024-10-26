import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleStatusChange = (id, status) => {
    const statusValue = status === "active" ? 0 : 1; 
    const confirmationMessage =
      status === "active"
        ? "Are you sure you want to deactivate this employee?"
        : "Are you sure you want to activate this employee?";
    const confirmStatusChange = window.confirm(confirmationMessage);
    if (confirmStatusChange) {
      axios
        .put(`http://localhost:4000/auth/update_employee_status/${id}`, {
          status: statusValue,
        })
        .then((result) => {
          if (result.data.Status) {
            window.location.reload();
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => {
          console.error("Error updating employee status:", err);
          alert("An error occurred while updating the employee status.");
        });
    }
  };
  

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success">
        Add Employee
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e, idx) => (
              <tr key={idx}>
                <td>{e.name}</td>
                <td>
                  <img
                    src={`http://localhost:4000/Images/` + e.image}
                    className="employee_image"
                  />
                </td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{e.salary}</td>
                <td>{e.status[0].toUpperCase() + e.status.substring(1)}</td>

                <td>
                  <Link
                    to={`/dashboard/edit_employee/` + e._id}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className={`btn ${
                      e.status === "active" ? "btn-warning" : "btn-success"
                    }`}
                    onClick={() => handleStatusChange(e._id, e.status)}
                  >
                    {e.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
