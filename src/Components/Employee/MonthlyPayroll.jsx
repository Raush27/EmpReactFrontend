import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

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

  const calculateTotal = (entry) => {
    return entry.salary + entry.bonus - entry.deductions;
  };

  const handleDownloadExcel = () => {
    const payrollData = payroll.map((entry) => ({
      Month: new Date(entry.payment_date).toLocaleDateString(),
      Salary: entry.salary,
      Bonus: entry.bonus,
      Deductions: entry.deductions,
      Total: calculateTotal(entry),
    }));

    const worksheet = XLSX.utils.json_to_sheet(payrollData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll Data");

    XLSX.writeFile(workbook, "Payroll_Monthly_Report.xlsx");
  };

  return (
    <div className="container mt-5">
      <h3>Payroll Records (Monthly)</h3>
      <button
        className="btn btn-success mb-3"
        onClick={handleDownloadExcel}
      >
        Download Excel
      </button>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>Month</th>
            <th>Salary</th>
            <th>Bonus</th>
            <th>Deductions</th>
            <th>Total</th>
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
                  </tr>
                  {expandedPayroll === entry._id && (
                    <tr>
                      <td colSpan="5">
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
              <td colSpan="5" className="text-center">
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
