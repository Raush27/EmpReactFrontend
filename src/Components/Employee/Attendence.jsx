import React, { useEffect, useState } from "react";
import axios from "axios";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentMonthPresentCount, setCurrentMonthPresentCount] = useState(0);
  const [previousMonthPresentCount, setPreviousMonthPresentCount] = useState(0);
  const [currentMonthTotalDays, setCurrentMonthTotalDays] = useState(0);
  const [previousMonthTotalDays, setPreviousMonthTotalDays] = useState(0);

  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1); // default current month
  const [filterYear, setFilterYear] = useState(new Date().getFullYear()); // default current year

  // Temporary states to store selected values before applying filters
  const [tempFilterMonth, setTempFilterMonth] = useState(filterMonth);
  const [tempFilterYear, setTempFilterYear] = useState(filterYear);

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
    } else if (type === "previous") {
      setPreviousMonthTotalDays(daysInMonth);
      fetchAttendanceRecords(month, year, type); // Fetch records for the previous month
    }
  };

  const calculatePresentCount = (attendanceData, type) => {
    const present = attendanceData.filter(
      (record) => record.status === "Present"
    ).length;
    if (type === "current") {
      setCurrentMonthPresentCount(present);
    } else if (type === "previous") {
      setPreviousMonthPresentCount(present);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "month") {
      setTempFilterMonth(Number(value)); // Update temporary state
    } else if (name === "year") {
      setTempFilterYear(Number(value)); // Update temporary state
    }
  };

  const applyFilters = () => {
    // When the user clicks apply, update the main filter states
    setFilterMonth(tempFilterMonth);
    setFilterYear(tempFilterYear);

    // Fetch and filter attendance data based on filter inputs
    fetchAttendanceRecords(tempFilterMonth, tempFilterYear, "current");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits for day
    const month = date.toLocaleString("default", { month: "short" }); // Abbreviated month
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="container my-5">
      {/* Attendance Summary */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-calendar-check-fill me-2"></i>Previous Month
                Summary
              </h5>
              <p className="card-text">
                {new Date(
                  new Date().getMonth() === 0
                    ? new Date().getFullYear() - 1
                    : new Date().getFullYear(),
                  new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1
                ).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>Total Days: {previousMonthTotalDays}</p>
              <p>Present Days: {previousMonthPresentCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-calendar-check me-2"></i>Current Month
                Summary
              </h5>
              <p className="card-text">
                {new Date().toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>Total Days: {currentMonthTotalDays}</p>
              <p>Present Days: {currentMonthPresentCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Form */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label htmlFor="filter_month" className="form-label">
            Month
          </label>
          <select
            name="month"
            className="form-select"
            value={tempFilterMonth}
            onChange={handleFilterChange}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="filter_year" className="form-label">
            Year
          </label>
          <input
            type="number"
            name="year"
            className="form-control"
            value={tempFilterYear}
            onChange={handleFilterChange}
            min="2000"
            max={new Date().getFullYear()}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={applyFilters}>
            <i className="bi bi-funnel-fill me-2"></i>Apply Filters
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData?.length > 0 ? (
            attendanceData.map((attendance) => (
              <tr key={attendance._id}>
                <td>{formatDate(attendance.date)}</td>
                <td>{attendance.status}</td>
                <td>{attendance.remarks ? attendance.remarks : "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No attendance records found for this month.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
