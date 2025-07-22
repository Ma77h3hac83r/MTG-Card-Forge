import React, { useState, useEffect } from 'react';
import { MTGCard } from '../types';
import { mtgApiService } from '../services/mtgApi';
import tcgplayerIcon from '../images/tcgplayer_icon.svg';

interface CardResultProps {
  card: MTGCard;
  sets: MTGCard[];
  cheapestPrinting: MTGCard;
  categoryTopCard?: MTGCard;
  sortOption?: string;
  showImages?: boolean;
  displayMode?: 'compact' | 'detailed';
}

const CardResult: React.FC<CardResultProps> = ({ 
  card, 
  sets, 
  cheapestPrinting, 
  categoryTopCard,
  sortOption = 'price-asc',
  showImages = false,
  displayMode = 'compact'
}) => {
  const [imageErrorMap, setImageErrorMap] = useState<{ [id: string]: boolean }>({});
  const [imageUrlMap, setImageUrlMap] = useState<{ [id: string]: string }>({});

  // Fetch image URLs for cards that don't have them
  useEffect(() => {
    if (showImages) {
      sets.forEach(async (set) => {
        const hasDualSidedImage = set.card_faces && set.card_faces.length > 0 && set.card_faces[0].image_uris?.large;
        const hasSingleSidedImage = set.image_uris?.large;
        
        if (!hasDualSidedImage && !hasSingleSidedImage && !imageUrlMap[set.id] && !imageErrorMap[set.id]) {
          try {
            const imageUrl = await mtgApiService.getCardImageUrl(set);
            if (imageUrl) {
              setImageUrlMap(prev => ({ ...prev, [set.id]: imageUrl }));
            }
          } catch (error) {
            console.warn(`Could not get image for ${set.name}:`, error);
            setImageErrorMap(prev => ({ ...prev, [set.id]: true }));
          }
        }
      });
    }
  }, [sets, showImages, imageUrlMap, imageErrorMap]);

  // Helper function to get the image URL for a card
  const getCardImageUrl = (set: MTGCard): string | null => {
    if (set.card_faces && set.card_faces.length > 0 && set.card_faces[0].image_uris?.normal) {
      return set.card_faces[0].image_uris.normal;
    }
    
    if (set.image_uris?.normal) {
      return set.image_uris.normal;
    }
    
    return imageUrlMap[set.id] || null;
  };

  const getCardPrice = (card: MTGCard): number => {
    if (!card.prices) return Infinity;
    const prices = [
      parseFloat(card.prices.usd || '0'),
      parseFloat(card.prices.usd_foil || '0'),
      parseFloat(card.prices.usd_etched || '0'),
    ].filter(price => price > 0);
    return prices.length === 0 ? Infinity : Math.min(...prices);
  };

  const getCardPriceDisplay = (card: MTGCard): string => {
    const price = getCardPrice(card);
    return price === Infinity ? 'N/A' : `$${price.toFixed(2)}`;
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

  const getTCGPlayerUrl = (card: MTGCard): string => {
    if (card.tcgplayer_id) {
      return `https://www.tcgplayer.com/product/${card.tcgplayer_id}`;
    }
    
    const cardName = encodeURIComponent(card.name);
    const setName = encodeURIComponent(card.set_name);
    return `https://www.tcgplayer.com/search/all/product?q=${cardName}%20${setName}`;
  };

  // Sort sets based on sortOption
  const sortedSets = [...sets];
  if (sortOption === 'price-asc') {
    sortedSets.sort((a, b) => getCardPrice(a) - getCardPrice(b));
  } else if (sortOption === 'price-desc') {
    sortedSets.sort((a, b) => getCardPrice(b) - getCardPrice(a));
  } else if (sortOption === 'newest') {
    sortedSets.sort((a, b) => {
      if (!a?.released_at || !b?.released_at) return 0;
      return new Date(b.released_at).getTime() - new Date(a.released_at).getTime();
    });
  } else if (sortOption === 'oldest') {
    sortedSets.sort((a, b) => {
      if (!a?.released_at || !b?.released_at) return 0;
      return new Date(a.released_at).getTime() - new Date(b.released_at).getTime();
    });
  } else if (sortOption === 'alpha') {
    sortedSets.sort((a, b) => a.set_name.localeCompare(b.set_name));
  }

  // Group sets by type for detailed mode
  const groupedSets = sets.reduce((acc, set) => {
    const type = mtgApiService.categorizeSetType(set.set_type, set.set);
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
    masterpiece: 'Masterpiece Sets',
    universes_beyond: 'Universes Beyond Sets',
    other: 'Other Sets'
  };

  if (displayMode === 'detailed') {
    return (
      <div className="card" style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Card Image */}
          <div style={{ textAlign: 'center' }}>
            {cheapestPrinting.image_uris?.normal ? (
              <img
                src={cheapestPrinting.image_uris.normal}
                alt={card.name}
                style={{
                  width: '100%',
                  maxWidth: '280px',
                  borderRadius: '16px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                  border: '2px solid var(--border-color)',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '280px',
                  height: '390px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '16px',
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
                        {getCardPriceDisplay(set)}
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
  }

  // Compact mode (default)
  return (
    <div className="card" style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gap: '8px', position: 'relative', zIndex: 1 }}>
          {sortedSets.map((set) => {
            const imageUrl = getCardImageUrl(set);
            const hasImageError = imageErrorMap[set.id];
            
            return (
              <div
                key={set.id}
                style={{
                  padding: '10px 12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '6px',
                  fontSize: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: showImages ? '12px' : '0',
                  border: '1px solid var(--border-color)',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-color)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <i className={`ss ss-${set.set.toLowerCase()}`} style={{ fontSize: '1.3em' }}></i>
                      <span style={{ 
                        fontWeight: '600', 
                        color: 'var(--text-primary)',
                        fontSize: '16px',
                        lineHeight: '1.2',
                        maxWidth: '160px',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {set.set_name}
                      </span>
                    </div>
                    <div style={{ 
                      color: 'var(--text-muted)', 
                      fontSize: '13px',
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
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    marginLeft: '12px',
                    flexShrink: 0,
                    gap: '4px',
                  }}>
                    <div style={{ 
                      color: 'var(--accent-color)', 
                      fontWeight: '600',
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      maxWidth: '70px',
                      textAlign: 'right',
                    }}>
                      {getCardPriceDisplay(set)}
                    </div>
                    <a
                      href={getTCGPlayerUrl(set)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--accent-color)';
                        e.currentTarget.style.borderColor = 'var(--accent-color)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                      }}
                      title="View on TCGPlayer"
                    >
                      <img
                        src={tcgplayerIcon}
                        alt="TCGPlayer"
                        style={{
                          width: '16px',
                          height: '16px',
                          filter: 'brightness(0.8)',
                        }}
                      />
                    </a>
                  </div>
                </div>
                {showImages && imageUrl && !hasImageError && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                      src={imageUrl}
                      alt={card.name}
                      style={{
                        width: '160px',
                        height: '224px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                        objectFit: 'cover',
                        background: 'var(--bg-tertiary)'
                      }}
                      onError={() => setImageErrorMap(prev => ({ ...prev, [set.id]: true }))}
                    />
                  </div>
                )}
                {showImages && (!imageUrl || hasImageError) && (
                  <div style={{
                    width: '160px',
                    height: '224px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '32px',
                    margin: '0 auto',
                  }}>
                    🃏
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CardResult; 