import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Patient pages
import BrowseSchedulesPage from './pages/patient/BrowseSchedulesPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';

// Doctor pages
import DoctorSchedulesPage from './pages/doctor/DoctorSchedulesPage';
import CreateSchedulePage from './pages/doctor/CreateSchedulePage';

// Admin pages
import AdminPatientsPage from './pages/admin/AdminPatientsPage';
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage';
import AdminAdminsPage from './pages/admin/AdminAdminsPage';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';

function AppShell() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      {/* Landing page has its own embedded nav — hide the global dark one */}
      {!isLanding && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient routes */}
        <Route
          path="/patient/schedules"
          element={
            <ProtectedRoute roles={['PATIENT']}>
              <BrowseSchedulesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute roles={['PATIENT']}>
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />

        {/* Doctor routes */}
        <Route
          path="/doctor/schedules"
          element={
            <ProtectedRoute roles={['DOCTOR']}>
              <DoctorSchedulesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/schedules/new"
          element={
            <ProtectedRoute roles={['DOCTOR']}>
              <CreateSchedulePage />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminPatientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDoctorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/admins"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminAdminsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminAppointmentsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
