import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusMessage, setStatusMessage] = useState(""); // For listening/processing popup

  useEffect(() => {
    axios
      .get("http://localhost:4000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleStatusChange = (id, status) => {
    const statusValue = status === "active" ? 0 : 1;
    const confirmationMessage =
      status === "active"
        ? "Are you sure you want to deactivate this employee?"
        : "Are you sure you want to activate this employee?";
    const confirmStatusChange = window.confirm(confirmationMessage);
    if (confirmStatusChange) {
      axios
        .put(`http://localhost:4000/auth/update_employee_status/${id}`, {
          status: statusValue,
        })
        .then((result) => {
          if (result.data.Status) {
            window.location.reload();
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => {
          console.error("Error updating employee status:", err);
          alert("An error occurred while updating the employee status.");
        });
    }
  };

  const handleVoiceSearch = () => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      setStatusMessage("Listening..."); // Set to "Listening..." when starting
      recognition.start();

      recognition.onresult = (event) => {
        setStatusMessage("Processing..."); // Change to "Processing..." after receiving input
        const transcript = event.results[0][0].transcript.toLowerCase().trim();

        if (transcript.includes("all")) {
          setSearchTerm("");
        } else if (transcript.startsWith("show employee")) {
          const name = transcript.replace("show employee", "").trim();
          setSearchTerm(name);
        } else {
          setSearchTerm(transcript);
        }
      };

      recognition.onspeechend = () => {
        recognition.stop();
      };

      recognition.onend = () => {
        setStatusMessage(""); // Hide the status message after processing is done
        console.log("Voice recognition ended");
      };

      recognition.onerror = (event) => {
        console.error("Error with Speech Recognition:", event.error);
        setStatusMessage(""); // Hide the status message if an error occurs
        alert("An error occurred with voice recognition. Please try again.");
      };
    } else {
      alert("Speech Recognition is not supported in this browser.");
    }
  };

  const filteredEmployees = employee.filter((e) =>
    searchTerm ? e.name.toLowerCase() === searchTerm : true
  );

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-between">
        <h3>Employee List</h3>
        <button onClick={handleVoiceSearch} className="btn btn-primary">
          Search by Voice
        </button>
      </div>
      {statusMessage && (
        <div className="overlay">
          <div className="status-popup">
            <div>{statusMessage}</div>
            <p className="listening-text">Please wait, we're processing your request.</p>
          </div>
        </div>
      )}
      <Link to="/dashboard/add_employee" className="btn btn-success mt-2">
        Add Employee
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((e, idx) => (
                <tr key={idx}>
                  <td>{e.name}</td>
                  <td>
                    <img
                      src={`http://localhost:4000/Images/` + e.image}
                      className="employee_image"
                      alt={e.name}
                    />
                  </td>
                  <td>{e.email}</td>
                  <td>{e.address}</td>
                  <td>{e.salary}</td>
                  <td>{e.status[0].toUpperCase() + e.status.substring(1)}</td>
                  <td>
                    <Link
                      to={`/dashboard/edit_employee/` + e._id}
                      className={`btn btn-info btn-sm me-2 ${
                        e.status === "inactive" ? "disabled" : ""
                      }`}
                      onClick={(e) =>
                        e.status === "inactive" && e.preventDefault()
                      }
                      aria-disabled={e.status === "inactive"}
                    >
                      Edit
                    </Link>
                    <button
                      className={`btn ${
                        e.status === "active" ? "btn-warning" : "btn-success"
                      }`}
                      onClick={() => handleStatusChange(e._id, e.status)}
                    >
                      {e.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Not found, please try again.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
