import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PayRoll = () => {
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/auth/payrolls")
      .then((result) => {
        if (result.data.Status) {
          setPayrolls(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:4000/auth/delete_employee/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };
  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>PayRoll List</h3>
      </div>
      <Link to="/dashboard/add_payroll" className="btn btn-success">
        Add PayRoll
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Email</th>
              <th>Salary</th>
              <th>Bonus</th>
              <th>Deductions</th>
              <th>Payment Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p) => (
              <tr key={p._id}>
                <td>{p.employee_id ? p.employee_id.name : "N/A"}</td>
                <td>{p.employee_id ? p.employee_id.email : "N/A"}</td>
                <td>{p.salary}</td>
                <td>{p.bonus || "N/A"}</td>
                <td>{p.deductions || "N/A"}</td>
                <td>{new Date(p.payment_date).toLocaleDateString()}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_payroll/` + p._id}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
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

export default PayRoll;
