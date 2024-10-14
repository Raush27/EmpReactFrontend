import React, { useState, useEffect } from "react";
import axios from "axios";

const MonthlyPayroll = () => {
  const [payroll, setPayRoll] = useState([]);
  const [expandedPayroll, setExpandedPayroll] = useState(null);

  useEffect(() => {
    const user_id = localStorage.getItem("userid");
    axios
      .get(`http://localhost:4000/auth/payroll?employee_id=${user_id}`)
      .then((result) => {
        setPayRoll(result?.data?.Result || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const handlePrint = (entry) => {
    const { employee_id, salary, bonus, deductions, payment_date } = entry;
    const total = calculateTotal(entry);

    const printContent = `
      <h3>Payroll for ${employee_id.name}</h3>
      <p><strong>Employee ID:</strong> ${employee_id._id}</p>
      <p><strong>Email:</strong> ${employee_id.email}</p>
      <p><strong>Payment Date:</strong> ${new Date(payment_date).toLocaleDateString()}</p>
      <p><strong>Salary:</strong> ${salary}</p>
      <p><strong>Bonus:</strong> ${bonus}</p>
      <p><strong>Deductions:</strong> ${deductions}</p>
      <p><strong>Total:</strong> ${total}</p>
    `;

    const newWindow = window.open("", "_blank", "width=600,height=400");
    newWindow.document.write(`
      <html>
        <head><title>Print Payroll</title></head>
        <body>${printContent}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  const calculateTotal = (entry) => {
    return entry.salary + entry.bonus - entry.deductions;
  };

  return (
    <div className="container mt-5">
      <h3>Payroll Records (Monthly)</h3>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>Month</th>
            <th>Salary</th>
            <th>Bonus</th>
            <th>Deductions</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payroll.length > 0 ? (
            payroll.map((entry) => {
              const total = calculateTotal(entry); // Calculate total for each entry

              return (
                <React.Fragment key={entry._id}>
                  <tr
                    onClick={() =>
                      setExpandedPayroll(
                        expandedPayroll === entry._id ? null : entry._id
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td>{new Date(entry.payment_date).toLocaleDateString()}</td>
                    <td>{entry.salary}</td>
                    <td>{entry.bonus}</td>
                    <td>{entry.deductions}</td>
                    <td>{total}</td>
                    <td>
                      <button
                        className="btn btn-primary d-flex align-items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint(entry);
                        }}
                      >
                        <i className="bi bi-printer me-2"></i>
                        Print
                      </button>
                    </td>
                  </tr>
                  {expandedPayroll === entry._id && (
                    <tr>
                      <td colSpan="6">
                        <table className="table mt-2">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Assuming more detailed payroll info goes here */}
                            <tr>
                              <td>Sample Date</td>
                              <td>Sample Status</td>
                              <td>Sample Remarks</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No payroll records available for this month.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyPayroll;
