import './Support.css';

export default function HelpCenter() {
  const categories = [
    { icon: '🏠', title: 'Booking & Stays', desc: 'How to book, check-in, and manage your trips.' },
    { icon: '💳', title: 'Payments & Refunds', desc: 'Pricing, taxes, and how refunds work.' },
    { icon: '🔒', title: 'Safety & Security', desc: 'Identity verification and property rules.' },
    { icon: '📢', title: 'Hosting on xRentz', desc: 'How to list, manage, and earn as a host.' }
  ];

  return (
    <div className="support-page animate-fade-in">
      <div className="support-container container">
        <header className="support-header">
          <h1>Help Center</h1>
          <p>Everything you need to know about using xRentz.</p>
        </header>

        <div className="support-card">
          <div className="support-search" style={{ marginBottom: '40px' }}>
             <input 
              type="text" 
              placeholder="Search help articles..." 
              className="form-input" 
              style={{ width: '100%', height: '56px', fontSize: '1.1rem' }}
             />
          </div>

          <h3>Common Topics</h3>
          <div className="help-grid">
            {categories.map((cat, i) => (
              <div key={i} className="help-category">
                <div className="help-category__icon">{cat.icon}</div>
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
