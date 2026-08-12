import { useState, useEffect } from 'react';
import { appointmentApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { SkeletonStats, SkeletonTable } from '../../components/Skeleton';
import CountUp from '../../components/CountUp';
import Icon from '../../components/Icon';

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const all = await appointmentApi.getAll();
      // Filter client-side to only this patient's appointments
      const mine = all.filter((a) => a.patient?.id === user.id);
      setAppointments(mine);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    setCancellingId(id);
    try {
      await appointmentApi.cancel(id);
      toast.success('Appointment cancelled.');
      loadAppointments();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const badgeClass = (status) => `badge badge-${status?.toLowerCase() || 'pending'}`;

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1>My Appointments</h1>
            <p>View and manage your booked appointments</p>
          </div>
        </div>
        <SkeletonStats count={2} />
        <SkeletonTable rows={4} columns={5} />
      </div>
    );
  }

  const upcoming = appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Appointments</h1>
          <p>View and manage your booked appointments</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}><Icon name="clipboard" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Total Appointments</div>
            <div className="stat-value"><CountUp value={appointments.length} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7' }}><Icon name="hourglass" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Upcoming</div>
            <div className="stat-value"><CountUp value={upcoming} /></div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="clipboard" size={40} /></div>
          <p>You haven't booked any appointments yet.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper" style={{ margin: 0, border: 'none' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Queue #</th>
                  <th style={{ textAlign: 'right' }}>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="table-user-cell">
                        <div className="table-avatar doctor">
                          {a.doctorSchedule?.doctor?.username?.charAt(0).toUpperCase() || 'D'}
                        </div>
                        <div className="table-user-info">
                          <span className="table-user-name">Dr. {a.doctorSchedule?.doctor?.username || '—'}</span>
                          <span className="table-user-sub">{a.doctorSchedule?.doctor?.specialization || 'Doctor'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.doctorSchedule?.date || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{a.doctorSchedule?.startTime || '—'}</div>
                    </td>
                    <td>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '28px', height: '28px', background: 'var(--surface-hover)', 
                        borderRadius: '50%', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text)'
                      }}>{a.queueNumber}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={badgeClass(a.status)}>{a.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                        <button
                          className="btn-icon danger"
                          disabled={cancellingId === a.id}
                          onClick={() => handleCancel(a.id)}
                          title="Cancel Appointment"
                        >
                          <Icon name="xCircle" size={16} />
                        </button>
                      )}
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
