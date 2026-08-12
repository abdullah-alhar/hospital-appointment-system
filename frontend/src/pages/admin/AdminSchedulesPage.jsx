import { useState, useEffect } from 'react';
import { scheduleApi, doctorApi } from '../../api';
import { useToast } from '../../components/Toast';
import { SkeletonStats, SkeletonTable } from '../../components/Skeleton';
import CountUp from '../../components/CountUp';
import Modal from '../../components/Modal';
import Icon from '../../components/Icon';

export default function AdminSchedulesPage() {
  const toast = useToast();
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [maxCount, setMaxCount] = useState(10);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    load();
    loadDoctors();
  }, []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setSchedules(await scheduleApi.getAll());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      setDoctors(await doctorApi.getAll());
    } catch (err) {
      console.error('Failed to load doctors:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    setDeletingId(id);
    try {
      await scheduleApi.remove(id);
      toast.success('Schedule deleted.');
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
    if (!doctorId || !date || !startTime || !maxCount) {
      setFormError('All fields are required.');
      return;
    }
    setCreating(true);
    try {
      const formattedTime = startTime.length === 5 ? `${startTime}:00` : startTime;
      await scheduleApi.create({
        doctorId,
        date,
        startTime: formattedTime,
        maxCount: parseInt(maxCount, 10)
      });
      setDoctorId('');
      setDate('');
      setStartTime('');
      setMaxCount(10);
      setShowForm(false);
      toast.success('Schedule created.');
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
            <h1>Doctor Schedules</h1>
            <p>Manage operating hours and availability for doctors</p>
          </div>
        </div>
        <SkeletonStats count={2} />
        <SkeletonTable rows={5} columns={5} />
      </div>
    );
  }

  // Calculate simple stats
  const totalSlots = schedules.reduce((sum, s) => sum + s.maxCount, 0);
  const bookedSlots = schedules.reduce((sum, s) => sum + s.bookedCount, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Doctor Schedules</h1>
          <p>Manage operating hours and availability for doctors</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Schedule
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Icon name="calendar" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Total Schedules</div>
            <div className="stat-value"><CountUp value={schedules.length} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}><Icon name="trendingUp" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Overall Bookings</div>
            <div className="stat-value">
              <CountUp value={bookedSlots} /> <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {totalSlots}</span>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title="Create New Schedule"
      >
        {formError && <div className="alert alert-error">{formError}</div>}
        <form id="createScheduleForm" onSubmit={handleCreate}>
          <div className="form-group">
            <label htmlFor="sch-doctor">Doctor</label>
            <select
              id="sch-doctor"
              className="form-control"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>Dr. {d.username} - {d.specialization}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="sch-date">Date</label>
            <input
              id="sch-date"
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="sch-time">Start Time</label>
            <input
              id="sch-time"
              type="time"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="sch-max">Max Patients</label>
            <input
              id="sch-max"
              type="number"
              min="1"
              max="100"
              className="form-control"
              value={maxCount}
              onChange={(e) => setMaxCount(e.target.value)}
            />
          </div>
        </form>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          <button type="submit" form="createScheduleForm" className="btn btn-primary" disabled={creating}>
            {creating && <span className="btn-spinner" aria-hidden="true" />}
            {creating ? 'Creating…' : 'Save Schedule'}
          </button>
        </div>
      </Modal>

      {schedules.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="calendar" size={40} /></div>
          <p>No schedules found.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper" style={{ margin: 0, border: 'none' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>ID</th>
                  <th>Bookings</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="table-user-cell">
                        <div className="table-avatar doctor">
                          {s.doctor?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="table-user-info">
                          <span className="table-user-name">Dr. {s.doctor?.username}</span>
                          <span className="table-user-sub">{s.doctor?.specialization || 'Doctor'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.date}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.startTime}</div>
                    </td>
                    <td><span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.id}</span></td>
                    <td style={{ minWidth: '150px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${(s.bookedCount / s.maxCount) * 100}%`, 
                            height: '100%', 
                            background: s.bookedCount >= s.maxCount ? '#DC2626' : 'var(--primary)',
                            borderRadius: '4px',
                            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, width: '40px' }}>{s.bookedCount}/{s.maxCount}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon danger"
                        disabled={deletingId === s.id}
                        onClick={() => handleDelete(s.id)}
                        title="Delete Schedule"
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
