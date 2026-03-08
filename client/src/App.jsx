import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import DoctorDashboard from './pages/DoctorDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

// Protected Route Component for Doctor
const DoctorRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'doctor') return <Navigate to="/login" />;
  return children;
};

// Protected Route Component for generic users (needed if Home expects login, but Home might be public)
// We'll leave Home public for now or protect it specifically if needed.

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor" element={
            <DoctorRoute>
              <DoctorDashboard />
            </DoctorRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
