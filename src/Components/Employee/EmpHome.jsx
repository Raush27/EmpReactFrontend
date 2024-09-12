import axios from "axios";
import React, { useEffect, useState } from "react";

const EmpHome = () => {
  const [profile, setProfile] = useState();
  const [totalLeaves, setTotalLeaves] = useState(20);
  const [pendingLeaves, setPendingLeaves] = useState(5);
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString()
  );

  useEffect(() => {
    let user_id = localStorage.getItem("userid");
    axios
      .get("http://localhost:4000/employee/detail/" + user_id)
      .then((result) => {
        setProfile(result?.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Update date and time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="container mt-5">
      <div className="col-md-12 mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-body text-center">
            <p className="display-6">{currentDateTime}</p>
          </div>
        </div>
      </div>
      <div className="row">
        {/* Total Leaves Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <i className="fs-4 bi-check-circle text-success mb-3"></i>
              <h4 className="card-title">Total Leaves</h4>
              <p className="display-4 text-success">{totalLeaves}</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              {profile?.image ? (
                <div className="profile">
                  <img
                    alt=""
                    style={{
                      height: "50px",
                      width: "50px",
                      borderRadius: "50%",
                      border: "1px solid red",
                      padding: "12px",
                    }}
                    src={`http://localhost:4000/Images/${profile?.image}`}
                  />
                </div>
              ) : (
                <i className="fs-4 bi-person-circle text-primary mb-3"></i>
              )}
              <h4 className="card-title">{profile?.name}</h4>
              <p className="card-text text-muted">
                {profile?.category_id.name}
              </p>
              <p className="card-text">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Pending Leaves Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <i className="fs-4 bi-clock text-warning mb-3"></i>
              <h4 className="card-title">Pending Leaves</h4>
              <p className="display-4 text-warning">{pendingLeaves}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Attendance Record Card */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="card-title">Attendance Record</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Present Days</th>
                    <th>Absent Days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{profile?.presentDays || 0}</td>
                    <td>{profile?.absentDays || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payroll Summary Card */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="card-title">Payroll Summary</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Net Salary</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{profile?.lastPayrollMonth || "N/A"}</td>
                    <td>{profile?.netSalary || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upcoming Holidays Card */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="card-title">Upcoming Holidays</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Holiday</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{profile?.nextHoliday || "N/A"}</td>
                    <td>{profile?.nextHolidayDate || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpHome;
