import React from 'react';

export const renderTextWithManaSymbols = (text: string, fontSize: string = '0.85em') => {
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

export const renderSagaOracleText = (oracleText: string) => {
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
              <i key={chapterIndex} className={`ms ms-saga ms-saga-${chapterNum}`} style={{fontSize: '1.4em', marginTop: '2px'}}/>
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

export const renderPlaneswalkerAbilities = (oracleText: string) => {
  if (!oracleText) return null;
  
  const abilities = oracleText.split('\n').filter(ability => ability.trim());
  
  return abilities.map((ability, index) => {
    const loyaltyMatch = ability.match(/^([+−]?\d+)[:—]\s*(.+)$/);
    
    if (loyaltyMatch) {
      const [, loyaltyCost, abilityText] = loyaltyMatch;
      const isPositive = loyaltyCost.startsWith('+');
      const isNegative = loyaltyCost.startsWith('−');
      const number = loyaltyCost.replace(/[+−]/, '');
      
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
    
    return (
      <div key={index} style={{ marginBottom: '8px' }}>
        {renderTextWithManaSymbols(ability)}
      </div>
    );
  });
};

export const renderCardFace = (cardFace: any, faceIndex: number, isDualSided: boolean = false) => {
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
      
      <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '8px' }}>
        {cardFace.type_line || 'Unknown Type'}
      </div>
      
      {cardFace.oracle_text && cardFace.type_line && !cardFace.type_line.toLowerCase().includes('planeswalker') && !cardFace.type_line.toLowerCase().includes('saga') && (
        <div style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '8px', whiteSpace: 'pre-line' }}>
          {renderTextWithManaSymbols(cardFace.oracle_text)}
        </div>
      )}
      
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
      
      {(cardFace.power || cardFace.toughness) && (
        <div style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '8px', fontWeight: '600' }}>
          {cardFace.power}/{cardFace.toughness}
        </div>
      )}
    </div>
  );
};

export const renderDualSidedCard = (card: any) => {
  if (!card.card_faces || card.card_faces.length < 2) {
    return null;
  }

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {card.card_faces.map((face: any, index: number) => 
        <div key={index} style={{ flex: 1 }}>
          {renderCardFace(face, index, true)}
        </div>
      )}
    </div>
  );
};

export const getDisplayPrice = (prices: any): string => {
  if (prices?.usd && prices.usd !== 'null') {
    return prices.usd;
  }
  if (prices?.usd_etched && prices.usd_etched !== 'null') {
    return prices.usd_etched;
  }
  if (prices?.usd_foil && prices.usd_foil !== 'null') {
    return prices.usd_foil;
  }
  return 'N/A';
}; 