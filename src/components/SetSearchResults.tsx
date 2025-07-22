import React from 'react';
import { CardResult } from '../types';

interface SetSearchResultsProps {
  filteredResults: CardResult[];
  showImages: boolean;
}

const SetSearchResults: React.FC<SetSearchResultsProps> = ({ filteredResults, showImages }) => {
  return (
    <div style={{
      marginTop: '24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
      }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
          Set Cards ({filteredResults.length})
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
      }}>
        {filteredResults.map((result, index) => (
          <div
            key={`${result.card.name}-${index}`}
            style={{
              background: 'var(--md-surface-container)',
              border: '1px solid var(--md-outline-variant)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = 'var(--md-outline)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = 'var(--md-outline-variant)';
            }}
          >
            {/* Card Image */}
            {showImages && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '12px',
              }}>
                {result.cheapestPrinting.image_uris?.normal ? (
                  <img
                    src={result.cheapestPrinting.image_uris.normal}
                    alt={result.card.name}
                    style={{
                      width: '100%',
                      maxWidth: '200px',
                      height: 'auto',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      border: '1px solid var(--border-color)',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    maxWidth: '200px',
                    height: '280px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-muted)',
                    fontSize: '48px',
                  }}>
                    🃏
                  </div>
                )}
              </div>
            )}

            {/* Card Name */}
            <h4 style={{
              margin: '0 0 8px 0',
              color: 'var(--text-primary)',
              fontSize: '1.1rem',
              fontWeight: '600',
              lineHeight: '1.3',
              textAlign: 'center',
            }}>
              {result.card.name}
            </h4>
            
            {/* Card Type */}
            <div style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              fontStyle: 'italic',
            }}>
              {result.card.type_line}
            </div>
          </div>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'var(--text-secondary)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔍</div>
          <div style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
            No cards found
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            Try adjusting your filters or search for a different set.
          </div>
        </div>
      )}
    </div>
  );
};

export default SetSearchResults; 