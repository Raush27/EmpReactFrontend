import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PendingLeaves = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [leave, setLeave] = useState({
    leave_type: "Sick Leave",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [attendanceData, setAttendanceData] = useState([]);

  const [previousMonthPresentCount, setPreviousMonthPresentCount] = useState(0);
  const [currentMonthPresentCount, setCurrentMonthPresentCount] = useState(0);

  const [currentMonthTotalDays, setCurrentMonthTotalDays] = useState(0);
  const [previousMonthTotalDays, setPreviousMonthTotalDays] = useState(0);

  useEffect(() => {
    fetchLeaveRecords();
  }, []);

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

  const fetchLeaveRecords = () => {
    let user_id = localStorage.getItem("userid");
    axios
      .get(`http://localhost:4000/auth/leave/${user_id}`)
      .then((result) => {
        if (result.data.Status) {
          setLeaveData(result.data.Result);
        }
      })
      .catch((err) => console.log(err));
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

  const openForm = () => setIsOpen(true);
  const closeForm = () => setIsOpen(false);

  const handleChange = (e) => {
    setLeave({ ...leave, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let user_id = localStorage.getItem("userid");
    const leaveRequest = {
      employee_id: user_id,
      leave_type: leave.leave_type,
      start_date: leave.start_date,
      end_date: leave.end_date,
      reason: leave.reason,
    };
    axios
      .post("http://localhost:4000/auth/apply_leave", leaveRequest)
      .then((result) => {
        if (result.data.Status) {
          toast.success("Leave applied successfully");
          fetchLeaveRecords();
          closeForm();
        } else {
          toast.error(result.data.Error || "Failed to apply for leave.");
        }
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.Error || "Something went wrong!";
        console.error("Error:", errorMessage);
        toast.error(errorMessage);
      });
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <h3 className="text-center mb-4">Apply for Leave</h3>
      </div>

      <button className="btn btn-success mb-2" onClick={openForm}>
        Apply for Leave
      </button>

      {isOpen && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="btn btn-danger mb-4" onClick={closeForm}>
              Close
            </button>
            <form
              onSubmit={handleSubmit}
              className="border p-4 shadow-sm bg-light"
            >
              <div className="mb-3">
                <label htmlFor="leave_type" className="form-label">
                  Leave Type
                </label>
                <select
                  name="leave_type"
                  className="form-select"
                  value={leave.leave_type}
                  onChange={handleChange}
                  required
                >
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="start_date" className="form-label">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  className="form-control"
                  value={leave.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="end_date" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  className="form-control"
                  value={leave.end_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="reason" className="form-label">
                  Reason for Leave
                </label>
                <textarea
                  name="reason"
                  className="form-control"
                  value={leave.reason}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Submit Leave
              </button>
            </form>
          </div>
        </div>
      )}

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

      {/* List of leave applications */}
      <div className="mt-5">
        <h3>Your Leave Records</h3>
        <table className="table table-bordered table-striped mt-3">
          <thead className="table-dark">
            <tr>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.length > 0 ? (
              leaveData.map((leave) => (
                <tr key={leave.leave_id}>
                  {/* Assume leave_id is provided */}
                  <td>{leave.leave_type}</td>
                  <td>{new Date(leave.start_date).toLocaleDateString()}</td>
                  <td>{new Date(leave.end_date).toLocaleDateString()}</td>
                  <td>{leave.remarks ? leave.remarks : "N/A"}</td>
                  <td>
                    {leave.status.charAt(0).toUpperCase() +
                      leave.status.slice(1)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingLeaves;
