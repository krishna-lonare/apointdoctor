import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <span className="icon">⚕️</span> ApointDoctor
        </Link>
        <ul className="nav-links">
          <li><a href="/#hero">Home</a></li>
          <li><a href="/#check-status">Check Status</a></li>
          {user ? (
            <>
              <li><span style={{ fontWeight: 'bold', marginRight: '1rem' }}>Hi, {user.name}</span></li>
              {user.role === 'doctor' && <li><Link to="/doctor" className="btn btn-outline" style={{ marginRight: '0.5rem' }}>Dashboard</Link></li>}
              <li><button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn btn-outline">Login</Link></li>
              <li><Link to="/register" className="btn btn-primary" style={{ marginLeft: '10px' }}>Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
