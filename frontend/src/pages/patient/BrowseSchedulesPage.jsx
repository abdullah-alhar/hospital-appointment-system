import { useState, useEffect } from 'react';
import { scheduleApi, appointmentApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { SkeletonStats, SkeletonCards } from '../../components/Skeleton';
import CountUp from '../../components/CountUp';
import Icon from '../../components/Icon';

export default function BrowseSchedulesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState(null); // schedule being booked

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await scheduleApi.getAll();
      setSchedules(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (scheduleId) => {
    setBookingId(scheduleId);
    try {
      const appt = await appointmentApi.create({
        patientId: user.id,
        scheduleId,
      });
      toast.success(`Appointment confirmed — you're #${appt.queueNumber} in the queue.`);
      loadSchedules(); // refresh slot counts
    } catch (err) {
      toast.error(`Booking failed: ${err.message}`);
    } finally {
      setBookingId(null);
    }
  };

  const slotsRemaining = (s) => s.maxCount - s.bookedCount;
  const slotsPercent = (s) => Math.round((s.bookedCount / s.maxCount) * 100);

  const slotColor = (s) => {
    const pct = slotsPercent(s);
    if (pct >= 90) return 'var(--danger)';
    if (pct >= 60) return 'var(--warning)';
    return 'var(--primary)';
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Find a Doctor</h1>
            <p>Browse available schedules and book your appointment instantly</p>
          </div>
        </div>
        <SkeletonStats count={1} />
        <SkeletonCards count={6} />
      </div>
    );
  }

  // Calculate simple stats
  const availableSchedules = schedules.filter(s => s.bookedCount < s.maxCount).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Find a Doctor</h1>
          <p>Browse available schedules and book your appointment instantly</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Icon name="search" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Available Slots</div>
            <div className="stat-value">
              <CountUp value={availableSchedules} /> <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {schedules.length}</span>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {schedules.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="calendar" size={40} /></div>
          <p>No schedules available right now. Check back later!</p>
        </div>
      ) : (
        <div className="card-grid">
          {schedules.map((s, i) => (
            <div className="card" key={s.id} style={{ display: 'flex', flexDirection: 'column', animationDelay: `${i * 40}ms` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="table-avatar doctor" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                  {s.doctor?.username?.charAt(0).toUpperCase() || 'D'}
                </div>
                <div>
                  <div className="card-title" style={{ marginBottom: 0 }}>
                    Dr. {s.doctor?.username || 'Unknown'}
                  </div>
                  <span style={{ 
                    display: 'inline-block', padding: '0.15rem 0.5rem', 
                    borderRadius: '50px', background: 'var(--primary-soft)', color: 'var(--primary)', 
                    fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.25rem'
                  }}>
                    {s.doctor?.specialization || 'General'}
                  </span>
                </div>
              </div>
              
              <div className="card-meta" style={{ flex: 1 }}>
                <span className="card-meta-item"><Icon name="calendar" size={14} /> {s.date}</span>
                <span className="card-meta-item"><Icon name="clock" size={14} /> {s.startTime}</span>
              </div>

              <div className="slots-bar" style={{ marginTop: '1rem' }}>
                <div
                  className="slots-bar-fill"
                  style={{
                    width: `${slotsPercent(s)}%`,
                    background: slotColor(s),
                  }}
                />
              </div>
              <div className="slots-text">
                {slotsRemaining(s)} of {s.maxCount} slots remaining
              </div>

              <div className="card-actions" style={{ marginTop: '1.25rem' }}>
                <button
                  className="btn btn-primary btn-block"
                  disabled={slotsRemaining(s) <= 0 || bookingId === s.id}
                  onClick={() => handleBook(s.id)}
                >
                  {bookingId === s.id && <span className="btn-spinner" aria-hidden="true" />}
                  {bookingId === s.id
                    ? 'Booking…'
                    : slotsRemaining(s) <= 0
                      ? 'Fully Booked'
                      : 'Book Appointment'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
