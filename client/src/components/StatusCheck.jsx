import { useState } from 'react';

export default function StatusCheck() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch(`/api/appointments/${phone}`);
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

  return (
    <section id="check-status" className="section bg-light rounded-xl">
      <div className="section-header">
        <h2>Check Appointment Status</h2>
        <p>Enter your phone number to see your appointments.</p>
      </div>

      <div className="card status-card mx-auto">
        <form onSubmit={handleFetch} className="form flex-row">
          <div className="form-group flex-grow">
            <input 
              type="tel" 
              placeholder="Your Phone Number" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary">Fetch</button>
        </form>

        <div className="results-container">
          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-muted" style={{ color: 'var(--status-cancelled) !important', marginTop: '1rem' }}>{error}</p>}
          
          {results && results.length === 0 && (
            <p className="text-center text-muted" style={{ marginTop: '1rem' }}>No appointments found for this phone number.</p>
          )}

          {results && results.length > 0 && results.map(app => (
            <div key={app.id} className="result-item">
              <div className="result-info">
                <h4>Dr. Consultation - {app.patientName}</h4>
                <p>📅 {app.date} | ⏰ {app.time}</p>
              </div>
              <div>
                <span className={`status-badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
