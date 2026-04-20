import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AiAgent from './components/AiAgent';
import MembershipWidget from './components/MembershipWidget';
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import Booking from './pages/Booking';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
      <AiAgent />
      <MembershipWidget />
    </div>
  );
}
