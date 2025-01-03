import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Home from "./Components/Home";
import Employee from "./Components/Employee";
import Category from "./Components/Category";
import AddCategory from "./Components/AddCategory";
import AddEmployee from "./Components/AddEmployee";
import EditEmployee from "./Components/EditEmployee";
import Start from "./Components/Start";
import PrivateRoute from "./Components/PrivateRoute";
import PayRoll from "./Components/PayRoll";
import AddPayroll from "./Components/AddPayroll";
import EmpDashboard from "./Components/Employee/EmpDashboard";
import PendingLeaves from "./Components/Employee/PendingLeaves";
import MonthlyPayroll from "./Components/Employee/MonthlyPayroll";
import PrivateEmpRoute from "./Components/PrivateEmpRoute";
import EmpHome from "./Components/Employee/EmpHome";
import Attendence from "./Components/Employee/Attendence";
import HrAttendence from "./Components/HrAttendence";
import Leaves from "./Components/Leaves";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Start />} />

        {/* Protected Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="" element={<Home />} />
          <Route path="/dashboard/employee" element={<Employee />} />
          <Route path="/dashboard/payroll" element={<PayRoll />} />
          <Route path="/dashboard/category" element={<Category />} />
          <Route path="/dashboard/attendence" element={<HrAttendence />} />
          <Route path="/dashboard/leaves" element={<Leaves />} />
          <Route path="/dashboard/add_category" element={<AddCategory />} />
          <Route path="/dashboard/add_employee" element={<AddEmployee />} />
          <Route path="/dashboard/add_payroll" element={<AddPayroll />} />
          <Route path="/dashboard/edit_employee/:id" element={<EditEmployee />} />
        </Route>

        {/* Protected Employee Routes */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateEmpRoute>
              <EmpDashboard />
            </PrivateEmpRoute>
          }
        >
          <Route path="" element={<EmpHome />} />
          <Route path="/employee-dashboard/attendance" element={<Attendence />} />
          <Route path="/employee-dashboard/pending-leaves" element={<PendingLeaves />} />
          <Route path="/employee-dashboard/monthly-payroll" element={<MonthlyPayroll />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
