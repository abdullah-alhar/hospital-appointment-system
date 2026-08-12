import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import Reveal from '../components/Reveal';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();

  const dashboardPath =
    user?.role === 'PATIENT' ? '/patient/schedules' :
      user?.role === 'DOCTOR' ? '/doctor/schedules' :
        user?.role === 'ADMIN' ? '/admin/patients' :
          null;

  return (
    <div className="landing">
      {/* ─── Navbar ───────────────────────────────────── */}
      <nav className="lp-nav">
        <div className="lp-container">
          <Link to="/" className="lp-nav-brand">
            <span className="lp-nav-cross" aria-hidden="true"><Icon name="cross" size={16} /></span>
            <span className="lp-nav-wordmark">MedBook</span>
          </Link>

          <div className="lp-nav-actions">
            {user && (
              <Link to={dashboardPath} className="lp-btn-book">Go to Dashboard →</Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-container lp-hero-inner">
          <div className="lp-hero-text">
            <h1>Skip the<br />waiting room.</h1>
            <p>
              Find a doctor by specialization, pick an open time slot,
              and get your queue number — all in under a minute.
            </p>
            <div className="lp-hero-actions">
              {user ? (
                <Link to={dashboardPath} className="lp-btn-book">
                  Go to Dashboard →
                </Link>
              ) : (
                <Link to="/register" className="lp-btn-book">
                  Get Started →
                </Link>
              )}
            </div>
          </div>

          {/* ── Queue Ticket (signature element) ──────── */}
          <div className="lp-hero-visual">
            <div className="ticket" aria-hidden="true">
              <div className="ticket-header">
                <div className="ticket-brand">
                  <span className="ticket-brand-cross"><Icon name="cross" size={13} /></span>
                  MEDBOOK
                </div>
                <span className="ticket-id">#A042</span>
              </div>

              <div className="ticket-body">
                <div className="ticket-doctor">Dr. Sarah Chen</div>
                <div className="ticket-specialty">Cardiology</div>

                <div className="ticket-details">
                  <div>
                    <span className="ticket-detail-label">Date</span>
                    <span className="ticket-detail-value">12 Aug 2026</span>
                  </div>
                  <div>
                    <span className="ticket-detail-label">Time</span>
                    <span className="ticket-detail-value">09:30</span>
                  </div>
                </div>

                <div className="ticket-patient">
                  <span>Abdullah Alhar</span>
                  <span className="ticket-patient-id">P001</span>
                </div>

                <div className="ticket-status">
                  <span className="ticket-status-dot"></span>
                  Confirmed
                </div>
              </div>

              <div className="ticket-perforation"></div>

              <div className="ticket-queue">
                <span className="ticket-queue-label">Queue Number</span>
                <span className="ticket-queue-number">27</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────── */}
      <section className="lp-steps">
        <div className="lp-container">
          <div style={{ textAlign: 'center' }}>
            <div className="lp-section-label">How it works</div>
            <h2 className="lp-section-title">Three steps to your appointment</h2>
          </div>

          <div className="lp-steps-list">
            <Reveal as="div" className="lp-step" delay={0}>
              <div className="lp-step-number">01</div>
              <h3>Browse doctors</h3>
              <p>Search by specialization and view available schedule slots.</p>
            </Reveal>

            <div className="lp-step-connector" aria-hidden="true"></div>

            <Reveal as="div" className="lp-step" delay={120}>
              <div className="lp-step-number">02</div>
              <h3>Pick a slot</h3>
              <p>Choose a date and time that works for you from open slots.</p>
            </Reveal>

            <div className="lp-step-connector" aria-hidden="true"></div>

            <Reveal as="div" className="lp-step" delay={240}>
              <div className="lp-step-number">03</div>
              <h3>Get your number</h3>
              <p>Receive your queue position instantly. Show up and walk in.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Stats / Trust Section ─────────────────────── */}
      <section className="lp-trust">
        <div className="lp-container">
          <div className="lp-trust-grid">
            <Reveal as="div" className="lp-trust-item" delay={0}>
              <div className="lp-trust-number">500+</div>
              <div className="lp-trust-label">Appointments Booked</div>
            </Reveal>
            <Reveal as="div" className="lp-trust-item" delay={80}>
              <div className="lp-trust-number">50+</div>
              <div className="lp-trust-label">Verified Doctors</div>
            </Reveal>
            <Reveal as="div" className="lp-trust-item" delay={160}>
              <div className="lp-trust-number">15+</div>
              <div className="lp-trust-label">Specializations</div>
            </Reveal>
            <Reveal as="div" className="lp-trust-item" delay={240}>
              <div className="lp-trust-number">24/7</div>
              <div className="lp-trust-label">Online Booking</div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-brand">
            <span className="lp-nav-cross" aria-hidden="true"><Icon name="cross" size={16} /></span>
            MedBook
          </div>
          <span className="lp-footer-note">University Project · 2026</span>
        </div>
      </footer>
    </div>
  );
}
