import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <span className="icon">⚕️</span> ApointDoctor
        </Link>
        <ul className="nav-links">
          <li><a href="/#hero">Home</a></li>
          <li><a href="/#book">Book Appointment</a></li>
          <li><a href="/#check-status">Check Status</a></li>
          <li><Link to="/doctor" className="btn btn-outline">Doctor Login</Link></li>
        </ul>
      </div>
    </nav>
  );
}
