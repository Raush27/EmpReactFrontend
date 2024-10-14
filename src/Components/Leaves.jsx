import axios from "axios";
import React, { useEffect, useState } from "react";

const Leaves = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [currentLeaveId, setCurrentLeaveId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/auth/leave")
      .then((result) => {
        if (result.data.Status) {
          setLeaveRecords(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAccept = (leaveId) => {
    axios
      .put(`http://localhost:4000/auth/leave/accept/${leaveId}`, { remarks })
      .then((result) => {
        if (result.data.Status) {
          alert("Leave accepted successfully");
          setLeaveRecords((prev) =>
            prev.map((leave) =>
              leave._id === leaveId ? { ...leave, status: "accepted", remarks } : leave
            )
          );
          setRemarks("");
          setCurrentLeaveId(null);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleReject = (leaveId) => {
    axios
      .put(`http://localhost:4000/auth/leave/reject/${leaveId}`, { remarks })
      .then((result) => {
        if (result.data.Status) {
          alert("Leave rejected successfully");
          setLeaveRecords((prev) =>
            prev.map((leave) =>
              leave._id === leaveId ? { ...leave, status: "rejected", remarks } : leave
            )
          );
          setRemarks("");
          setCurrentLeaveId(null);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <h3 className="text-center mb-4">Leave Records</h3>
      </div>

      <div className="mt-5">
        <h3>Leave Records</h3>
        <table className="table table-bordered table-striped mt-3">
          <thead className="table-dark">
            <tr>
              <th>Employee Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveRecords.length > 0 ? (
              leaveRecords.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.employee_id.name}</td>
                  <td>{formatDate(leave.start_date)}</td>
                  <td>{formatDate(leave.end_date)}</td>
                  <td>{leave.status}</td>
                  <td>{leave.remarks || "N/A"}</td>
                  <td>
                    {currentLeaveId === leave._id ? (
                      <div>
                        <input
                          type="text"
                          placeholder="Remarks"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          className="form-control mb-2"
                        />
                        <button
                          className="btn btn-success me-2"
                          onClick={() => handleAccept(leave._id)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleReject(leave._id)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => setCurrentLeaveId(leave._id)}
                      >
                        Action
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
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

export default Leaves;
