import React from 'react';
import { Filter } from 'lucide-react';
import { SetFilter as SetFilterType, CardResult } from '../types';
import { mtgApiService } from '../services/mtgApi';

interface SetFilterProps {
  filters: SetFilterType[];
  onFilterChange: (filterId: string, enabled: boolean) => void;
  onToggleAll: (enabled: boolean) => void;
  searchResults: CardResult[];
  // Additional filter props
  sortOption: string;
  onSortChange: (value: string) => void;
  frameFilter: string;
  onFrameFilterChange: (value: string) => void;
  borderFilter: string;
  onBorderFilterChange: (value: string) => void;
  foilFilter: string;
  onFoilFilterChange: (value: string) => void;
  showImages: boolean;
  onShowImagesChange: (value: boolean) => void;
  bulkMode: boolean;
  selectedBulkCard: string;
  onBulkCardChange: (value: string) => void;
  filteredResults: CardResult[];
}

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: Lowest to Highest' },
  { value: 'price-desc', label: 'Price: Highest to Lowest' },
  { value: 'newest', label: 'Newest to Oldest' },
  { value: 'oldest', label: 'Oldest to Newest' },
  { value: 'alpha', label: 'Alphabetical (A-Z)' },
];

const FRAME_OPTIONS = [
  { value: '', label: 'All Frames' },
  { value: '1993', label: '1993' },
  { value: '1997', label: '1997' },
  { value: '2003', label: '2003' },
  { value: '2015', label: '2015' },
  { value: 'future', label: 'Future' },
];

const BORDER_OPTIONS = [
  { value: '', label: 'All Borders' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'borderless', label: 'Full Art' },
];

const FOIL_OPTIONS = [
  { value: '', label: 'All Versions' },
  { value: 'nonfoil', label: 'Non-Foil' },
  { value: 'foil', label: 'Foil' },
];

const SetFilter: React.FC<SetFilterProps> = ({ 
  filters, 
  onFilterChange, 
  onToggleAll, 
  searchResults,
  sortOption,
  onSortChange,
  frameFilter,
  onFrameFilterChange,
  borderFilter,
  onBorderFilterChange,
  foilFilter,
  onFoilFilterChange,
  showImages,
  onShowImagesChange,
  bulkMode,
  selectedBulkCard,
  onBulkCardChange,
  filteredResults
}) => {
  const categoriesWithCards = new Set<string>();
  searchResults.forEach(result => {
    result.sets.forEach(set => {
      const category = mtgApiService.categorizeSetType(set.set_type, set.set);
      categoriesWithCards.add(category);
    });
  });

  // Sort filters in the desired order: Core, Expansion, Masters, Commander, Secret Lair, Masterpiece, Universes Beyond, Others
  const sortedFilters = [...filters].sort((a, b) => {
    const order = ['core', 'expansion', 'masters', 'commander', 'secret_lair', 'masterpiece', 'universes_beyond', 'other'];
    return order.indexOf(a.type) - order.indexOf(b.type);
  });

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Filter size={20} />
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Filters & Options</h3>
      </div>

      {/* First Row: Set Types Filter (all 8 in 1 row) */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)', fontSize: '1rem' }}><b>Set Types</b></h4>
        <div className="set-types-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          alignItems: 'center',
        }}>
          {sortedFilters.map((filter) => {
            const hasCards = categoriesWithCards.has(filter.type);
            const isGreyedOut = !hasCards;
            return (
              <label
                key={filter.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: isGreyedOut ? 'not-allowed' : 'pointer',
                  opacity: isGreyedOut ? 0.5 : 1,
                  fontSize: '0.85rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={filter.enabled}
                  onChange={(e) => onFilterChange(filter.id, e.target.checked)}
                  disabled={isGreyedOut}
                  style={{
                    width: '16px',
                    height: '16px',
                    margin: 0,
                  }}
                />
                {filter.name}
              </label>
            );
          })}
        </div>
      </div>

      {/* Dividing Line */}
      <div style={{
        height: '1px',
        background: 'var(--border-color)',
        margin: '8px 0',
      }} />

      {/* Second Row: Frame and Border selection (as checkboxes) */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)', fontSize: '1rem' }}><b>Frames, Borders, and Foils</b></h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {/* Frame Options */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
          }}>
            {FRAME_OPTIONS.map((option) => (
              <label
                key={`frame-${option.value}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={frameFilter === option.value}
                  onChange={(e) => onFrameFilterChange(e.target.checked ? option.value : '')}
                  style={{
                    width: '16px',
                    height: '16px',
                    margin: 0,
                  }}
                />
                {option.label}
              </label>
            ))}
          </div>
          
          {/* Dividing Line */}
          <div style={{
            height: '1px',
            background: 'var(--border-color)',
            margin: '8px 0',
          }} />
          
          {/* Border Options */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
          }}>
            {BORDER_OPTIONS.map((option) => (
              <label
                key={`border-${option.value}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={borderFilter === option.value}
                  onChange={(e) => onBorderFilterChange(e.target.checked ? option.value : '')}
                  style={{
                    width: '16px',
                    height: '16px',
                    margin: 0,
                  }}
                />
                {option.label}
              </label>
            ))}
          </div>
          
          {/* Dividing Line */}
          <div style={{
            height: '1px',
            background: 'var(--border-color)',
            margin: '8px 0',
          }} />
          
          {/* Foil Options */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
          }}>
            {FOIL_OPTIONS.map((option) => (
              <label
                key={`foil-${option.value}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={foilFilter === option.value}
                  onChange={(e) => onFoilFilterChange(e.target.checked ? option.value : '')}
                  style={{
                    width: '16px',
                    height: '16px',
                    margin: 0,
                  }}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Dividing Line */}
      <div style={{
        height: '1px',
        background: 'var(--border-color)',
        margin: '8px 0',
      }} />

      {/* Third Row: Show card images */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)', fontSize: '1rem' }}><b>Display Options</b></h4>
        <div>
          <label htmlFor="toggle-images" style={{ color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              id="toggle-images"
              type="checkbox"
              checked={showImages}
              onChange={e => onShowImagesChange(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Show Card Images
          </label>
        </div>
      </div>

      {/* Dividing Line */}
        <div style={{
          height: '1px',
    background: 'var(--md-outline-variant)',
    margin: '8px 0',
  }} />

      {/* Fourth Row: Sort Cards and Select Card */}
      <div className="sort-bulk-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        alignItems: 'center',
      }}>
        {/* Sort Cards */}
        {filteredResults.length > 0 && (
          <div>
            <label htmlFor="sort-cards" style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>Sort Cards:</label>
            <select
              id="sort-cards"
              value={sortOption}
              onChange={e => onSortChange(e.target.value)}
              style={{ 
                padding: '6px 12px', 
                borderRadius: '6px', 
                border: '1px solid var(--border-color)', 
                background: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                fontWeight: 500,
                width: '100%',
                marginTop: '4px'
              }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Bulk Card Select */}
        {bulkMode && searchResults.length > 1 && (
          <div>
            <label htmlFor="bulk-card-select" style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>Select Card:</label>
            <select
              id="bulk-card-select"
              value={selectedBulkCard}
              onChange={e => onBulkCardChange(e.target.value)}
              style={{ 
                padding: '6px 12px', 
                borderRadius: '6px', 
                border: '1px solid var(--border-color)', 
                background: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                fontWeight: 500,
                width: '100%',
                marginTop: '4px'
              }}
            >
              {searchResults.map(result => (
                <option key={result.card.name} value={result.card.name}>{result.card.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetFilter; 