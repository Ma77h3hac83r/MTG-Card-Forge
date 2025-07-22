import React from 'react';
import { CardResult as CardResultType } from '../types';
import { mtgApiService } from '../services/mtgApi';
import { getDisplayPrice } from '../utils/cardRenderers';
import { appStyles } from '../styles/appStyles';
import tcgplayerIcon from '../images/tcgplayer_icon.svg';

interface SearchResultsProps {
  filteredResults: CardResultType[];
  showImages: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ filteredResults, showImages }) => {
  return (
    <div style={appStyles.simpleResults}>
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
              <div style={appStyles.setTypeBanner}>
                <i className={`ss ss-${category === 'universes_beyond' ? 'ub' : category === 'secret_lair' ? 'sl' : category}`} style={{
                  fontSize: '1.3em'
                }}></i>
                {category.replace('_', ' ')}
              </div>
              <div style={appStyles.categoryResults}>
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
  );
};

export default SearchResults; 