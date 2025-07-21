import React from 'react';

interface PrivacyProps {
  onClose: () => void;
}

const Privacy: React.FC<PrivacyProps> = ({ onClose }) => {
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
            Privacy Policy
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
              Information We Collect
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              MTG Card Forge is a client-side application that operates entirely in your browser. We do not collect, store, or transmit any personal information from your device.
            </p>
            <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '0.875rem' }}>
              <li>No user accounts or profiles are created</li>
              <li>No search history is stored on our servers</li>
              <li>No personal data is collected or transmitted</li>
              <li>No cookies are used for tracking purposes</li>
            </ul>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Third-Party Services
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              This application uses the following third-party services:
            </p>
            <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '0.875rem' }}>
              <li><strong>Scryfall API:</strong> Provides Magic: The Gathering card data and images</li>
              <li><strong>TCGPlayer:</strong> Provides card pricing information</li>
            </ul>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              These services may collect standard web analytics and usage data according to their respective privacy policies. We recommend reviewing their privacy policies for more information.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Data Storage
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              Any data stored by this application is kept locally in your browser's storage and is not transmitted to our servers. This may include:
            </p>
            <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '0.875rem' }}>
              <li>User preferences and settings</li>
              <li>Filter selections and display options</li>
              <li>Browser cache for improved performance</li>
            </ul>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Contact Information
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              If you have any questions about this Privacy Policy, please contact us through our GitHub repository at{' '}
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

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Changes to This Policy
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem' }}>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 