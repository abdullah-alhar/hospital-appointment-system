import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { patientApi, doctorApi, adminApi } from '../api';
import Icon from '../components/Icon';
import './ProfilePage.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function ProfilePage() {
  const { user, login } = useAuth();
  const toast = useToast();

  // Profile edit state
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '');
  const [specialization, setSpecialization] = useState(user?.specialization || '');
  const [profileErr, setProfileErr] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileErr('');

    if (!username.trim()) {
      setProfileErr('Username is required.');
      return;
    }

    setProfileLoading(true);
    try {
      let updated;
      if (user.role === 'PATIENT') {
        updated = await patientApi.update(user.id, {
          username: username.trim(),
          bloodGroup,
        });
      } else if (user.role === 'DOCTOR') {
        updated = await doctorApi.update(user.id, {
          username: username.trim(),
          specialization,
        });
      } else if (user.role === 'ADMIN') {
        updated = await adminApi.update(user.id, {
          username: username.trim(),
        });
      }

      if (updated) {
        login({ ...user, ...updated, role: user.role });
        toast.success('Profile updated.');
        setEditMode(false);
      }
    } catch (err) {
      setProfileErr(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwErr('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwErr('All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwErr('New passwords do not match.');
      return;
    }
    if (newPassword.length < 4) {
      setPwErr('New password must be at least 4 characters.');
      return;
    }

    setPwLoading(true);
    try {
      if (user.role === 'PATIENT') {
        await patientApi.changePassword(user.id, {
          oldPassword,
          newPassword,
        });
      } else if (user.role === 'DOCTOR') {
        await doctorApi.changePassword(user.id, {
          oldPassword,
          newPassword,
        });
      } else if (user.role === 'ADMIN') {
        await adminApi.changePassword(user.id, {
          oldPassword,
          newPassword,
        });
      }
      toast.success('Password changed.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwErr(err.message || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  const roleLabel = user?.role?.charAt(0) + user?.role?.slice(1).toLowerCase();

  return (
    <div className="page profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account details and preferences</p>
      </div>

      <div className="profile-grid">
        {/* ─── Profile Info Card ──────────────────── */}
        <div className="card profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-header-info">
              <h2>{user?.username}</h2>
              <div className="profile-role-badge">{roleLabel}</div>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-detail-row">
              <span className="profile-detail-label">User ID</span>
              <span className="profile-detail-value mono">{user?.id}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Username</span>
              <span className="profile-detail-value">{user?.username}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Role</span>
              <span className="profile-detail-value">{roleLabel}</span>
            </div>
            {user?.role === 'PATIENT' && (
              <div className="profile-detail-row">
                <span className="profile-detail-label">Blood Group</span>
                <span className="profile-detail-value">
                  <span className="profile-blood-badge">{user?.bloodGroup || '—'}</span>
                </span>
              </div>
            )}
            {user?.role === 'DOCTOR' && (
              <div className="profile-detail-row">
                <span className="profile-detail-label">Specialization</span>
                <span className="profile-detail-value">{user?.specialization || '—'}</span>
              </div>
            )}
          </div>

          {!editMode && (
            <button
              className="btn btn-outline"
              onClick={() => setEditMode(true)}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', width: '100%' }}
            >
              <Icon name="edit" size={15} /> Edit Profile
            </button>
          )}
        </div>

        {/* ─── Edit Profile Card ─────────────────── */}
        {editMode && (
          <div className="card profile-card">
            <h3 className="profile-section-title">Edit Profile</h3>

            {profileErr && <div className="alert alert-error">{profileErr}</div>}

            <form onSubmit={handleProfileSave}>
              <div className="form-group">
                <label htmlFor="profile-username">Username</label>
                <input
                  id="profile-username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {user.role === 'PATIENT' && (
                <div className="form-group">
                  <label htmlFor="profile-bloodGroup">Blood Group</label>
                  <select
                    id="profile-bloodGroup"
                    className="form-control"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="" disabled>Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              )}

              {user.role === 'DOCTOR' && (
                <div className="form-group">
                  <label htmlFor="profile-specialization">Specialization</label>
                  <input
                    id="profile-specialization"
                    className="form-control"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                </div>
              )}

              <div className="profile-form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={profileLoading}
                >
                  {profileLoading && <span className="btn-spinner" aria-hidden="true" />}
                  {profileLoading ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditMode(false);
                    setUsername(user.username);
                    setBloodGroup(user.bloodGroup || '');
                    setSpecialization(user.specialization || '');
                    setProfileErr('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── Change Password Card ──────────────── */}
        <div className="card profile-card">
          <h3 className="profile-section-title">Change Password</h3>
            <p className="profile-section-desc">Update your account password</p>

            {pwErr && <div className="alert alert-error">{pwErr}</div>}

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label htmlFor="pw-old">Current Password</label>
                <input
                  id="pw-old"
                  type="password"
                  className="form-control"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pw-new">New Password</label>
                <input
                  id="pw-new"
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pw-confirm">Confirm New Password</label>
                <input
                  id="pw-confirm"
                  type="password"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={pwLoading}
              >
                {pwLoading && <span className="btn-spinner" aria-hidden="true" />}
                {pwLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>
      </div>
    </div>
  );
}
