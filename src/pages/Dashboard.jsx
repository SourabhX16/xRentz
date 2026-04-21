import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import BookingList from '../components/dashboard/BookingList';
import FavoriteList from '../components/dashboard/FavoriteList';
import MessageList from '../components/dashboard/MessageList';
import ProfileSection from '../components/dashboard/ProfileSection';
import './Dashboard.css';

/**
 * User Dashboard Page
 * High-level orchestration of user data and tabbed navigation.
 * 
 * @page
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  const {
    user,
    bookings,
    favoriteListings,
    tabs,
    activeTab,
    setActiveTab,
    logout,
    addToast
  } = useDashboard();

  // Guard Clauses for Authentication and Role
  if (!user) return <AuthGuard />;
  if (user?.role === 'owner') return <HostGuard />;

  return (
    <main className="dashboard container">
      {/* HEADER SECTION */}
      <header className="dashboard__header animate-fade-in">
        <div className="dashboard__user">
          <div className="dashboard__avatar" aria-hidden="true">{user.avatar}</div>
          <div>
            <h1 className="dashboard__greeting">Welcome back, {user.name}!</h1>
            <p className="dashboard__email">{user.email}</p>
          </div>
        </div>
        <div className="dashboard__actions">
          <Link to="/listings" className="btn btn--secondary btn--sm">Browse Listings</Link>
          <button className="btn btn--ghost btn--sm" onClick={logout}>Log Out</button>
        </div>
      </header>

      {/* QUICK STATS */}
      <section className="dashboard__stats animate-fade-in" style={{ animationDelay: '100ms' }}>
        <StatCard value={bookings.length} label="Bookings" />
        <StatCard value={favoriteListings.length} label="Favorites" />
        <StatCard value="3" label="Messages" />
        <StatCard value="4.9" label="Rating" />
      </section>

      {/* NAVIGATION TABS */}
      <nav className="dashboard__tabs" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`dashboard__tab ${activeTab === tab.id ? 'dashboard__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            {tab.label}
            {tab.count !== null && <span className="dashboard__tab-count">{tab.count}</span>}
          </button>
        ))}
      </nav>

      {/* TAB CONTENT PANELS */}
      <section 
        className="dashboard__content animate-fade-in" 
        role="tabpanel" 
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        <TabRenderer 
          activeTab={activeTab} 
          data={{ bookings, favoriteListings, user }} 
          onUpdate={addToast} 
        />
      </section>
    </main>
  );
}

/**
 * Helper component to render the correct tab content
 */
function TabRenderer({ activeTab, data, onUpdate }) {
  switch (activeTab) {
    case 'bookings':
      return <BookingList bookings={data.bookings} />;
    case 'favorites':
      return <FavoriteList listings={data.favoriteListings} />;
    case 'messages':
      return <MessageList />;
    case 'profile':
      return <ProfileSection user={data.user} onUpdate={onUpdate} />;
    default:
      return null;
  }
}

/**
 * Reusable Stat Card sub-component
 */
function StatCard({ value, label }) {
  return (
    <div className="dash-stat">
      <span className="dash-stat__number">{value}</span>
      <span className="dash-stat__label">{label}</span>
    </div>
  );
}

/**
 * Route Guard for Unauthenticated Users
 */
function AuthGuard() {
  return (
    <div className="dashboard-empty container animate-fade-in">
      <div className="dashboard-empty__icon">🔐</div>
      <h2>Please sign in</h2>
      <p>You need to be logged in to access your dashboard.</p>
      <Link to="/auth" className="btn btn--primary btn--lg">Sign In</Link>
    </div>
  );
}

/**
 * Route Guard for Host Users in Renter Dashboard
 */
function HostGuard() {
  return (
    <div className="dashboard-empty container animate-fade-in">
      <div className="dashboard-empty__icon">🏠</div>
      <h2>You're logged in as a Host</h2>
      <p>Head to your Owner Dashboard to manage your properties.</p>
      <Link to="/owner-dashboard" className="btn btn--primary btn--lg">Go to Owner Dashboard</Link>
    </div>
  );
}
