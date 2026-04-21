import './Support.css';

export default function Comparison() {
  const features = [
    { name: 'AI Search (Vibe Engine)', xrentz: '✅ Advanced (Gemini)', airbnb: '❌ Basic Filters', vrbo: '❌ None', booking: '❌ None' },
    { name: 'Smart Visit Planner', xrentz: '✅ Auto-Generated', airbnb: '⚠️ Partially Manual', vrbo: '❌ Manual', booking: '❌ None' },
    { name: 'UI / Design', xrentz: '✅ Glassmorphic', airbnb: '⚠️ Standard', vrbo: '❌ Outdated', booking: '❌ Cluttered' },
    { name: 'Multi-Language Sync', xrentz: '✅ 100% (5 Languages)', airbnb: '⚠️ Basic', vrbo: '⚠️ Manual', booking: '✅ Robust' },
    { name: 'Concierge Assistant', xrentz: '✅ AI Live Guru', airbnb: '❌ Standard Support', vrbo: '❌ Call center', booking: '❌ Call center' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="support-page animate-fade-in" style={{ background: '#fff' }}>
      <div className="support-container container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }} className="no-print">
          <button className="btn btn--outline btn--sm" onClick={() => window.history.back()}>← Back</button>
          <button className="btn btn--primary btn--md" onClick={handlePrint}>🖨️ Download as PDF</button>
        </div>

        <header className="support-header">
          <h1 style={{ color: 'var(--color-primary-600)' }}>Official Market Comparison Report</h1>
          <p>Analyzing xRentz vs. Global Competitors (2026)</p>
        </header>

        <div className="support-card" style={{ border: 'none', boxShadow: 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ background: 'var(--color-neutral-50)', textAlign: 'left' }}>
                <th style={{ padding: '15px', borderBottom: '2px solid var(--color-neutral-200)' }}>Feature</th>
                <th style={{ padding: '15px', borderBottom: '2px solid var(--color-primary-500)', color: 'var(--color-primary-600)' }}>xRentz</th>
                <th style={{ padding: '15px', borderBottom: '2px solid var(--color-neutral-200)' }}>Airbnb</th>
                <th style={{ padding: '15px', borderBottom: '2px solid var(--color-neutral-200)' }}>Vrbo</th>
                <th style={{ padding: '15px', borderBottom: '2px solid var(--color-neutral-200)' }}>Booking</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i}>
                  <td style={{ padding: '15px', borderBottom: '1px solid var(--color-neutral-100)', fontWeight: 'bold' }}>{f.name}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid var(--color-neutral-100)', color: 'var(--color-primary-600)' }}>{f.xrentz}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid var(--color-neutral-100)' }}>{f.airbnb}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid var(--color-neutral-100)' }}>{f.vrbo}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid var(--color-neutral-100)' }}>{f.booking}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '50px' }}>
            <h3>Executive Analysis</h3>
            <p style={{ lineHeight: '1.8' }}>
              Comparing xRentz to traditional platforms reveals a significant technology gap. While competitors focus on transaction volume, 
              <strong> xRentz focuses on the User Experience lifecycle.</strong> From "Vibe-based" discovery to the auto-generated 
              visit planner, xRentz solves modern traveler anxiety in ways that legacy systems cannot match.
            </p>
          </div>

          <div style={{ marginTop: '30px', padding: '20px', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>
              © 2026 xRentz Global Intelligence. This report is auto-generated for business assessment purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
