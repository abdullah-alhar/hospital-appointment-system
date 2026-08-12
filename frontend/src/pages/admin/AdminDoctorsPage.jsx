import { useState, useEffect } from 'react';
import { doctorApi } from '../../api';
import { useToast } from '../../components/Toast';
import { SkeletonStats, SkeletonTable } from '../../components/Skeleton';
import CountUp from '../../components/CountUp';
import Modal from '../../components/Modal';
import Icon from '../../components/Icon';

export default function AdminDoctorsPage() {
  const toast = useToast();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setDoctors(await doctorApi.getAll());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    setDeletingId(id);
    try {
      await doctorApi.remove(id);
      toast.success('Doctor deleted.');
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
    if (!newUsername.trim() || !newPassword.trim() || !newSpecialization.trim()) {
      setFormError('All fields are required.');
      return;
    }
    setCreating(true);
    try {
      await doctorApi.create({
        username: newUsername.trim(),
        password: newPassword,
        specialization: newSpecialization.trim()
      });
      setNewUsername('');
      setNewPassword('');
      setNewSpecialization('');
      setShowForm(false);
      toast.success('Doctor added.');
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
            <h1>Doctors Directory</h1>
            <p>Manage all hospital doctors and specializations</p>
          </div>
        </div>
        <SkeletonStats count={2} />
        <SkeletonTable rows={5} columns={4} />
      </div>
    );
  }

  // Simple stats
  const specializations = new Set(doctors.map(d => d.specialization)).size;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Doctors Directory</h1>
          <p>Manage all hospital doctors and specializations</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Doctor
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Icon name="pulse" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Total Doctors</div>
            <div className="stat-value"><CountUp value={doctors.length} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-soft)', color: 'var(--info)' }}><Icon name="building" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Specializations</div>
            <div className="stat-value"><CountUp value={specializations} /></div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title="Create New Doctor"
      >
        {formError && <div className="alert alert-error">{formError}</div>}
        <form id="createDoctorForm" onSubmit={handleCreate}>
          <div className="form-group">
            <label htmlFor="new-doc-user">Username</label>
            <input
              id="new-doc-user"
              className="form-control"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-doc-pass">Password</label>
            <input
              id="new-doc-pass"
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="new-doc-spec">Specialization</label>
            <input
              id="new-doc-spec"
              className="form-control"
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              placeholder="e.g. Cardiology"
            />
          </div>
        </form>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          <button type="submit" form="createDoctorForm" className="btn btn-primary" disabled={creating}>
            {creating && <span className="btn-spinner" aria-hidden="true" />}
            {creating ? 'Creating…' : 'Save Doctor'}
          </button>
        </div>
      </Modal>

      {doctors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="pulse" size={40} /></div>
          <p>No doctors registered yet.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper" style={{ margin: 0, border: 'none' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Doctor Info</th>
                  <th>ID</th>
                  <th>Specialization</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div className="table-user-cell">
                        <div className="table-avatar doctor">
                          {d.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="table-user-info">
                          <span className="table-user-name">Dr. {d.username}</span>
                          <span className="table-user-sub">Doctor</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{d.id}</span></td>
                    <td>
                      <span style={{ 
                        display: 'inline-block', padding: '0.25rem 0.65rem', 
                        borderRadius: '50px', background: 'var(--primary-soft)', color: 'var(--primary)', 
                        fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em'
                      }}>{d.specialization}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon danger"
                        disabled={deletingId === d.id}
                        onClick={() => handleDelete(d.id)}
                        title="Delete Doctor"
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
