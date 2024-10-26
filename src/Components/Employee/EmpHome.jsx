import axios from "axios";
import React, { useEffect, useState } from "react";

const EmpHome = () => {
  const [profile, setProfile] = useState();
  const [totalLeaves, setTotalLeaves] = useState(24);
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString()
  );
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentMonthPresentCount, setCurrentMonthPresentCount] = useState(0);
  const [currentMonthTotalDays, setCurrentMonthTotalDays] = useState(0);
  const [payroll, setPayRoll] = useState([]);
  const [pendingCounts, setPendingCount] = useState();

  useEffect(() => {
    let user_id = localStorage.getItem("userid");
    axios
      .get("http://localhost:4000/employee/detail/" + user_id)
      .then((result) => {
        setProfile(result?.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetchLeaveRecords();
  }, []);

  const fetchLeaveRecords = () => {
    let user_id = localStorage.getItem("userid");
    axios
      .get(`http://localhost:4000/auth/leave/${user_id}`)
      .then((result) => {
        if (result.data.Status) {
          const acceptedCount = result?.data.Result.filter(
            (leave) => leave.status === "accepted"
          ).length;
          setPendingCount(totalLeaves - acceptedCount);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // On initial load, calculate the current and previous month data for summary
    calculateMonthData(
      new Date().getMonth() + 1,
      new Date().getFullYear(),
      "current"
    );
    const previousMonth =
      new Date().getMonth() === 0 ? 12 : new Date().getMonth();
    const previousYear =
      new Date().getMonth() === 0
        ? new Date().getFullYear() - 1
        : new Date().getFullYear();
    calculateMonthData(previousMonth, previousYear, "previous");
  }, []);

  const fetchAttendanceRecords = (month, year, type) => {
    let user_id = localStorage.getItem("userid");
    axios
      .get(`http://localhost:4000/auth/attendance_report/${user_id}`)
      .then((result) => {
        if (result.data.status) {
          const filteredAttendance = result.data.attendance.filter(
            (attendance) => {
              const attendanceDate = new Date(attendance.date);
              return (
                attendanceDate.getMonth() + 1 === month &&
                attendanceDate.getFullYear() === year
              );
            }
          );

          if (type === "current") {
            setAttendanceData(filteredAttendance); // Update the table for the current filter
          }

          calculatePresentCount(filteredAttendance, type); // Calculate present count
        }
      })
      .catch((err) => console.log(err));
  };

  const calculateMonthData = (month, year, type) => {
    const daysInMonth = new Date(year, month, 0).getDate(); // Get total days in the month
    if (type === "current") {
      setCurrentMonthTotalDays(daysInMonth);
      fetchAttendanceRecords(month, year, type); // Fetch records for the current month
    }
  };

  const calculatePresentCount = (attendanceData, type) => {
    const present = attendanceData.filter(
      (record) => record.status === "Present"
    ).length;
    if (type === "current") {
      setCurrentMonthPresentCount(present);
    }
  };

  useEffect(() => {
    const user_id = localStorage.getItem("userid");
    axios
      .get(`http://localhost:4000/auth/payroll?employee_id=${user_id}`)
      .then((result) => {
        setPayRoll(result?.data?.Result || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const getCurrentMonthPayroll = (payrollData) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Months are 0-based in JS
    const currentYear = currentDate.getFullYear();

    // Filter payrolls for the current month and year
    const currentMonthPayroll = payrollData.filter((payroll) => {
      const paymentDate = new Date(payroll.payment_date);
      return (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      );
    });

    return currentMonthPayroll[0];
  };

  const currentMonthPayroll = getCurrentMonthPayroll(payroll);

  const netSalary =
    currentMonthPayroll?.salary +
    currentMonthPayroll?.bonus -
    currentMonthPayroll?.deductions;

  const paymentDate = new Date(currentMonthPayroll?.payment_date);
  const formattedDate = paymentDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Update time continuously every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000); // Update every second

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
              <h4 className="card-title">Total Annual Leaves</h4>
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
              <span>Address: {profile?.address}</span>
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
              <p className="display-4 text-warning">{pendingCounts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Attendance Record Card */}
        <h5 className="card-title mb-3">Current Month Summary</h5>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="card-title">Attendance Record</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Present Days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {new Date().toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {currentMonthTotalDays}/ {currentMonthPresentCount} days
                    </td>
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
                    <td>{formattedDate || "N/A"}</td>
                    <td>₹{netSalary}</td>
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
