import './Support.css';

export default function Comparison() {
  const comparisonData = [
    { 
      category: 'Intelligence & Discovery',
      feature: 'Vibe-Based AI Search',
      xrentz: '✅ Advanced Gemini Pro Integration',
      airbnb: '❌ Traditional Filters only',
      others: '❌ Keyword search only'
    },
    { 
      category: 'Intelligence & Discovery',
      feature: 'Personalized Concierge',
      xrentz: '✅ Live AI "Guru" (24/7)',
      airbnb: '❌ Standard Help Center',
      others: '❌ Basic FAQ bots'
    },
    { 
      category: 'Guest Lifecycle',
      feature: 'Post-Booking Visit Planner',
      xrentz: '✅ Automatic Smart Itinerary',
      airbnb: '⚠️ Simple Reservation view',
      others: '❌ Text emails only'
    },
    { 
      category: 'Guest Lifecycle',
      feature: 'Local Vibe Insights',
      xrentz: '✅ GPS-based Food/Mood curation',
      airbnb: '❌ Host guidebooks (manual)',
      others: '❌ Generic suggestions'
    },
    { 
      category: 'Technology',
      feature: 'Real-time Localization',
      xrentz: '✅ Zero-Refresh Currency/Lang',
      airbnb: '⚠️ Page-Reload required',
      others: '⚠️ Basic Geo-IP'
    },
    { 
      category: 'Technology',
      feature: 'Performance (Load Time)',
      xrentz: '⚡ < 1.2s (Vite Optimized)',
      airbnb: '🐢 2.5s - 4s (Heavy SSR)',
      others: '🐢 3s+'
    },
    { 
      category: 'Design & UX',
      feature: 'Modern Aesthetics',
      xrentz: '💎 Spatial Glassmorphic UI',
      airbnb: '🏠 Clean but generic',
      others: '📉 Outdated / Functional'
    },
    { 
      category: 'Trust & Safety',
      feature: 'Digital Resident Pass',
      xrentz: '✅ Unified Identity Verification',
      airbnb: '✅ Good',
      others: '⚠️ Varying'
    }
  ];

  const handlePrint = () => window.print();

  return (
    <div className="support-page animate-fade-in" style={{ background: '#f8fafc', color: '#1e293b' }}>
      <div className="support-container container" style={{ maxWidth: '1100px' }}>
        
        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }} className="no-print">
          <button className="btn btn--outline btn--sm" onClick={() => window.history.back()}>← Back to Explore</button>
          <button className="btn btn--primary btn--md" onClick={handlePrint} style={{ boxShadow: '0 10px 20px rgba(var(--color-primary-rgb), 0.3)' }}>
            🖨️ Export Analysis PDF
          </button>
        </div>

        {/* Hero Section */}
        <header className="support-header" style={{ textAlign: 'left', borderLeft: '4px solid var(--color-primary-500)', paddingLeft: '24px', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-1px' }}>xRentz vs. Legacy Platforms</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Why world-class travelers are switching to the xRentz ecosystem.</p>
        </header>

        {/* Why xRentz Card */}
        <section style={{ background: 'var(--color-primary-600)', color: 'white', padding: '40px', borderRadius: 'var(--radius-2xl)', marginBottom: '60px', boxShadow: 'var(--shadow-2xl)' }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>🚀 Why choose xRentz?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ color: '#fff' }}>Intellectual Matching</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>We don't search keywords; our Guru AI matches your vibration and mood to the property.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ color: '#fff' }}>Effortless Travel</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Visit Planner solves the "check-in anxiety" by auto-generating every detail of your stay.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ color: '#fff' }}>Global Ready</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Seamlessly transition between 5 languages and 4 global currencies with zero latency.</p>
            </div>
          </div>
        </section>

        {/* Mega Table */}
        <div className="support-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fff', textAlign: 'left' }}>
                  <th style={{ padding: '24px', borderBottom: '2px solid #f1f5f9' }}>Feature Domain</th>
                  <th style={{ padding: '24px', borderBottom: '2px solid #f1f5f9' }}>Market Standard</th>
                  <th style={{ padding: '24px', borderBottom: '2px solid var(--color-primary-500)', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)' }}>
                    👑 xRentz Excellence
                  </th>
                  <th style={{ padding: '24px', borderBottom: '2px solid #f1f5f9' }}>Airbnb / Vrbo</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fcfdfe' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '4px' }}>{item.category}</span>
                      <span style={{ fontWeight: '700' }}>{item.feature}</span>
                    </td>
                    <td style={{ padding: '20px 24px', color: '#64748b' }}>Industry Avg.</td>
                    <td style={{ padding: '20px 24px', background: 'rgba(var(--color-primary-rgb), 0.02)', fontWeight: '600' }}>{item.xrentz}</td>
                    <td style={{ padding: '20px 24px', opacity: 0.7 }}>{item.airbnb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Statement */}
        <footer style={{ marginTop: '60px', textAlign: 'center', padding: '40px 0', borderTop: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '10px' }}>The Verdict</h3>
          <p style={{ maxWidth: '700px', margin: '0 auto', opacity: 0.8, lineHeight: '1.8' }}>
            xRentz is not just an alternative to Airbnb; it is the **evolution of the marketplace**. By removing search friction and automating post-booking complexity, we allow travelers to focus on what matters: **the journey itself.**
          </p>
          <div style={{ marginTop: '30px' }}>
             <button className="btn btn--primary btn--lg" onClick={() => window.history.back()}>Join the Evolution Now</button>
          </div>
        </footer>

      </div>
    </div>
  );
}
