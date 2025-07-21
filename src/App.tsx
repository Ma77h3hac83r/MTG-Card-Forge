import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import SetFilter from './components/SetFilter';
import Feedback from './components/Feedback';
import About from './components/About';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import { MTGCard, SetFilter as SetFilterType, CardResult as CardResultType } from './types';
import { mtgApiService } from './services/mtgApi';
import tcgplayerIcon from './images/tcgplayer_icon.png';

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
const [showFeedback, setShowFeedback] = useState(false);
const [showAbout, setShowAbout] = useState(false);
const [showPrivacy, setShowPrivacy] = useState(false);
const [showTerms, setShowTerms] = useState(false);


const renderTextWithManaSymbols = (text: string, fontSize: string = '0.85em') => {
  return text.split(/(\{[^}]+\})/).map((part, i) => {
    if (part.match(/^\{[^}]+\}$/)) {
      const symbolText = part.slice(1, -1).toLowerCase();
      let mappedSymbol = symbolText;
      if (symbolText === 't') mappedSymbol = 'tap';
      if (symbolText === 'q') mappedSymbol = 'untap';
      if (symbolText === 's') mappedSymbol = 'snow';
      if (symbolText === 'e') mappedSymbol = 'energy';
      if (symbolText === 'p') mappedSymbol = 'phyrexian';
      if (symbolText === 'c') mappedSymbol = 'colorless';
  
      if (symbolText === 'c') {
        return (
          <i key={i} className="ms ms-c ms-cost ms-shadow" style={{fontSize, verticalAlign: 'middle', margin: '0 1px', color: '#000000 !important', textShadow: 'none !important', backgroundColor: 'transparent !important'}}/>
        );
      }
      const cssClasses = `ms ms-${mappedSymbol} ms-cost ms-shadow`;
      return (
        <i key={i} className={cssClasses} style={{ fontSize, verticalAlign: 'middle', margin: '0 1px' }}/>
      );
    }
    return part;
  });
};

const renderSagaOracleText = (oracleText: string) => {
  if (!oracleText) return null;
  const abilities = oracleText.split('\n').filter(ability => ability.trim());
  return abilities.map((ability, index) => {
    const sagaMatch = ability.match(/^([IVX]+(?:,\s*[IVX]+)*)\s*—\s*(.+)$/);
    if (sagaMatch) {
      const [, chapterText, abilityText] = sagaMatch;
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
              <i key={chapterIndex}className={`ms ms-saga ms-saga-${chapterNum}`}style={{fontSize: '1.4em', marginTop: '2px',}}/>
            ))}
            <div style={{ flex: 1 }}>
              {renderTextWithManaSymbols(abilityText)}
            </div>
          </div>
        </div>
      );
    }
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

  const getDisplayPrice = (prices: any): string => {
    // Check for regular USD price first
    if (prices?.usd && prices.usd !== 'null') {
      return prices.usd;
    }
    // If no regular price, check for etched price
    if (prices?.usd_etched && prices.usd_etched !== 'null') {
      return prices.usd_etched;
    }
    // If no etched price, check for foil price
    if (prices?.usd_foil && prices.usd_foil !== 'null') {
      return prices.usd_foil;
    }
    // If no prices available, return N/A
    return 'N/A';
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

      for (const [, cardPrintings] of Object.entries(cardGroups)) {
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
          const borderMatch = !borderFilter || 
            (borderFilter === 'borderless' && (set.border_color === 'borderless' || set.full_art === true)) ||
            (borderFilter !== 'borderless' && set.border_color === borderFilter);
          const foilMatch = !foilFilter || 
          (foilFilter === 'foil' && (set.prices?.usd_foil || set.prices?.usd_etched)) || 
          (foilFilter === 'nonfoil' && set.prices?.usd);
          return (filter?.enabled ?? true) && frameMatch && borderMatch && foilMatch;
        }).sort((a, b) => {
          // Sort sets based on sortOption
          if (sortOption === 'price-asc') {
            const priceA = parseFloat(getDisplayPrice(a.prices)) || 0;
            const priceB = parseFloat(getDisplayPrice(b.prices)) || 0;
            return priceA - priceB;
          } else if (sortOption === 'price-desc') {
            const priceA = parseFloat(getDisplayPrice(a.prices)) || 0;
            const priceB = parseFloat(getDisplayPrice(b.prices)) || 0;
            return priceB - priceA;
          } else if (sortOption === 'newest') {
            const dateA = new Date(a.released_at || '1900-01-01');
            const dateB = new Date(b.released_at || '1900-01-01');
            return dateB.getTime() - dateA.getTime();
          } else if (sortOption === 'oldest') {
            const dateA = new Date(a.released_at || '1900-01-01');
            const dateB = new Date(b.released_at || '1900-01-01');
            return dateA.getTime() - dateB.getTime();
          } else if (sortOption === 'alpha') {
            return (a.set_name || '').localeCompare(b.set_name || '');
          }
          return 0;
        }),
      })).filter(result => result.sets.length > 0);

  // Get the selected card for details - use most recent printing for the image
  // Always show card details if we have search results, regardless of filters
  const selectedCard = searchResults.length > 0 ? 
    mtgApiService.getMostRecentPrinting(searchResults[0].sets) : null;



  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Fixed Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'var(--md-surface-container-high)',
        borderBottom: '1px solid var(--md-outline-variant)',
        padding: '12px 16px',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ 
              fontSize: '1.25rem', 
              margin: 0,
              background: 'linear-gradient(135deg, var(--md-primary), var(--md-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '600',
            }}>
              MTG Card Forge
            </h1>
            <span 
              className="beta-badge"
              style={{
                fontSize: '0.75rem',
                color: 'var(--md-on-surface-variant)',
                padding: '2px 6px',
                background: 'var(--md-surface-container)',
                borderRadius: '8px',
                border: '1px solid var(--md-outline-variant)',
              }}
            >
              Beta
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn btn-secondary" 
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              onClick={() => setShowAbout(true)}
            >
              About
            </button>
            <button 
              className="btn btn-primary" 
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              onClick={() => setShowFeedback(true)}
            >
              Feedback
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content with top padding for navbar */}
      <div className="main-content" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div className="container main-container" style={{ 
          maxWidth: '100%', 
          margin: '0 auto', 
          position: 'relative', 
          zIndex: 1 
        }}>

        <SearchForm 
          onSearch={handleSearch}
          onBulkSearch={handleBulkSearch}
          isLoading={isLoading}
        />

        {/* Card Details and Filters Section */}
        {selectedCard && (
          <div className="card-details-filters-layout" style={{ 
            display: 'flex', 
            gap: '24px', 
            alignItems: 'flex-start',
            marginBottom: '16px',
            background: 'var(--bg-tertiary)', 
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid var(--md-outline-variant)',
          }}>
            {/* Left Column: Card Details */}
            <div className="card-details-column" style={{ flex: 1 }}>
              {selectedCard.layout === 'transform' ? (
                <div className="dual-card-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  {/* Card Images for Dual-Sided Cards */}
                  <div className="dual-card-images" style={{ flexShrink: 0 }}>
                    <div className="dual-card-images-container" style={{ display: 'flex', gap: '12px' }}>
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
                <div className="card-details-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  {/* Card Image for Single-Sided Cards */}
                  <div className="card-image-container" style={{ flexShrink: 0, textAlign: 'center' }}>
                    {selectedCard.image_uris?.large ? (
                      <img
                        src={selectedCard.image_uris.large}
                        alt={selectedCard.name}
                        className="card-image"
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
                        className="card-image-placeholder"
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
                          <div style={{ fontSize: '0.875rem' }}>Image not available</div>
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

            {/* Right Column: Filters */}
            <div className="filters-column" style={{ 
              flexShrink: 0,
              width: '300px',
              background: 'var(--md-surface-container)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--md-outline-variant)',
            }}>
              {setFilters.length > 0 ? (
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
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🔍</div>
                  <div style={{ fontSize: '0.9rem' }}>Search for a card to see filters</div>
                </div>
              )}
            </div>
          </div>
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
          <div className="simple-results" style={{ marginTop: '0' }}>
            <div className="results-list">
              {['core', 'expansion', 'masters', 'commander', 'secret_lair', 'masterpiece', 'universes_beyond', 'other'].map(category => {
                const categoryResults = filteredResults.filter(result => 
                  result.sets.some(set => mtgApiService.categorizeSetType(set.set_type, set.set) === category)
                );
                
                // Skip categories with no results
                if (categoryResults.length === 0) {
                  return null;
                }
                
                return (
                  <div key={category} className="category-section">
                    {/* Set Type Banner */}
                    <div className="set-type-banner" style={{
                      background: 'var(--md-primary-container)',
                      color: 'var(--md-on-primary-container)',
                      padding: '12px 16px',
                      borderRadius: '12px 12px 0 0',
                      borderBottom: 'none',
                      marginBottom: '0',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className={`ss ss-${category === 'universes_beyond' ? 'ub' : category === 'secret_lair' ? 'sl' : category}`} style={{
                        fontSize: '1.3em'
                      }}></i>
                      {category.replace('_', ' ')}
                    </div>
                    <div className="category-results" style={{
                      background: 'var(--bg-tertiary)',
                      borderRadius: '0 0 12px 12px',
                      padding: '16px',
                      border: '1px solid var(--md-outline-variant)',
                      borderTop: 'none',
                      marginTop: '0',
                      gap: '0 !important'
                    }}>
                                              {categoryResults.map((result, index) => (
                          <div key={`${result.card.name}-${category}-${index}`} className="result-item">
                          <div className="result-sets">
                            {result.sets
                              .filter(set => mtgApiService.categorizeSetType(set.set_type, set.set) === category)
                              .map((set, setIndex) => (
                                <div key={set.id} className="set-item">
                                  <div className="set-content">
                                    <div className="set-header">
                                      <span className="set-name">
                                        <i className={`ss ss-${set.set.toLowerCase()}`} style={{
                                          fontSize: '1.2em',
                                          marginRight: '8px',
                                          color: 'var(--text-secondary)'
                                        }}></i>
                                        {set.set_name}
                                      </span>
                                    </div>
                                    {showImages && (
                                      <div className="set-image">
                                        {set.image_uris?.normal ? (
                                          <img
                                            src={set.image_uris.normal}
                                            alt={`${result.card.name} from ${set.set_name}`}
                                            className="card-image"
                                          />
                                        ) : (
                                          <div className="image-placeholder">
                                            🃏
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    <div className="set-footer">
                                      <div className="set-code">{set.set}</div>
                                      <div className={`rarity rarity-${set.rarity.toLowerCase()}`}>{set.rarity}</div>
                                      <div className="card-number">{set.collector_number}</div>
                                      <div className="price-tcgplayer">
                                        <span className="set-price">${getDisplayPrice(set.prices)}</span>
                                        {set.tcgplayer_id && (
                                          <a 
                                            href={`https://www.tcgplayer.com/product/${set.tcgplayer_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="tcgplayer-link"
                                            title="View on TCGPlayer"
                                          >
                                            <img 
                                              src={tcgplayerIcon} 
                                              alt="TCGPlayer" 
                                              className="tcgplayer-icon"
                                            />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
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

      {/* Feedback Modal */}
      {showFeedback && (
        <Feedback onClose={() => setShowFeedback(false)} />
      )}

      {/* About Modal */}
      {showAbout && (
        <About onClose={() => setShowAbout(false)} />
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <Privacy onClose={() => setShowPrivacy(false)} />
      )}

      {/* Terms Modal */}
      {showTerms && (
        <Terms onClose={() => setShowTerms(false)} />
      )}

      {/* Fixed Footer */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--md-surface-container-high)',
        borderTop: '1px solid var(--md-outline-variant)',
        padding: '12px 16px',
        zIndex: 1000,
        boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
      }}>
        <div className="footer-content" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ color: 'var(--md-on-surface-variant)' }}>
              Powered by Scryfall API & TCGPlayer (no affiliation)
            </span>
          </div>
          
          <div className="footer-links" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowPrivacy(true)}
            style={{ 
              background: 'none',
              border: 'none',
              color: 'var(--md-on-surface-variant)', 
              cursor: 'pointer',
              textDecoration: 'none',
              fontSize: 'inherit',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--md-on-surface)'}
          >
            Privacy
          </button>
          <button
            onClick={() => setShowTerms(true)}
            style={{ 
              background: 'none',
              border: 'none',
              color: 'var(--md-on-surface-variant)', 
              cursor: 'pointer',
              textDecoration: 'none',
              fontSize: 'inherit',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--md-on-surface)'}
          >
            Terms
          </button>
            <a href="https://github.com/Ma77h3hac83r/MTG-Card-Forge" target="_blank" rel="noopener noreferrer" style={{ 
              color: 'var(--md-on-surface-variant)', 
              textDecoration: 'none',
            }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--md-on-surface)'}>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App; 