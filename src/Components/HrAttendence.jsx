import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const HrAttendence = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [attendance, setAttendance] = useState({
    employee_id: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
    remarks: "",
  });
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // default to the current month

  const openForm = () => {
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // Fetch list of employees
    axios
      .get("http://localhost:4000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployees(result.data.Result);
        } else {
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Fetch attendance records for the selected month
    fetchAttendance(selectedMonth);
  }, [selectedMonth]);

  const fetchAttendance = (month) => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), month - 1, 1);
    const endOfMonth = new Date(currentDate.getFullYear(), month, 0);

    axios
      .get(`http://localhost:4000/auth/attendance_report`, {
        params: {
          start_date: startOfMonth.toISOString().split("T")[0],
          end_date: endOfMonth.toISOString().split("T")[0],
        },
      })
      .then((result) => {
        if (result.data.status) {
          setAttendanceList(result.data.attendance);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setAttendance({ ...attendance, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:4000/auth/mark_attendance", attendance)
      .then((result) => {
        if (result.data.Status) {
          toast.success("Attendance marked successfully");
          setIsOpen(false);
          fetchAttendance(selectedMonth); // Refresh attendance after marking
        } else {
          toast.error(result.data.Error);
        }
      })
      .catch((err) => toast.error(err.response.data.Error));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value)); // Update selected month
  };

  // Function to format date to "Month Date, Year"
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Group attendance records by employee
  const groupedAttendance = attendanceList.reduce((acc, att) => {
    const empId = att.employee_id._id;
    if (!acc[empId]) {
      acc[empId] = {
        employee: att.employee_id,
        records: [],
      };
    }
    acc[empId].records.push(att);
    return acc;
  }, {});

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <h3 className="text-center mb-4">Attendance Record</h3>
      </div>
      <button className="btn btn-success mb-2" onClick={openForm}>
        Mark Attendance
      </button>
      {/* Attendance Form */}
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
                <label htmlFor="employee_id" className="form-label">
                  Employee
                </label>
                <select
                  name="employee_id"
                  className="form-select"
                  value={attendance.employee_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={attendance.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  name="status"
                  className="form-select"
                  value={attendance.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="remarks" className="form-label">
                  Remarks (optional)
                </label>
                <input
                  type="text"
                  name="remarks"
                  className="form-control"
                  value={attendance.remarks}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Mark Attendance
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Month Filter Dropdown */}
      <div className="mb-3">
        <label htmlFor="monthFilter" className="form-label">
          Filter by Month:
        </label>
        <select
          id="monthFilter"
          className="form-select"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {new Date(0, month - 1).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance List */}
      <div className="mt-5">
        <h3>Attendance Records (Selected Month)</h3>
        <table className="table table-bordered table-striped mt-3">
          <thead className="table-dark">
            <tr>
              <th>Employee Name</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedAttendance).length > 0 ? (
              Object.values(groupedAttendance).map((group) => (
                <React.Fragment key={group.employee._id}>
                  <tr
                    onClick={() =>
                      setExpandedEmployee(
                        expandedEmployee === group.employee._id
                          ? null
                          : group.employee._id
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td>{group.employee.name}</td>
                    <td>{group.records[0].status}</td>
                    <td>{group.records[0].remarks || "N/A"}</td>
                    <td>
                      <button className="btn btn-link">
                        {expandedEmployee === group.employee._id ? "▲" : "▼"}
                      </button>
                    </td>
                  </tr>
                  {expandedEmployee === group.employee._id && (
                    <tr>
                      <td colSpan="4">
                        <table className="table mt-2">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.records.map((att) => (
                              <tr key={att._id}>
                                <td>{formatDate(att.date)}</td>
                                <td>{att.status}</td>
                                <td>{att.remarks || "N/A"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No attendance records for this month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HrAttendence;
