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

  const downloadPayroll = () => {
    axios({
      url: "http://localhost:4000/auth/download_payroll",
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "payroll_data.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        alert("Failed to download payroll data.");
        console.log(error);
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
      <button
        className="btn btn-info ms-2"
        onClick={downloadPayroll}
      >
        Download Payroll
      </button>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayRoll;
