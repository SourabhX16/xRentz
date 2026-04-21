export default function ProfileSection({ user, onUpdate }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate('Profile updated!', 'success');
  };

  return (
    <div className="dashboard-profile">
      <div className="profile-section">
        <h3 className="profile-section__title">Personal Info</h3>
        <form className="profile-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" defaultValue={user.name} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" defaultValue={user.email} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input type="tel" className="form-input" placeholder="+1 (555) 123-4567" />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" className="form-input" placeholder="City, Country" />
          </div>
          <button type="submit" className="btn btn--primary btn--md" style={{ marginTop: 'var(--space-6)', gridColumn: '1 / -1' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
