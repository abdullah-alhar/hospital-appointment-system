import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer on every route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon, label }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
    >
      <span className="sidebar-icon"><Icon name={icon} size={17} /></span>
      {label}
    </NavLink>
  );

  return (
    <div className="dashboard-layout">
      {/* ─── Mobile backdrop ─────────────────────────────── */}
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      {/* ─── Sidebar ───────────────────────────────────── */}
      <aside className={`dashboard-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand" onClick={() => navigate('/')}>
          <span className="sidebar-brand-icon" aria-hidden="true"><Icon name="cross" size={16} /></span>
          <span className="sidebar-brand-text">MedBook</span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Menu</div>
          
          {user?.role === 'ADMIN' && (
            <>
              <NavItem to="/admin/patients" icon="users" label="Patients" />
              <NavItem to="/admin/doctors" icon="pulse" label="Doctors" />
              <NavItem to="/admin/schedules" icon="calendar" label="Schedules" />
              <NavItem to="/admin/appointments" icon="clipboard" label="Appointments" />
              <NavItem to="/admin/admins" icon="shield" label="Admins" />
            </>
          )}

          {user?.role === 'DOCTOR' && (
            <>
              <NavItem to="/doctor/schedules" icon="calendar" label="My Schedules" />
              {/* Note: In a real app we might have a separate appointments view, but let's stick to what exists */}
            </>
          )}

          {user?.role === 'PATIENT' && (
            <>
              <NavItem to="/patient/schedules" icon="search" label="Find Doctor" />
              <NavItem to="/patient/appointments" icon="clipboard" label="My Appointments" />
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={() => navigate('/profile')}>
            <div className="sidebar-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-username">{user?.username}</div>
              <div className="sidebar-role">{user?.role}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Logout">
            <Icon name="logout" size={17} />
          </button>
        </div>
      </aside>

      {/* ─── Main Content ──────────────────────────────── */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <Icon name={mobileOpen ? 'x' : 'menu'} size={20} />
          </button>
          <div className="header-greeting">
            Good to see you, <strong>{user?.username}</strong>
          </div>
        </header>

        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}
