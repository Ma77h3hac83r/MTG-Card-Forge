import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import SetFilter from './components/SetFilter';
import CardResult from './components/CardResult';
import CompactCardResult from './components/CompactCardResult';
import { MTGCard, SetFilter as SetFilterType, CardResult as CardResultType } from './types';
import { mtgApiService } from './services/mtgApi';



const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<CardResultType[]>([]);
  const [setFilters, setSetFilters] = useState<SetFilterType[]>([]);
  const [error, setError] = useState<string>('');
  const [sortOption, setSortOption] = useState('price-asc');
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedBulkCard, setSelectedBulkCard] = useState<string>('');
  const [frameFilter, setFrameFilter] = useState('');
  const [borderFilter, setBorderFilter] = useState('');
  const [foilFilter, setFoilFilter] = useState('');
  const [showImages, setShowImages] = useState(false);

  // Utility function to render text with mana symbols
  const renderTextWithManaSymbols = (text: string, fontSize: string = '0.85em') => {
    return text.split(/(\{[^}]+\})/).map((part, i) => {
      if (part.match(/^\{[^}]+\}$/)) {
        const symbolText = part.slice(1, -1).toLowerCase(); // Remove { and } directly
        
        // Handle special symbols that need different mapping
        let mappedSymbol = symbolText;
        if (symbolText === 't') mappedSymbol = 'tap';
        if (symbolText === 'q') mappedSymbol = 'untap';
        if (symbolText === 's') mappedSymbol = 'snow';
        if (symbolText === 'e') mappedSymbol = 'energy';
        if (symbolText === 'p') mappedSymbol = 'phyrexian';
        if (symbolText === 'c') mappedSymbol = 'colorless';
        
        // Use the standard Mana font pattern: ms ms-{symbol} ms-cost ms-shadow
        const cssClasses = `ms ms-${mappedSymbol} ms-cost ms-shadow`;
        
        return (
          <i
            key={i}
            className={cssClasses}
            style={{ fontSize, verticalAlign: 'middle', margin: '0 1px' }}
          />
        );
      }
      return part;
    });
  };

  // Utility function to render saga chapters with hexagon symbols
  const renderSagaChapters = (text: string) => {
    return text.split(/(\{[^}]+\})/).map((part, i) => {
      if (part.match(/^\{[^}]+\}$/)) {
        const symbolText = part.slice(1, -1).toLowerCase(); // Remove { and } directly
        
        // Check if it's a number (saga chapter)
        if (/^\d+$/.test(symbolText)) {
          return (
            <i
              key={i}
              className={`ms ms-saga ms-saga-${symbolText}`}
              style={{
                fontSize: '0.85em',
                margin: '0 1px',
              }}
            />
          );
        }
        
        // For non-saga chapter symbols, use the main renderTextWithManaSymbols function
        return renderTextWithManaSymbols(part, '0.85em')[0];
      }
      return part;
    });
  };

  // Utility function to render saga oracle text with proper chapter parsing
  const renderSagaOracleText = (oracleText: string) => {
    if (!oracleText) return null;
    
    // Split oracle text by newlines to get individual abilities
    const abilities = oracleText.split('\n').filter(ability => ability.trim());
    
    return abilities.map((ability, index) => {
      // Check if this line starts with a saga chapter (e.g., "I —", "II —", "IV, V, VI —")
      // Note: Saga text uses em dash (—) not regular dash (-)
      const sagaMatch = ability.match(/^([IVX]+(?:,\s*[IVX]+)*)\s*—\s*(.+)$/);
      
      if (sagaMatch) {
        const [, chapterText, abilityText] = sagaMatch;
        
        // Parse the chapter numbers (convert roman numerals to numbers)
        const chapterNumbers = chapterText.split(/,\s*/).map(chapter => {
          switch (chapter.trim()) {
            case 'I': return 1;
            case 'II': return 2;
            case 'III': return 3;
            case 'IV': return 4;
            case 'V': return 5;
            case 'VI': return 6;
            default: return 1;
          }
        });
        
        return (
          <div key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
              {chapterNumbers.map((chapterNum, chapterIndex) => (
                <i
                  key={chapterIndex}
                  className={`ms ms-saga ms-saga-${chapterNum}`}
                  style={{
                    fontSize: '1.4em',
                    marginTop: '2px',
                  }}
                />
              ))}
            </div>
            <div style={{ flex: 1 }}>
              {renderTextWithManaSymbols(abilityText)}
            </div>
          </div>
        );
      }
      
      // If it doesn't match the saga pattern, render as regular text with mana symbols
      return (
        <div key={index} style={{ marginBottom: '8px' }}>
          {renderTextWithManaSymbols(ability)}
        </div>
      );
    });
  };

  // Utility function to render planeswalker abilities using Scryfall's structured format
  const renderPlaneswalkerAbilities = (oracleText: string) => {
    if (!oracleText) return null;
    
    // Split oracle text by newlines to get individual abilities
    const abilities = oracleText.split('\n').filter(ability => ability.trim());
    
    return abilities.map((ability, index) => {
      // Check if this line starts with a loyalty cost (e.g., "+3:", "−3:", "0:" or "+3 —", "−3 —", "0 —")
      // Note: Negative loyalty uses proper minus sign (−) not hyphen (-)
      const loyaltyMatch = ability.match(/^([+−]?\d+)[:—]\s*(.+)$/);
      
      if (loyaltyMatch) {
        const [, loyaltyCost, abilityText] = loyaltyMatch;
        const isPositive = loyaltyCost.startsWith('+');
        const isNegative = loyaltyCost.startsWith('−'); // Note: using proper minus sign
        const number = loyaltyCost.replace(/[+−]/, ''); // Remove both + and −
        
        // Determine the loyalty icon class based on the cost
        let loyaltyClass = '';
        if (isPositive) {
          loyaltyClass = `ms ms-loyalty-up ms-loyalty-${number}`;
        } else if (isNegative) {
          loyaltyClass = `ms ms-loyalty-down ms-loyalty-${number}`;
        } else {
          loyaltyClass = `ms ms-loyalty-zero ms-loyalty-${number}`;
        }
        
        return (
          <div key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <i
              className={loyaltyClass}
              style={{
                fontSize: '1.4em',
                marginTop: '2px',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              {renderTextWithManaSymbols(abilityText)}
            </div>
          </div>
        );
      }
      
      // If it doesn't match the loyalty pattern, render as regular text with mana symbols
      return (
        <div key={index} style={{ marginBottom: '8px' }}>
          {renderTextWithManaSymbols(ability)}
        </div>
      );
    });
  };

  // Utility function to render a single card face
  const renderCardFace = (cardFace: any, faceIndex: number, isDualSided: boolean = false) => {
    return (
      <div key={faceIndex} style={{ 
        marginBottom: isDualSided ? '24px' : '0',
        padding: isDualSided ? '16px' : '0',
        border: isDualSided ? '1px solid var(--border-color)' : 'none',
        borderRadius: isDualSided ? '8px' : '0',
        background: isDualSided ? 'var(--bg-secondary)' : 'transparent'
      }}>
        {isDualSided && (
          <div style={{ 
            fontWeight: '600', 
            marginBottom: '12px', 
            color: 'var(--mtg-gold)',
            fontSize: '1.1rem'
          }}>
            {faceIndex === 0 ? 'Front Side' : 'Back Side'}
          </div>
        )}
        
        {/* Line 1: Card Name and Mana Cost */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {cardFace.name}
          </div>
          {cardFace.mana_cost && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              {renderTextWithManaSymbols(cardFace.mana_cost, '1.5em')}
            </div>
          )}
        </div>
        
        {/* Line 2: Card Type */}
        <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '8px' }}>
          {cardFace.type_line || 'Unknown Type'}
        </div>
        
        {/* Line 3: Description (Oracle Text only, no flavor text) */}
        {cardFace.oracle_text && cardFace.type_line && !cardFace.type_line.toLowerCase().includes('planeswalker') && !cardFace.type_line.toLowerCase().includes('saga') && (
          <div style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '8px', whiteSpace: 'pre-line' }}>
            {renderTextWithManaSymbols(cardFace.oracle_text)}
          </div>
        )}
        
        {/* Line 3.5: Loyalty Abilities (for Planeswalkers) */}
        {cardFace.loyalty && cardFace.type_line && cardFace.type_line.toLowerCase().includes('planeswalker') && (
          <div style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '8px' }}>
            <div style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--mtg-gold)' }}>
              Starting Loyalty: 
              <i
                className={`ms ms-loyalty-start ms-loyalty-${cardFace.loyalty}`}
                style={{
                  fontSize: '1.4em',
                  marginLeft: '8px',
                }}
              />
            </div>
            {cardFace.oracle_text && (
              <div>
                {renderPlaneswalkerAbilities(cardFace.oracle_text)}
              </div>
            )}
          </div>
        )}
        
        {/* Line 3.5: Saga Chapters (for Sagas) */}
        {cardFace.type_line && cardFace.type_line.toLowerCase().includes('saga') && cardFace.oracle_text && (
          <div style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '8px' }}>
            <div style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--mtg-gold)' }}>
              Saga Chapters:
            </div>
            <div style={{ whiteSpace: 'pre-line' }}>
              {renderSagaOracleText(cardFace.oracle_text)}
            </div>
          </div>
        )}
        
        {/* Line 4: Power/Toughness (if applicable) */}
        {(cardFace.power || cardFace.toughness) && (
          <div style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '8px', fontWeight: '600' }}>
            {cardFace.power}/{cardFace.toughness}
          </div>
        )}
      </div>
    );
  };

  // Utility function to render dual-sided cards
  const renderDualSidedCard = (card: MTGCard) => {
    if (!card.card_faces || card.card_faces.length < 2) {
      return null;
    }

    return (
      <div style={{ display: 'flex', gap: '20px' }}>
        {card.card_faces.map((face, index) => 
          <div key={index} style={{ flex: 1 }}>
            {renderCardFace(face, index, true)}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    // Initialize set filters
    const initializeFilters = async () => {
      try {
        const sets = await mtgApiService.getSets();
        const typeMap = new Map<string, string>();
        sets.forEach(set => {
          const type = mtgApiService.categorizeSetType(set.set_type, set.code);
          typeMap.set(type, type);
        });
        const uniqueTypes = Array.from(typeMap.keys());
        
        // Define the desired order for filters
        const filterOrder = ['core', 'expansion', 'masters', 'commander', 'secret_lair', 'masterpiece', 'universes_beyond', 'other'];
        const sortedTypes = uniqueTypes.sort((a, b) => 
          filterOrder.indexOf(a) - filterOrder.indexOf(b)
        );
        
        const filters: SetFilterType[] = sortedTypes.map((type, index) => ({
          id: `filter-${index}`,
          name: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
          type: type as 'core' | 'expansion' | 'masters' | 'commander' | 'secret_lair' | 'masterpiece' | 'universes_beyond' | 'other',
          enabled: true,
        }));
        
        setSetFilters(filters);
      } catch (error) {
        console.error('Failed to initialize filters:', error);
      }
    };

    initializeFilters();
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError('');
    setBulkMode(false);
    setSelectedBulkCard('');
    
    try {
      const cards = await mtgApiService.getCardByName(query);
      if (cards.length === 0) {
        setError('No cards found with that name.');
        setSearchResults([]);
        return;
      }

      const results: CardResultType[] = [];
      
      // Group cards by name to handle multiple printings
      const cardGroups = cards.reduce((acc, card) => {
        if (!acc[card.name]) {
          acc[card.name] = [];
        }
        acc[card.name].push(card);
        return acc;
      }, {} as Record<string, MTGCard[]>);

      for (const [cardName, cardPrintings] of Object.entries(cardGroups)) {
        const cheapestPrinting = mtgApiService.getCheapestPrinting(cardPrintings);
        const representativeCard = cardPrintings[0];
        
        results.push({
          card: representativeCard,
          sets: cardPrintings,
          cheapestPrinting,
        });
      }

      setSearchResults(results);
    } catch (error) {
      setError('Failed to search for cards. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkSearch = async (cardNames: string[]) => {
    setIsLoading(true);
    setError('');
    setBulkMode(true);
    
    try {
      const results: CardResultType[] = [];
      
      for (const cardName of cardNames) {
        try {
          const cards = await mtgApiService.getCardByName(cardName);
          if (cards.length > 0) {
            const cheapestPrinting = mtgApiService.getCheapestPrinting(cards);
            const representativeCard = cards[0];
            
            results.push({
              card: representativeCard,
              sets: cards,
              cheapestPrinting,
            });
          }
        } catch (error) {
          console.error(`Failed to search for ${cardName}:`, error);
        }
      }

      if (results.length === 0) {
        setError('No cards found from the provided list.');
        setBulkMode(false);
      } else {
        setSearchResults(results);
        setSelectedBulkCard(results[0].card.name);
      }
    } catch (error) {
      setError('Failed to search for cards. Please try again.');
      setSearchResults([]);
      setBulkMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterId: string, enabled: boolean) => {
    setSetFilters(prev => 
      prev.map(filter => 
        filter.id === filterId ? { ...filter, enabled } : filter
      )
    );
  };

  const handleToggleAll = (enabled: boolean) => {
    setSetFilters(prev => 
      prev.map(filter => ({ ...filter, enabled }))
    );
  };

  // For bulk mode, filter to only the selected card
  const filteredResults = bulkMode && selectedBulkCard
    ? searchResults.filter(result => result.card.name === selectedBulkCard)
    : searchResults.map(result => ({
        ...result,
        sets: result.sets.filter(set => {
          const setType = mtgApiService.categorizeSetType(set.set_type, set.set);
          const filter = setFilters.find(f => f.type === setType);
          // Frame, border, and foil filters
          const frameMatch = !frameFilter || set.frame === frameFilter;
          const borderMatch = !borderFilter || set.border_color === borderFilter;
          const foilMatch = !foilFilter || (foilFilter === 'foil' && set.prices?.usd_foil) || (foilFilter === 'nonfoil' && set.prices?.usd);
          return (filter?.enabled ?? true) && frameMatch && borderMatch && foilMatch;
        }),
      })).filter(result => result.sets.length > 0);

  // Get the selected card for details
  const selectedCard = filteredResults.length > 0 ? filteredResults[0].card : null;

  return (
    <div style={{ minHeight: '100vh', padding: '20px 0', position: 'relative', zIndex: 1 }}>
      
      <div className="container" style={{ maxWidth: '60vw', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <header style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 2 }}>
          <h1 style={{ 
            fontSize: '3rem', 
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, var(--mtg-gold), var(--mtg-gold-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            MTG Card Finder
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--text-secondary)',
            margin: 0,
          }}>
            Search for Magic: The Gathering cards and discover all their available printings
          </p>
        </header>

        <SearchForm 
          onSearch={handleSearch}
          onBulkSearch={handleBulkSearch}
          isLoading={isLoading}
        />

        {/* Card Details Section */}
        {selectedCard && (
          <div className="card" style={{ marginBottom: '16px', background: 'var(--bg-tertiary)', padding: '16px' }}>
            {selectedCard.layout === 'transform' ? (
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                {/* Card Images for Dual-Sided Cards */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {selectedCard.card_faces?.map((face, index) => (
                      <div key={index} style={{ textAlign: 'center' }}>
                        {face.image_uris?.large ? (
                          <img
                            src={face.image_uris.large}
                            alt={`${face.name} - ${index === 0 ? 'Front' : 'Back'}`}
                            style={{
                              width: '200px',
                              height: '280px',
                              borderRadius: '12px',
                              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                              border: '2px solid var(--border-color)',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '200px',
                              height: '280px',
                              background: 'var(--bg-secondary)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px solid var(--border-color)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🃏</div>
                              <div style={{ fontSize: '12px' }}>Image not available</div>
                            </div>
                          </div>
                        )}
                        <div style={{ 
                          marginTop: '8px', 
                          fontSize: '12px', 
                          color: 'var(--text-secondary)',
                          fontWeight: '600'
                        }}>
                          {index === 0 ? 'Front' : 'Back'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Card Details for Dual-Sided Cards */}
                <div style={{ flex: 1 }}>
                  {renderDualSidedCard(selectedCard)}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                {/* Card Image for Single-Sided Cards */}
                <div style={{ flexShrink: 0, textAlign: 'center' }}>
                  {selectedCard.image_uris?.large ? (
                    <img
                      src={selectedCard.image_uris.large}
                      alt={selectedCard.name}
                      style={{
                        width: '280px',
                        height: '392px',
                        borderRadius: '12px',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                        border: '2px solid var(--border-color)',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '280px',
                        height: '392px',
                        background: 'var(--bg-secondary)',
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
                </div>
                
                {/* Card Details for Single-Sided Cards */}
                <div style={{ flex: 1 }}>
                  {/* Line 1: Card Name and Mana Cost */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {selectedCard.name}
                    </div>
                    {selectedCard.mana_cost && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {renderTextWithManaSymbols(selectedCard.mana_cost, '1.5em')}
                      </div>
                    )}
                  </div>
                  
                  {/* Line 2: Card Type */}
                  <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '8px' }}>
                    {selectedCard.type_line || 'Unknown Type'}
                  </div>
                  
                  {/* Line 3: Description (Oracle Text only, no flavor text) */}
                  {selectedCard.oracle_text && selectedCard.type_line && !selectedCard.type_line.toLowerCase().includes('planeswalker') && !selectedCard.type_line.toLowerCase().includes('saga') && (
                    <div style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '8px', whiteSpace: 'pre-line' }}>
                      {renderTextWithManaSymbols(selectedCard.oracle_text)}
                    </div>
                  )}
                  
                  {/* Line 3.5: Loyalty Abilities (for Planeswalkers) */}
                  {selectedCard.loyalty && selectedCard.type_line && selectedCard.type_line.toLowerCase().includes('planeswalker') && (
                    <div style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '8px' }}>
                      <div style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--mtg-gold)' }}>
                        Starting Loyalty: 
                        <i
                          className={`ms ms-loyalty-start ms-loyalty-${selectedCard.loyalty}`}
                          style={{
                            fontSize: '1.4em',
                            marginLeft: '8px',
                          }}
                        />
                      </div>
                      {selectedCard.oracle_text && (
                        <div>
                          {renderPlaneswalkerAbilities(selectedCard.oracle_text)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Line 3.5: Saga Chapters (for Sagas) */}
                  {selectedCard.type_line && selectedCard.type_line.toLowerCase().includes('saga') && selectedCard.oracle_text && (
                    <div style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '8px' }}>
                      <div style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--mtg-gold)' }}>
                        Saga Chapters:
                      </div>
                      <div style={{ whiteSpace: 'pre-line' }}>
                        {renderSagaOracleText(selectedCard.oracle_text)}
                      </div>
                    </div>
                  )}
                  
                  {/* Line 4: Power/Toughness (if applicable) */}
                  {(selectedCard.power || selectedCard.toughness) && (
                    <div style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '8px', fontWeight: '600' }}>
                      {selectedCard.power}/{selectedCard.toughness}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Line 5: Format Legalities */}
            {selectedCard.legalities && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px', fontWeight: '600' }}>
                  Format Legalities:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(selectedCard.legalities).map(([format, legality]) => (
                    <span
                      key={format}
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        background: legality === 'legal' ? 'rgba(34, 197, 94, 0.2)' : 
                                  legality === 'restricted' ? 'rgba(245, 158, 11, 0.2)' :
                                  legality === 'banned' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                        color: legality === 'legal' ? 'rgb(34, 197, 94)' :
                               legality === 'restricted' ? 'rgb(245, 158, 11)' :
                               legality === 'banned' ? 'rgb(239, 68, 68)' : 'rgb(107, 114, 128)',
                        border: `1px solid ${legality === 'legal' ? 'rgba(34, 197, 94, 0.3)' : 
                                         legality === 'restricted' ? 'rgba(245, 158, 11, 0.3)' :
                                         legality === 'banned' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`
                      }}
                    >
                      {format}: {legality}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Consolidated Filters */}
        {setFilters.length > 0 && (
          <SetFilter
            filters={setFilters}
            onFilterChange={handleFilterChange}
            onToggleAll={handleToggleAll}
            searchResults={searchResults}
            sortOption={sortOption}
            onSortChange={setSortOption}
            frameFilter={frameFilter}
            onFrameFilterChange={setFrameFilter}
            borderFilter={borderFilter}
            onBorderFilterChange={setBorderFilter}
            foilFilter={foilFilter}
            onFoilFilterChange={setFoilFilter}
            showImages={showImages}
            onShowImagesChange={setShowImages}
            bulkMode={bulkMode}
            selectedBulkCard={selectedBulkCard}
            onBulkCardChange={setSelectedBulkCard}
            filteredResults={filteredResults}
          />
        )}

        {error && (
          <div className="card" style={{ 
            marginBottom: '24px',
            borderColor: 'var(--mtg-red)',
            background: 'rgba(211, 47, 47, 0.1)',
          }}>
            <div style={{ color: 'var(--mtg-red)', fontWeight: '600' }}>
              {error}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="card" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              Searching for cards...
            </div>
          </div>
        )}

        {filteredResults.length > 0 && (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '24px',
            width: '100%',
          }}>
            {['core', 'expansion', 'masters', 'commander', 'secret_lair', 'masterpiece', 'universes_beyond', 'other'].map(category => {
              // Get all sets for this category
              const categorySets: MTGCard[] = [];
              const uniqueCardNames = new Set();
              filteredResults.forEach(result => {
                const categorySetsForCard = result.sets.filter(set => 
                  mtgApiService.categorizeSetType(set.set_type, set.set) === category
                );
                if (categorySetsForCard.length > 0) {
                  uniqueCardNames.add(result.card.name);
                }
                categorySets.push(...categorySetsForCard);
              });
              const categoryResults = filteredResults.filter(result => 
                result.sets.some(set => mtgApiService.categorizeSetType(set.set_type, set.set) === category)
              );
              // Skip categories with no cards
              if (categoryResults.length === 0) {
                return null;
              }
              // Find the top card in this category after all filters/sorts
              let categoryTopCard = categorySets[0];
              // Sort categorySets according to sortOption
              const getCardPrice = (card: MTGCard): number => {
                if (!card.prices) return Infinity;
                const prices = [
                  parseFloat(card.prices.usd || '0'),
                  parseFloat(card.prices.usd_foil || '0'),
                  parseFloat(card.prices.usd_etched || '0'),
                ].filter(price => price > 0);
                return prices.length === 0 ? Infinity : Math.min(...prices);
              };
              let sortedCategorySets = [...categorySets];
              if (sortOption === 'price-asc') {
                sortedCategorySets.sort((a, b) => getCardPrice(a) - getCardPrice(b));
              } else if (sortOption === 'price-desc') {
                sortedCategorySets.sort((a, b) => getCardPrice(b) - getCardPrice(a));
              } else if (sortOption === 'newest') {
                sortedCategorySets.sort((a, b) => {
                  if (!a?.released_at || !b?.released_at) return 0;
                  return new Date(b.released_at).getTime() - new Date(a.released_at).getTime();
                });
              } else if (sortOption === 'oldest') {
                sortedCategorySets.sort((a, b) => {
                  if (!a?.released_at || !b?.released_at) return 0;
                  return new Date(a.released_at).getTime() - new Date(b.released_at).getTime();
                });
              } else if (sortOption === 'alpha') {
                sortedCategorySets.sort((a, b) => a.set_name.localeCompare(b.set_name));
              }
              if (sortedCategorySets.length > 0) {
                categoryTopCard = sortedCategorySets[0];
              }
              
              // Limit to top 10 results for each category
              const limitedCategoryResults = categoryResults.slice(0, 10);
              
              return (
                <div key={category} className="card" style={{ 
                  padding: '16px',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <h3 style={{ 
                    margin: '0 0 16px 0', 
                    color: 'var(--text-primary)',
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    textTransform: 'capitalize'
                  }}>
                    {category.replace('_', ' ')}
                  </h3>
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {limitedCategoryResults.map((result, index) => (
                      <CompactCardResult
                        key={`${result.card.name}-${category}-${index}`}
                        card={result.card}
                        sets={result.sets.filter(set => 
                          mtgApiService.categorizeSetType(set.set_type, set.set) === category
                        )}
                        cheapestPrinting={result.cheapestPrinting}
                        categoryTopCard={categoryTopCard}
                        sortOption={sortOption}
                        showImages={showImages}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && !error && searchResults.length === 0 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🃏</div>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
              Ready to Search
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Enter a card name above to find all its available printings and sets.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 