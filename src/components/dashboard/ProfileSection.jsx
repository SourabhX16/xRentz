import { useApp } from '../../context/AppContext';

export default function ProfileSection({ user, onUpdate }) {
  const { updateUser } = useApp();

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

      <div className="profile-section" style={{ marginTop: '32px' }}>
        <h3 className="profile-section__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔐</span> Trust & Identity Verification
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--color-neutral-600)', marginBottom: '16px' }}>
          Upload your Aadhaar, Passport, or Driver's License to become a Verified Guest. This grants you access to instant bookings.
        </p>
        
        {user.isVerified ? (
          <div style={{ background: 'var(--color-success-50)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-success-200)', marginTop: '24px' }}>
            <h4 style={{ color: 'var(--color-success-700)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>✅ Identity Verified</h4>
            <p style={{ fontSize: '13px', color: 'var(--color-success-800)', margin: 0 }}>Your identity has been verified by the xRentz Trust & Safety team. You are now eligible to book properties online!</p>
          </div>
        ) : (
          <>
            <div className="owner-form__upload-zone" style={{ border: '2px dashed var(--color-success-400)', background: 'var(--color-success-50)' }}>
              <input type="file" id="id-upload" accept="image/*,.pdf" className="owner-form__file-input" />
              <label htmlFor="id-upload" className="owner-form__upload-label">
                <span className="upload-icon">🆔</span>
                <span>Click to upload Official ID Document</span>
                <small>JPG, PNG, PDF up to 5MB</small>
              </label>
            </div>

            <div className="form-group" style={{ marginTop: '24px' }}>
              <label className="form-label" style={{ color: 'var(--color-error-600)' }}>🚨 Emergency Contact</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input type="text" className="form-input" placeholder="Contact Name" />
                <input type="tel" className="form-input" placeholder="Phone Number" />
              </div>
            </div>
            
            <button 
              className="btn btn--secondary btn--md" 
              style={{ marginTop: '24px' }} 
              onClick={() => {
                updateUser({ isVerified: true });
                onUpdate('Verification documents securely processed and approved!', 'success');
              }}
            >
              Submit Verification
            </button>
          </>
        )}
      </div>
    </div>
  );
}
