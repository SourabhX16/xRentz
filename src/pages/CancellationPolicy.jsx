import './Support.css';

export default function CancellationPolicy() {
  return (
    <div className="support-page animate-fade-in">
      <div className="support-container container">
        <header className="support-header">
          <h1>Cancellation Policy</h1>
          <p>Transparent rules for peace of mind.</p>
        </header>

        <div className="support-card policy-content">
          <h2>Standard Policy</h2>
          <p>At xRentz, we aim to balance flexibility for guests with security for hosts. Our standard policy applies to most listings unless otherwise specified by the host.</p>
          
          <ul>
            <li><strong>Full Refund:</strong> If cancelled at least 48 hours before check-in.</li>
            <li><strong>Partial Refund (50%):</strong> If cancelled between 24 and 48 hours before check-in.</li>
            <li><strong>No Refund:</strong> If cancelled within 24 hours of check-in.</li>
          </ul>

          <h2>Host-Specific Policies</h2>
          <p>Some premium properties may have "Strict" or "Super Strict" policies. Always check the specific listing details before booking.</p>

          <h2>Extenuating Circumstances</h2>
          <p>In cases of natural disasters, government travel restrictions, or serious medical emergencies, xRentz may issue a full refund regardless of the standard policy. Please contact our support team with documentation in these cases.</p>
          
          <div style={{ marginTop: '40px', padding: '20px', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-lg)', fontSize: '0.9rem' }}>
            <strong>Note:</strong> Transaction fees from payment processors (approx 3%) may not be refundable in all regions.
          </div>
        </div>
      </div>
    </div>
  );
}
