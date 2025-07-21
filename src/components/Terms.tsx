import React from 'react';

interface TermsProps {
  onClose: () => void;
}

const Terms: React.FC<TermsProps> = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
    }}>
      <div className="card" style={{
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--md-outline-variant)',
        }}>
          <h2 style={{
            margin: 0,
            color: 'var(--md-on-surface)',
            fontSize: '1.5rem',
            fontWeight: '600',
          }}>
            Terms of Service
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--md-on-surface-variant)',
              padding: '4px',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--md-on-surface)'}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ lineHeight: '1.6', color: 'var(--md-on-surface)' }}>
          <p style={{ marginBottom: '16px', fontSize: '0.875rem' }}>
            <strong>Last updated:</strong> December 2024
          </p>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Acceptance of Terms
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              By accessing and using MTG Card Forge, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Description of Service
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              MTG Card Forge is a web application that provides Magic: The Gathering card search functionality, set filtering, and pricing information. The service aggregates data from third-party APIs including Scryfall and TCGPlayer.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Intellectual Property Rights
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              Magic: The Gathering is a trademark of Wizards of the Coast LLC. This application is not affiliated with, endorsed by, or sponsored by Wizards of the Coast. All card images, names, and game mechanics are property of Wizards of the Coast.
            </p>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              The application code and design are provided under the MIT License. Card data is sourced from Scryfall API, and pricing information is sourced from TCGPlayer.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Use License
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              Permission is granted to temporarily use this application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '0.875rem' }}>
              <li>Modify or copy the materials for commercial purposes</li>
              <li>Attempt to reverse engineer any software contained in the application</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Disclaimer
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              The materials on this application are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Limitations
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              In no event shall MTG Card Forge or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the application, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Third-Party Services
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              This application relies on third-party services including Scryfall API and TCGPlayer. We are not responsible for the availability, accuracy, or content of these services. Users should review the terms of service for these third-party providers.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Revisions and Errata
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              The materials appearing on this application could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the application are accurate, complete, or current. We may make changes to the materials contained on the application at any time without notice.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Links
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              MTG Card Forge has not reviewed all of the sites linked to its application and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by MTG Card Forge of the site.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Modifications
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              We may revise these terms of service for the application at any time without notice. By using this application, you are agreeing to be bound by the then current version of these Terms of Service.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Contact Information
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              If you have any questions about these Terms of Service, please contact us through our GitHub repository at{' '}
              <a 
                href="https://github.com/Ma77h3hac83r/MTG-Card-Forge/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--md-primary)', textDecoration: 'none' }}
              >
                https://github.com/Ma77h3hac83r/MTG-Card-Forge/issues
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms; 