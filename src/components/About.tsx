import React from 'react';

interface AboutProps {
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ onClose }) => {
  const features = [
    {
      icon: '🔍',
      title: 'Advanced Search',
      description: 'Search for any Magic: The Gathering card by name with instant autocomplete suggestions.'
    },
    {
      icon: '📚',
      title: 'Complete Set Information',
      description: 'View all available printings of a card across different sets, editions, and special releases.'
    },
    {
      icon: '🎨',
      title: 'High-Quality Images',
      description: 'Display card images from the most recent printings with toggle to show/hide images.'
    },
    {
      icon: '💰',
      title: 'Price Information',
      description: 'View current market prices from TCGPlayer with direct purchase links.'
    },
    {
      icon: '🎯',
      title: 'Smart Filtering',
      description: 'Filter by set type, frame, border color, foil options, and more.'
    },
    {
      icon: '📊',
      title: 'Bulk Import',
      description: 'Import multiple cards at once for deck building and collection management.'
    },
    {
      icon: '🃏',
      title: 'Dual-Sided Cards',
      description: 'Full support for transform cards, modal double-faced cards, and other special layouts.'
    },
    {
      icon: '⚡',
      title: 'Real-time Data',
      description: 'Powered by Scryfall API for the most up-to-date card information and rulings.'
    }
  ];

  const technologies = [
    { name: 'React 18', description: 'Modern UI framework with TypeScript' },
    { name: 'Scryfall API', description: 'Comprehensive MTG card database' },
    { name: 'TCGPlayer', description: 'Market prices and purchase links' },
    { name: 'Material Design 3', description: 'Modern, accessible design system' },
    { name: 'Keyrune Font', description: 'Authentic MTG set symbols' },
    { name: 'Mana Font', description: 'Official MTG mana symbols' }
  ];

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
            About MTG Card Forge
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

        {/* Features Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            margin: '0 0 20px 0',
            color: 'var(--md-on-surface)',
            fontSize: '1.25rem',
            fontWeight: '600',
          }}>
            Key Features
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                padding: '16px',
                background: 'var(--md-surface-container)',
                border: '1px solid var(--md-outline-variant)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  {feature.icon}
                </div>
                <div>
                  <h4 style={{
                    margin: '0 0 4px 0',
                    color: 'var(--md-on-surface)',
                    fontSize: '1rem',
                    fontWeight: '500',
                  }}>
                    {feature.title}
                  </h4>
                  <p style={{
                    margin: 0,
                    color: 'var(--md-on-surface-variant)',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                  }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            margin: '0 0 20px 0',
            color: 'var(--md-on-surface)',
            fontSize: '1.25rem',
            fontWeight: '600',
          }}>
            Built With
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}>
            {technologies.map((tech, index) => (
              <div key={index} style={{
                padding: '12px 16px',
                background: 'var(--md-surface-container)',
                border: '1px solid var(--md-outline-variant)',
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontWeight: '500',
                  color: 'var(--md-on-surface)',
                  marginBottom: '4px',
                }}>
                  {tech.name}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--md-on-surface-variant)',
                }}>
                  {tech.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div style={{
          padding: '20px',
          background: 'var(--md-surface-container-low)',
          borderRadius: '12px',
          border: '1px solid var(--md-outline-variant)',
          textAlign: 'center',
        }}>
          <p style={{
            margin: '0 0 16px 0',
            color: 'var(--md-on-surface-variant)',
            fontSize: '0.875rem',
          }}>
            MTG Card Forge is an open-source project designed to help Magic: The Gathering players 
            discover and explore the vast world of MTG cards.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <a
              href="https://github.com/Ma77h3hac83r/MTG-Card-Forge"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--md-primary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            >
              View on GitHub
            </a>
            <span style={{ color: 'var(--md-outline)' }}>•</span>
            <button
              onClick={() => window.open('https://github.com/Ma77h3hac83r/MTG-Card-Forge/issues', '_blank')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--md-primary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '0',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            >
              Report Issues
            </button>
            <span style={{ color: 'var(--md-outline)' }}>•</span>
            <button
              onClick={() => window.open('https://github.com/Ma77h3hac83r/MTG-Card-Forge/issues/new', '_blank')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--md-primary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '0',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            >
              Request Features
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '24px',
        }}>
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default About; 