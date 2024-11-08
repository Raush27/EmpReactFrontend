import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const PayRoll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [statusMessage, setStatusMessage] = useState(""); // Status for listening/processing popup

  useEffect(() => {
    axios
      .get("http://localhost:4000/auth/payrolls")
      .then((result) => {
        if (result.data.Status) {
          setPayrolls(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:4000/auth/delete_employee/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };

  const downloadPayroll = () => {
    axios({
      url: "http://localhost:4000/auth/download_payroll",
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "payroll_data.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        alert("Failed to download payroll data.");
        console.log(error);
      });
  };

  const handleVoiceSearch = () => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      setStatusMessage("Listening...");
      recognition.start();

      recognition.onresult = (event) => {
        setStatusMessage("Processing...");
        const transcript = event.results[0][0].transcript.toLowerCase().trim();

        if (transcript === "show all employee payrolls") {
          // Reset search term to show all payrolls
          setSearchTerm("");
        } else if (transcript.startsWith("show payroll of")) {
          // Extract the name after "show payroll of" and trim extra spaces
          const name = transcript.replace("show payroll of", "").trim();
          setSearchTerm(name);
        } else {
          alert("Command not recognized. Please say 'show all employee payrolls' or 'show payroll of [username]'.");
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

  // Filter payrolls based on the searchTerm with exact match for employee name
  const filteredPayrolls = payrolls.filter((p) =>
    searchTerm ? p.employee_id?.name?.toLowerCase() === searchTerm.toLowerCase() : true
  );

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-between">
        <h3>PayRoll List</h3>
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
      <Link to="/dashboard/add_payroll" className="btn btn-success mt-2">
        Add PayRoll
      </Link>
      <button className="btn btn-info ms-2 mt-2" onClick={downloadPayroll}>
        Download Payroll
      </button>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Email</th>
              <th>Salary</th>
              <th>Bonus</th>
              <th>Deductions</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayrolls.length > 0 ? (
              filteredPayrolls.map((p) => (
                <tr key={p._id}>
                  <td>{p.employee_id ? p.employee_id.name : "N/A"}</td>
                  <td>{p.employee_id ? p.employee_id.email : "N/A"}</td>
                  <td>{p.salary}</td>
                  <td>{p.bonus || "N/A"}</td>
                  <td>{p.deductions || "N/A"}</td>
                  <td>{new Date(p.payment_date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
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

export default PayRoll;
