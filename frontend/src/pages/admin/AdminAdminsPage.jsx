import { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { SkeletonStats, SkeletonTable } from '../../components/Skeleton';
import CountUp from '../../components/CountUp';
import Modal from '../../components/Modal';
import Icon from '../../components/Icon';

export default function AdminAdminsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setAdmins(await adminApi.getAll());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === user.id) {
      toast.error("You can't delete yourself.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    setDeletingId(id);
    try {
      await adminApi.remove(id);
      toast.success('Admin deleted.');
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!newUsername.trim() || !newPassword.trim()) {
      setFormError('Username and password are required.');
      return;
    }
    setCreating(true);
    try {
      await adminApi.create({ username: newUsername.trim(), password: newPassword });
      setNewUsername('');
      setNewPassword('');
      setShowForm(false);
      toast.success('Admin added.');
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>System Admins</h1>
            <p>Manage users with administrative privileges</p>
          </div>
        </div>
        <SkeletonStats count={1} />
        <SkeletonTable rows={4} columns={3} />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>System Admins</h1>
          <p>Manage users with administrative privileges</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Admin
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Icon name="shield" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Total Admins</div>
            <div className="stat-value"><CountUp value={admins.length} /></div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title="Create New Admin"
      >
        {formError && <div className="alert alert-error">{formError}</div>}
        <form id="createAdminForm" onSubmit={handleCreate}>
          <div className="form-group">
            <label htmlFor="new-admin-user">Username</label>
            <input
              id="new-admin-user"
              className="form-control"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="new-admin-pass">Password</label>
            <input
              id="new-admin-pass"
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
        </form>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          <button type="submit" form="createAdminForm" className="btn btn-primary" disabled={creating}>
            {creating && <span className="btn-spinner" aria-hidden="true" />}
            {creating ? 'Creating…' : 'Save Admin'}
          </button>
        </div>
      </Modal>

      {admins.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="shield" size={40} /></div>
          <p>No admins found.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper" style={{ margin: 0, border: 'none' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Admin Info</th>
                  <th>ID</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="table-user-cell">
                        <div className="table-avatar admin">
                          {a.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="table-user-info">
                          <span className="table-user-name">
                            {a.username}
                            {a.id === user.id && (
                              <span style={{ 
                                marginLeft: '0.5rem', fontSize: '0.65rem', color: 'var(--primary)', 
                                background: 'var(--primary-soft)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700
                              }}>YOU</span>
                            )}
                          </span>
                          <span className="table-user-sub">Administrator</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{a.id}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon danger"
                        disabled={deletingId === a.id || a.id === user.id}
                        onClick={() => handleDelete(a.id)}
                        title="Delete Admin"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
