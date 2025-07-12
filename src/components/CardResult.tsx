import React, { useState, useEffect } from 'react';
import { MTGCard } from '../types';
import { mtgApiService } from '../services/mtgApi';

interface CardResultProps {
  card: MTGCard;
  sets: MTGCard[];
  cheapestPrinting: MTGCard;
}

const CardResult: React.FC<CardResultProps> = ({ card, sets, cheapestPrinting }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageError, setImageError] = useState(false);

  // Helper function to get the image URL for a card
  const getCardImageUrl = (card: MTGCard): string => {
    // For dual-sided cards, return the front face large image
    if (card.card_faces && card.card_faces.length > 0 && card.card_faces[0].image_uris?.large) {
      return card.card_faces[0].image_uris.large;
    }
    
    // For single-sided cards, return the large image
    if (card.image_uris?.large) {
      return card.image_uris.large;
    }
    
    return '';
  };

  // Set initial image URL
  useEffect(() => {
    const url = getCardImageUrl(cheapestPrinting);
    setImageUrl(url);
  }, [cheapestPrinting]);

  const getCardPrice = (card: MTGCard): string => {
    if (!card.prices) return 'N/A';
    
    const prices = [
      parseFloat(card.prices.usd || '0'),
      parseFloat(card.prices.usd_foil || '0'),
      parseFloat(card.prices.usd_etched || '0'),
    ].filter(price => price > 0);

    if (prices.length === 0) return 'N/A';
    
    const minPrice = Math.min(...prices);
    return minPrice < 1 ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)}`;
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return '#b0b0b0';
      case 'uncommon':
        return '#4a4a4a';
      case 'rare':
        return '#d4af37';
      case 'mythic':
        return '#ff6b35';
      default:
        return 'var(--text-secondary)';
    }
  };

  const groupedSets = sets.reduce((acc, set) => {
    const type = mtgApiService.categorizeSetType(set.set_type);
    if (!acc[type]) acc[type] = [];
    acc[type].push(set);
    return acc;
  }, {} as Record<string, MTGCard[]>);

  const setTypeLabels = {
    core: 'Core Sets',
    expansion: 'Expansion Sets',
    masters: 'Masters Sets',
    commander: 'Commander Sets',
    secret_lair: 'Secret Lair Sets',
    other: 'Other Sets'
  };

  return (
    <div className="card" style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start', position: 'relative', zIndex: 1 }}>
        {/* Card Image */}
        <div style={{ textAlign: 'center' }}>
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={card.name}
              style={{
                width: '100%',
                maxWidth: '280px',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                border: '2px solid var(--border-color)',
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              style={{
                width: '280px',
                height: '390px',
                background: 'var(--bg-tertiary)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--border-color)',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🃏</div>
                <div>Image not available</div>
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '16px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{card.name}</h3>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {card.type_line || 'Unknown Type'}
            </div>
            {card.mana_cost && (
              <div style={{ marginTop: '8px', fontSize: '18px' }}>
                {card.mana_cost}
              </div>
            )}
          </div>
        </div>

        {/* Sets List */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
            Available in {sets.length} set{sets.length !== 1 ? 's' : ''}
          </h3>
          
          {Object.entries(groupedSets).map(([type, typeSets]) => (
            <div key={type} style={{ marginBottom: '20px' }}>
              <h4 style={{ 
                margin: '0 0 12px 0', 
                color: 'var(--text-secondary)',
                fontSize: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {setTypeLabels[type as keyof typeof setTypeLabels]}
              </h4>
              
              <div style={{ display: 'grid', gap: '8px' }}>
                {typeSets.map((set) => (
                  <div
                    key={set.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-color)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div>
                      <div style={{ 
                        fontWeight: '600', 
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}>
                        {set.set_name}
                      </div>
                      <div style={{ 
                        color: 'var(--text-muted)', 
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>{set.set.toUpperCase()}</span>
                        <span>•</span>
                        <span style={{ 
                          color: getRarityColor(set.rarity),
                          fontWeight: '500'
                        }}>
                          {set.rarity}
                        </span>
                        <span>•</span>
                        <span>#{set.collector_number}</span>
                      </div>
                    </div>
                    
                    <div style={{ 
                      color: 'var(--accent-color)', 
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {getCardPrice(set)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardResult; 