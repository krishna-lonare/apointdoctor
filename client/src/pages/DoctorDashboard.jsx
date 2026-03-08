// --- Replaced imports ---
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch appointments');
      
      setAppointments(data.appointments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this appointment as ${newStatus}?`)) return;

    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      fetchAppointments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredAppointments = filter === 'All' 
    ? appointments 
    : appointments.filter(app => app.status === filter);

  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="logo">
            <span className="icon">⚕️</span> ApointDoctor <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal', marginLeft: '0.5rem' }}>| Dashboard</span>
          </Link>
          <ul className="nav-links">
            <li><button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>Logout</button></li>
          </ul>
        </div>
      </nav>

      <main style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Appointments</h1>
            <p className="text-muted">Manage all incoming bookings.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>Filter:</span>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'white', fontFamily: 'inherit' }}
            >
              <option value="All">All Appointments</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button onClick={fetchAppointments} className="btn btn-secondary btn-sm">Refresh</button>
          </div>
        </div>

        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Date / Time</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan="6" className="text-center">Loading appointments...</td></tr>}
                {error && <tr><td colSpan="6" className="text-center" style={{ color: 'var(--status-cancelled)' }}>{error}</td></tr>}
                {!loading && !error && filteredAppointments.length === 0 && (
                  <tr><td colSpan="6" className="text-center text-muted">No appointments found.</td></tr>
                )}
                {!loading && !error && filteredAppointments.map(app => (
                  <tr key={app.id}>
                    <td><strong>{app.patientName}</strong></td>
                    <td>{app.patientPhone}</td>
                    <td><span style={{ whiteSpace: 'nowrap' }}>{app.date}</span><br/><span className="text-muted" style={{ fontSize: '0.85rem' }}>{app.time}</span></td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={app.symptoms}>{app.symptoms || '-'}</td>
                    <td><span className={`status-badge badge-${app.status.toLowerCase()}`}>{app.status}</span></td>
                    <td>
                      <div className="action-btns" style={{ display: 'flex', gap: '0.5rem' }}>
                        {app.status === 'Pending' && (
                          <>
                            <button onClick={() => handleStatusChange(app.id, 'Confirmed')} className="btn btn-sm btn-success" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Confirm</button>
                            <button onClick={() => handleStatusChange(app.id, 'Cancelled')} className="btn btn-sm btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Cancel</button>
                          </>
                        )}
                        {app.status === 'Confirmed' && (
                          <button onClick={() => handleStatusChange(app.id, 'Cancelled')} className="btn btn-sm btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Cancel</button>
                        )}
                        {app.status === 'Cancelled' && (
                          <span className="text-muted" style={{ fontSize: '0.85rem' }}>None</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
