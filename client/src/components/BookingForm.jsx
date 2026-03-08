import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    symptoms: ''
  });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });

    if (!user) {
      setMsg({ text: 'You must be logged in to book an appointment.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setMsg({ text: "Appointment booked successfully! We will see you soon.", type: 'success' });
      setFormData({ date: '', time: '', symptoms: '' });
    } catch (error) {
      setMsg({ text: error.message, type: 'error' });
    }
  };

  return (
    <section id="book" className="section">
      <div className="section-header">
        <h2>Book an Appointment</h2>
        <p>Fill out the form below to schedule your visit.</p>
      </div>
      
      <div className="card booking-card">
        {!user ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Log in to book an appointment</h3>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>You must have an account to schedule a visit.</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form">
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name</label>
                <input type="text" value={user.name} disabled style={{ backgroundColor: '#e9ecef', color: '#6c757d' }} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={user.phone} disabled style={{ backgroundColor: '#e9ecef', color: '#6c757d' }} />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Preferred Date</label>
                <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="time">Preferred Time</label>
                <select id="time" name="time" value={formData.time} onChange={handleChange} required>
                  <option value="" disabled>Select a time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="symptoms">Symptoms / Reason for Visit</label>
              <textarea id="symptoms" name="symptoms" rows="3" placeholder="Briefly describe your symptoms..." value={formData.symptoms} onChange={handleChange}></textarea>
            </div>

            {msg.text && (
              <div className={`form-message ${msg.type}`} style={{ display: 'block' }}>
                {msg.text}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block">Confirm Booking</button>
          </form>
        )}
      </div>
    </section>
  );
}
