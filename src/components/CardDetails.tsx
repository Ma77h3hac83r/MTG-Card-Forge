import React from 'react';
import { MTGCard } from '../types';
import { renderTextWithManaSymbols, renderPlaneswalkerAbilities, renderSagaOracleText, renderDualSidedCard } from '../utils/cardRenderers';
import { appStyles } from '../styles/appStyles';

interface CardDetailsProps {
  selectedCard: MTGCard;
}

const CardDetails: React.FC<CardDetailsProps> = ({ selectedCard }) => {
  return (
    <div style={appStyles.cardDetailsColumn}>
      {selectedCard.layout === 'transform' ? (
        <div style={appStyles.dualCardLayout}>
          {/* Card Images for Dual-Sided Cards */}
          <div style={appStyles.dualCardImages}>
            <div style={appStyles.dualCardImagesContainer}>
              {selectedCard.card_faces?.map((face, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  {face.image_uris?.normal ? (
                    <img
                      src={face.image_uris.normal}
                      alt={`${face.name} - ${index === 0 ? 'Front' : 'Back'}`}
                      style={appStyles.cardImage}
                    />
                  ) : (
                    <div style={appStyles.cardImagePlaceholder}>
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
        <div style={appStyles.cardDetailsLayout}>
          {/* Card Image for Single-Sided Cards */}
          <div style={appStyles.cardImageContainer}>
            {selectedCard.image_uris?.normal ? (
              <img
                src={selectedCard.image_uris.normal}
                alt={selectedCard.name}
                style={appStyles.cardImage}
              />
            ) : (
              <div style={appStyles.cardImagePlaceholder}>
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
            <div style={appStyles.cardNameRow}>
              <div style={appStyles.cardName}>
                {selectedCard.name}
              </div>
              {selectedCard.mana_cost && (
                <div style={appStyles.manaCost}>
                  {renderTextWithManaSymbols(selectedCard.mana_cost, '1.5em')}
                </div>
              )}
            </div>
            
            {/* Line 2: Card Type */}
            <div style={appStyles.cardType}>
              {selectedCard.type_line || 'Unknown Type'}
            </div>
            
            {/* Line 3: Description (Oracle Text only, no flavor text) */}
            {selectedCard.oracle_text && selectedCard.type_line && !selectedCard.type_line.toLowerCase().includes('planeswalker') && !selectedCard.type_line.toLowerCase().includes('saga') && (
              <div style={appStyles.cardText}>
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
              <div style={appStyles.powerToughness}>
                {selectedCard.power}/{selectedCard.toughness}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Line 5: Format Legalities */}
      {selectedCard.legalities && (
        <div style={appStyles.legalitiesContainer}>
          <div style={appStyles.legalitiesTitle}>
            Format Legalities:
          </div>
          <div style={appStyles.legalitiesList}>
            {Object.entries(selectedCard.legalities).map(([format, legality]) => (
              <span
                key={format}
                style={appStyles.legalityBadge(legality)}
              >
                {format}: {legality}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDetails; 