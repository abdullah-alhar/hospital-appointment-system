import { useState, useEffect } from 'react';
import { scheduleApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { SkeletonStats, SkeletonCards } from '../../components/Skeleton';
import CountUp from '../../components/CountUp';
import Modal from '../../components/Modal';
import Icon from '../../components/Icon';

export default function DoctorSchedulesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Modal form state
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [maxCount, setMaxCount] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await scheduleApi.getByDoctor(user.id);
      setSchedules(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    setDeletingId(id);
    try {
      await scheduleApi.remove(id);
      toast.success('Schedule deleted.');
      loadSchedules();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!date || !startTime || !maxCount) {
      setFormError('All fields are required.');
      return;
    }
    if (Number(maxCount) < 1) {
      setFormError('Max patients must be at least 1.');
      return;
    }

    setCreating(true);
    try {
      const formattedTime = startTime.length === 5 ? `${startTime}:00` : startTime;
      await scheduleApi.create({
        doctorId: user.id,
        date,
        startTime: formattedTime,
        maxCount: Number(maxCount),
      });
      setDate('');
      setStartTime('');
      setMaxCount('');
      setShowForm(false);
      toast.success('Schedule created.');
      loadSchedules();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const slotsPercent = (s) => Math.round((s.bookedCount / s.maxCount) * 100);

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>My Schedules</h1>
            <p>Manage your appointment slots and availability</p>
          </div>
        </div>
        <SkeletonStats count={2} />
        <SkeletonCards count={4} />
      </div>
    );
  }

  const totalSlots = schedules.reduce((sum, s) => sum + s.maxCount, 0);
  const bookedSlots = schedules.reduce((sum, s) => sum + s.bookedCount, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Schedules</h1>
          <p>Manage your appointment slots and availability</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + New Schedule
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Icon name="calendar" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Active Schedules</div>
            <div className="stat-value"><CountUp value={schedules.length} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}><Icon name="users" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Total Bookings</div>
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
            <label htmlFor="sched-date">Date</label>
            <input
              id="sched-date"
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="sched-time">Start Time</label>
            <input
              id="sched-time"
              type="time"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="sched-max">Max Patients</label>
            <input
              id="sched-max"
              type="number"
              min="1"
              className="form-control"
              placeholder="e.g. 10"
              value={maxCount}
              onChange={(e) => setMaxCount(e.target.value)}
            />
          </div>
        </form>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          <button type="submit" form="createScheduleForm" className="btn btn-primary" disabled={creating}>
            {creating && <span className="btn-spinner" aria-hidden="true" />}
            {creating ? 'Creating…' : 'Create Schedule'}
          </button>
        </div>
      </Modal>

      {schedules.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="calendar" size={40} /></div>
          <p>You haven't created any schedules yet.</p>
        </div>
      ) : (
        <div className="card-grid">
          {schedules.map((s, i) => {
            const pct = slotsPercent(s);
            const remaining = s.maxCount - s.bookedCount;
            return (
              <div className="card" key={s.id} style={{ animationDelay: `${i * 40}ms` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="card-title">{s.date}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.id}</span>
                </div>
                <div className="card-meta">
                  <span className="card-meta-item"><Icon name="clock" size={14} /> {s.startTime}</span>
                  <span className="card-meta-item"><Icon name="users" size={14} /> {s.bookedCount}/{s.maxCount} booked</span>
                </div>

                <div className="slots-bar" style={{ marginTop: '1rem' }}>
                  <div
                    className="slots-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: pct >= 90 ? 'var(--danger)' : pct >= 60 ? 'var(--warning)' : 'var(--primary)',
                    }}
                  />
                </div>
                <div className="slots-text">
                  {remaining} slots remaining
                </div>

                <div className="card-actions" style={{ marginTop: '1.25rem' }}>
                  <button
                    className="btn btn-danger btn-sm btn-block"
                    disabled={deletingId === s.id}
                    onClick={() => handleDelete(s.id)}
                  >
                    {deletingId === s.id && <span className="btn-spinner" aria-hidden="true" />}
                    {deletingId === s.id ? 'Deleting…' : 'Delete Schedule'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
