import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Home from "./Components/Home";
import Employee from "./Components/Employee";
import Category from "./Components/Category";
import AddCategory from "./Components/AddCategory";
import AddEmployee from "./Components/AddEmployee";
import EditEmployee from "./Components/EditEmployee";
import Start from "./Components/Start";
import EmployeeLogin from "./Components/EmployeeLogin";
import EmployeeDetail from "./Components/EmployeeDetail";
import PrivateRoute from "./Components/PrivateRoute";
import PayRoll from "./Components/PayRoll";
import AddPayroll from "./Components/AddPayroll";
import EmpDashboard from "./Components/Employee/EmpDashboard";
import ApplyLeave from "./Components/Employee/ApplyLeave";
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
        <Route path="/" element={<Start />}></Route>
        <Route path="/adminlogin" element={<Login />}></Route>
        <Route path="/employee_login" element={<EmployeeLogin />}></Route>
        <Route path="/employee_detail/:id" element={<EmployeeDetail />}></Route>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="" element={<Home />}></Route>
          <Route path="/dashboard/employee" element={<Employee />}></Route>
          <Route path="/dashboard/payroll" element={<PayRoll />}></Route>
          <Route path="/dashboard/category" element={<Category />}></Route>
          <Route path="/dashboard/attendence" element={<HrAttendence />}></Route>
          <Route path="/dashboard/leaves" element={<Leaves />}></Route>

          <Route
            path="/dashboard/add_category"
            element={<AddCategory />}
          ></Route>
          <Route
            path="/dashboard/add_employee"
            element={<AddEmployee />}
          ></Route>
          <Route path="/dashboard/add_payroll" element={<AddPayroll />}></Route>
          <Route
            path="/dashboard/edit_employee/:id"
            element={<EditEmployee />}
          ></Route>
        </Route>

        <Route
          path="/employee-dashboard"
          element={
            <PrivateEmpRoute>
              <EmpDashboard />
            </PrivateEmpRoute>
          }
        >
          <Route path="" element={<EmpHome />}></Route>
          <Route
            path="/employee-dashboard/apply-leave"
            element={<ApplyLeave />}
          ></Route>
            <Route
            path="/employee-dashboard/attendance"
            element={<Attendence />}
          ></Route>
          <Route
            path="/employee-dashboard/pending-leaves"
            element={<PendingLeaves />}
          ></Route>
          <Route
            path="/employee-dashboard/monthly-payroll"
            element={<MonthlyPayroll />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;