import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login'; // ← this line
import Register from './pages/Register'; // ← this line
import Dashboard from './pages/Dashboard';
import './index.css';
import MatchDayMinus1Report from './pages/MatchDayMinus1Report';
import ProtectedRoute from './components/ProtectedRoute';
//import EmptyPage from './components/EmptyPage';
import IncidentReport from './pages/IncidentReport';
import MatchDayReport from './pages/MatchDayReport';
import MatchOverview from './pages/MatchOverview';

function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-900 tracking-tight mb-6">
          EFA Match Reports
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-12">
          Secure and structured reporting for EFA safety and security officers. Complete Match Day -1, Match Day, and Incident reports easily.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-shadow duration-300 border border-blue-100">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6">Officer Dashboard</h2>
          <p className="text-gray-600 text-lg mb-8">
            Login to create, edit drafts, and submit your reports for assigned matches.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-800 transition duration-300 shadow-md hover:shadow-lg"
          >
            Login Now
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-shadow duration-300 border border-red-100">
          <h2 className="text-2xl md:text-3xl font-bold text-red-700 mb-6">New Officer Registration</h2>
          <p className="text-gray-600 text-lg mb-8">
            Register with your EFA credentials to access the reporting system.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-700 transition duration-300 shadow-md hover:shadow-lg"
          >
            Register
          </Link>
        </div>
      </div>

      <div className="mt-16 text-center text-gray-600">
        <p className="text-lg">Confidential • Official Use Only • Eswatini Football Association</p>
      </div>
    </div>
  );
}
/* Placeholder component for future pages
function Placeholder({ title }: { title: string }) {
  return (
    <div className="text-center py-20">
      <h2 className="text-4xl font-bold text-blue-800">{title}</h2>
      <p className="mt-6 text-xl text-gray-600">We'll build this page next – stay tuned!</p>
    </div>
  );
} */

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Modern Header */}
        

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* These match the 'link' props in your Dashboard cards */}
            <Route path="/match-day-minus1" element={<MatchDayMinus1Report />} />
            <Route path="/match-day" element={<MatchDayReport />} />
            <Route path="/incident-report" element={<IncidentReport />} />
            <Route path="/match-overview" element={<MatchOverview />} />
          </Routes>
        </main>

        <footer className="bg-blue-950 text-white py-8 text-center">
          <p>© 2026 Eswatini Football Association • All rights reserved</p>
          <p className="mt-2 text-sm opacity-80">P.O. Box 641, Mbabane • Confidential Reporting System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
