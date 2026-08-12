import { useState, useEffect } from 'react';
import { patientApi } from '../../api';
import { useToast } from '../../components/Toast';
import { SkeletonStats, SkeletonTable } from '../../components/Skeleton';
import CountUp from '../../components/CountUp';
import Modal from '../../components/Modal';
import Icon from '../../components/Icon';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function AdminPatientsPage() {
  const toast = useToast();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newBloodGroup, setNewBloodGroup] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setPatients(await patientApi.getAll());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    setDeletingId(id);
    try {
      await patientApi.remove(id);
      toast.success('Patient deleted.');
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
    if (!newUsername.trim() || !newPassword.trim() || !newBloodGroup) {
      setFormError('All fields are required.');
      return;
    }
    setCreating(true);
    try {
      await patientApi.create({
        username: newUsername.trim(),
        password: newPassword,
        bloodGroup: newBloodGroup
      });
      setNewUsername('');
      setNewPassword('');
      setNewBloodGroup('');
      setShowForm(false);
      toast.success('Patient added.');
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
            <h1>Patients Overview</h1>
            <p>Manage all registered patients in the system</p>
          </div>
        </div>
        <SkeletonStats count={2} />
        <SkeletonTable rows={5} columns={4} />
      </div>
    );
  }

  // Calculate simple stats
  const aPos = patients.filter(p => p.bloodGroup === 'A+').length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Patients Overview</h1>
          <p>Manage all registered patients in the system</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Patient
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Icon name="users" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Total Patients</div>
            <div className="stat-value"><CountUp value={patients.length} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--danger-soft)', color: '#DC2626' }}><Icon name="droplet" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">A+ Donors</div>
            <div className="stat-value"><CountUp value={aPos} /></div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title="Create New Patient"
      >
        {formError && <div className="alert alert-error">{formError}</div>}
        <form id="createPatientForm" onSubmit={handleCreate}>
          <div className="form-group">
            <label htmlFor="new-pat-user">Username</label>
            <input
              id="new-pat-user"
              className="form-control"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-pat-pass">Password</label>
            <input
              id="new-pat-pass"
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="new-pat-bg">Blood Group</label>
            <select
              id="new-pat-bg"
              className="form-control"
              value={newBloodGroup}
              onChange={(e) => setNewBloodGroup(e.target.value)}
            >
              <option value="" disabled>Select group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </form>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          <button type="submit" form="createPatientForm" className="btn btn-primary" disabled={creating}>
            {creating && <span className="btn-spinner" aria-hidden="true" />}
            {creating ? 'Creating…' : 'Save Patient'}
          </button>
        </div>
      </Modal>

      {patients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="user" size={40} /></div>
          <p>No patients registered yet.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper" style={{ margin: 0, border: 'none' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Patient Info</th>
                  <th>ID</th>
                  <th>Blood Group</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="table-user-cell">
                        <div className="table-avatar patient">
                          {p.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="table-user-info">
                          <span className="table-user-name">{p.username}</span>
                          <span className="table-user-sub">Patient</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.id}</span></td>
                    <td>
                      <span style={{ 
                        display: 'inline-block', padding: '0.2rem 0.6rem', 
                        borderRadius: '6px', background: '#FEE2E2', color: '#DC2626', 
                        fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', fontWeight: 700 
                      }}>{p.bloodGroup}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon danger"
                        disabled={deletingId === p.id}
                        onClick={() => handleDelete(p.id)}
                        title="Delete Patient"
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
