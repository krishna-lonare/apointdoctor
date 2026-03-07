import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
