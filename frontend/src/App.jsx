import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Patient pages
import BrowseSchedulesPage from './pages/patient/BrowseSchedulesPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';

// Doctor pages
import DoctorSchedulesPage from './pages/doctor/DoctorSchedulesPage';

// Admin pages
import AdminPatientsPage from './pages/admin/AdminPatientsPage';
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage';
import AdminAdminsPage from './pages/admin/AdminAdminsPage';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';
import AdminSchedulesPage from './pages/admin/AdminSchedulesPage';

function AppShell() {
  // Routes wrapped in DashboardLayout
  const dashboardRoutes = (
    <DashboardLayout>
      <Routes>
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={['PATIENT', 'DOCTOR', 'ADMIN']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

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
          path="/admin/schedules"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminSchedulesPage />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={dashboardRoutes} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppShell />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
