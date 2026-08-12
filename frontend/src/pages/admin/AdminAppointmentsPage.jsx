import { useState, useEffect } from 'react';
import { appointmentApi, patientApi, doctorApi, scheduleApi } from '../../api';
import { useToast } from '../../components/Toast';
import { SkeletonStats, SkeletonTable } from '../../components/Skeleton';
import CountUp from '../../components/CountUp';
import Modal from '../../components/Modal';
import Icon from '../../components/Icon';

export default function AdminAppointmentsPage() {
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  
  // Booking Form State
  const [showForm, setShowForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [booking, setBooking] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    load();
    loadFormDependencies();
  }, []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setAppointments(await appointmentApi.getAll());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFormDependencies = async () => {
    try {
      const [pts, docs] = await Promise.all([
        patientApi.getAll(),
        doctorApi.getAll()
      ]);
      setPatients(pts);
      setDoctors(docs);
    } catch (err) {
      console.error("Failed to load dependency data for booking form", err);
    }
  };

  // When doctor is selected, fetch their schedules
  useEffect(() => {
    if (!selectedDoctorId) {
      setSchedules([]);
      setSelectedScheduleId('');
      return;
    }
    const loadDoctorSchedules = async () => {
      try {
        const schs = await scheduleApi.getByDoctor(selectedDoctorId);
        setSchedules(schs);
        setSelectedScheduleId('');
      } catch (err) {
        setFormError('Failed to load schedules for doctor');
      }
    };
    loadDoctorSchedules();
  }, [selectedDoctorId]);

  const handleBook = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!selectedPatientId || !selectedScheduleId) {
      setFormError('Please select both a patient and a schedule.');
      return;
    }
    setBooking(true);
    try {
      await appointmentApi.create({
        patientId: selectedPatientId,
        scheduleId: selectedScheduleId
      });
      setSelectedPatientId('');
      setSelectedDoctorId('');
      setSelectedScheduleId('');
      setShowForm(false);
      toast.success('Appointment booked.');
      load();
    } catch (err) {
      setFormError(err.message || 'Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    setCancellingId(id);
    try {
      await appointmentApi.cancel(id);
      toast.success('Appointment cancelled.');
      load();
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
            <h1>Appointments</h1>
            <p>Manage patient appointments</p>
          </div>
        </div>
        <SkeletonStats count={2} />
        <SkeletonTable rows={6} columns={5} />
      </div>
    );
  }

  // Calculate simple stats
  const pending = appointments.filter(a => a.status === 'PENDING').length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Appointments</h1>
          <p>Manage patient appointments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Book Appointment
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}><Icon name="clipboard" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Total Bookings</div>
            <div className="stat-value"><CountUp value={appointments.length} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><Icon name="hourglass" size={22} /></div>
          <div className="stat-content">
            <div className="stat-label">Pending Status</div>
            <div className="stat-value"><CountUp value={pending} /></div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title="Book Appointment"
      >
        {formError && <div className="alert alert-error">{formError}</div>}
        
        <form id="bookAptForm" onSubmit={handleBook}>
          <div className="form-group">
            <label htmlFor="book-patient">Patient</label>
            <select
              id="book-patient"
              className="form-control"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.username} ({p.id})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="book-doctor">Doctor</label>
            <select
              id="book-doctor"
              className="form-control"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>Dr. {d.username} - {d.specialization}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="book-schedule">Schedule Slot</label>
            <select
              id="book-schedule"
              className="form-control"
              value={selectedScheduleId}
              onChange={(e) => setSelectedScheduleId(e.target.value)}
              disabled={!selectedDoctorId || schedules.length === 0}
            >
              <option value="">{schedules.length === 0 ? (selectedDoctorId ? 'No schedules available' : 'Select a doctor first') : 'Select Schedule'}</option>
              {schedules.map(s => (
                <option key={s.id} value={s.id}>
                  {s.date} at {s.startTime} ({s.bookedCount}/{s.maxCount} booked)
                </option>
              ))}
            </select>
          </div>
        </form>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          <button type="submit" form="bookAptForm" className="btn btn-primary" disabled={booking}>
            {booking && <span className="btn-spinner" aria-hidden="true" />}
            {booking ? 'Booking…' : 'Confirm Booking'}
          </button>
        </div>
      </Modal>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="clipboard" size={40} /></div>
          <p>No appointments found.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper" style={{ margin: 0, border: 'none' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Patient</th>
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
                        <div className="table-avatar patient">
                          {a.patient?.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="table-user-info">
                          <span className="table-user-name">{a.patient?.username || '—'}</span>
                          <span className="table-user-sub mono">{a.patient?.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-user-cell">
                        <div className="table-avatar doctor">
                          {a.doctorSchedule?.doctor?.username?.charAt(0).toUpperCase() || '?'}
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
