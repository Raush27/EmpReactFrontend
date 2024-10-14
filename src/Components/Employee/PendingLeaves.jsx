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

  useEffect(() => {
    fetchLeaveRecords();
  }, []);

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
          toast.error(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
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
                  {" "}
                  {/* Assume leave_id is provided */}
                  <td>{leave.leave_type}</td>
                  <td>{new Date(leave.start_date).toLocaleDateString()}</td>
                  <td>{new Date(leave.end_date).toLocaleDateString()}</td>
                  <td>{leave.reason ? leave.reason : 'N/A'}</td>
                  <td>{leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}</td>
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
