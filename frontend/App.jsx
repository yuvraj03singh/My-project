import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import Employees from './components/Employees';
import Reports from './components/Reports';
import EmployeeDashboard from './components/EmployeeDashboard';
import EmployeeAttendance from './components/EmployeeAttendance';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/attendance" element={<Layout><Attendance /></Layout>} />
        <Route path="/employees" element={<Layout><Employees /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/my-attendance" element={<EmployeeAttendance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
