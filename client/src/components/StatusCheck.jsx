import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function StatusCheck() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFetch = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/appointments/me`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch appointments');
      }

      setResults(result.appointments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      handleFetch();
    }
  }, [user]);

  return (
    <section id="check-status" className="section bg-light rounded-xl">
      <div className="section-header">
        <h2>Your Appointments</h2>
        <p>View the status of your upcoming consultations.</p>
      </div>

      <div className="card status-card mx-auto">
        {!user ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>Log in to view your appointments.</p>
            <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
          </div>
        ) : (
          <div className="results-container">
            {loading && <p className="text-center">Loading appointments...</p>}
            {error && <p className="text-center text-muted" style={{ color: 'var(--status-cancelled) !important', marginTop: '1rem' }}>{error}</p>}
            
            {!loading && results && results.length === 0 && (
              <p className="text-center text-muted" style={{ marginTop: '1rem' }}>You have no appointments booked yet.</p>
            )}

            {!loading && results && results.length > 0 && results.map(app => (
              <div key={app._id} className="result-item" style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                <div className="result-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>Dr. Consultation - {app.patientName}</h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>📅 {app.date} | ⏰ {app.time}</p>
                  </div>
                  <span className={`status-badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
