import React from 'react';
import { CardResult } from '../types';

interface BulkCardListProps {
  searchResults: CardResult[];
  selectedBulkCard: string;
  onBulkCardChange: (cardName: string) => void;
}

const BulkCardList: React.FC<BulkCardListProps> = ({ 
  searchResults, 
  selectedBulkCard, 
  onBulkCardChange 
}) => {
  return (
    <div style={{
      background: 'var(--md-surface-container)',
      border: '1px solid var(--md-outline-variant)',
      borderRadius: '16px',
      padding: '20px',
      height: 'fit-content',
      minHeight: '400px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
      }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
          Imported Cards ({searchResults.length})
        </h3>
      </div>

      <div style={{
        maxHeight: '350px',
        overflowY: 'auto',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        background: 'var(--bg-secondary)',
      }}>
        {searchResults.map((result, index) => (
          <div
            key={result.card.name}
            style={{
              padding: '12px 16px',
              borderBottom: index < searchResults.length - 1 ? '1px solid var(--border-color)' : 'none',
              cursor: 'pointer',
              background: selectedBulkCard === result.card.name ? 'var(--bg-tertiary)' : 'transparent',
              transition: 'background-color 0.2s ease',
            }}
            onClick={() => onBulkCardChange(result.card.name)}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                }}>
                  {result.card.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}>
                  {result.sets.length} printings
                </div>
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                textAlign: 'right',
              }}>
                From ${result.cheapestPrinting.prices?.usd || 'N/A'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: 'var(--bg-tertiary)',
        borderRadius: '8px',
        fontSize: '14px',
        color: 'var(--text-secondary)',
      }}>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
          Instructions:
        </div>
        <div>
          Click on any card above to view its search results with filters applied.
        </div>
      </div>
    </div>
  );
};

export default BulkCardList; 