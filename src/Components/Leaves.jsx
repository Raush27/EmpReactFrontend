import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx"; // Import xlsx library

const Leaves = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [currentLeaveId, setCurrentLeaveId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [statusMessage, setStatusMessage] = useState(""); // Status for listening/processing popup

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
              leave._id === leaveId
                ? { ...leave, status: "accepted", remarks }
                : leave
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
              leave._id === leaveId
                ? { ...leave, status: "rejected", remarks }
                : leave
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

  // Function to download leave records as Excel
  const downloadExcel = () => {
    const formattedRecords = leaveRecords.map((leave) => ({
      "Employee Name": leave.employee_id?.name || "N/A",
      "Start Date": formatDate(leave.start_date),
      "End Date": formatDate(leave.end_date),
      Status: leave.status,
      Remarks: leave.remarks || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Records");

    // Create a downloadable link
    XLSX.writeFile(workbook, "Leave_Records.xlsx");
  };

  const handleVoiceSearch = () => {
    // Check for both SpeechRecognition and webkitSpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
  
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      setStatusMessage("Listening...");
      recognition.start();
  
      recognition.onresult = (event) => {
        setStatusMessage("Processing...");
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
  
        if (transcript.includes("show all leaves")) {
          setSearchTerm(""); // Reset search term to show all leaves
        } else if (transcript.includes("leave of")) {
          const name = transcript.split("leave of")[1]?.trim();
          if (name) {
            setSearchTerm(name);
          } else {
            alert("Please specify an employee name.");
          }
        } else {
          alert("Command not recognized. Say 'show all leaves' or 'leave of [name]'.");
        }
      };
  
      recognition.onspeechend = () => {
        recognition.stop();
      };
  
      recognition.onend = () => {
        setStatusMessage("");
      };
  
      recognition.onerror = (event) => {
        console.error("Error with Speech Recognition:", event.error);
        setStatusMessage("");
        alert("An error occurred with voice recognition. Please try again.");
      };
    } else {
      alert("Speech Recognition is not supported in this browser.");
    }
  };
  

  // Filter leave records based on the searchTerm with exact match for employee name
  const filteredLeaves = leaveRecords.filter((leave) =>
    searchTerm
      ? leave.employee_id?.name?.toLowerCase() === searchTerm.toLowerCase()
      : true
  );

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between">
        <h3>Leave Records</h3>
        <button onClick={handleVoiceSearch} className="btn btn-primary">
          Search by Voice
        </button>
      </div>
      {statusMessage && (
        <div className="overlay">
          <div className="status-popup">
            <div>{statusMessage}</div>
            <p className="listening-text">
              Please wait, we're processing your request.
            </p>
          </div>
        </div>
      )}
      <button className="btn btn-primary" onClick={downloadExcel}>
        Download Leave
      </button>
      <div className="mt-4">
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
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.employee_id?.name}</td>
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
                <td colSpan="6" className="text-center">
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
