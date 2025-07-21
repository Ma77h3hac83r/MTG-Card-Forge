import React, { useState, useEffect, useRef } from 'react';
import { Search, Upload, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { mtgApiService } from '../services/mtgApi';

interface SearchFormProps {
  onSearch: (query: string) => void;
  onBulkSearch: (cards: string[]) => void;
  isLoading: boolean;
}

interface AutocompleteOption {
  name: string;
  type_line?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, onBulkSearch, isLoading }) => {
  const [searchMode, setSearchMode] = useState<'single' | 'bulk'>('single');
  const [singleQuery, setSingleQuery] = useState('');
  const [bulkQuery, setBulkQuery] = useState('');
  const [bulkCards, setBulkCards] = useState<string[]>([]);
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutocompleteOption[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const handleSingleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (singleQuery.trim()) {
      onSearch(singleQuery.trim());
      setShowAutocomplete(false);
    }
  };

  const handleSingleQueryChange = async (value: string) => {
    setSingleQuery(value);
    setSelectedIndex(-1);
    
    if (value.length >= 2) {
      try {
        const cards = await mtgApiService.searchCards(value);
        const options = cards.slice(0, 5).map(card => ({
          name: card.name,
          type_line: card.type_line || ''
        }));
        setAutocompleteOptions(options);
        setShowAutocomplete(options.length > 0);
      } catch (error) {
        setAutocompleteOptions([]);
        setShowAutocomplete(false);
      }
    } else {
      setAutocompleteOptions([]);
      setShowAutocomplete(false);
    }
  };

  const handleAutocompleteSelect = (option: AutocompleteOption) => {
    setSingleQuery(option.name);
    setShowAutocomplete(false);
    onSearch(option.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showAutocomplete) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < autocompleteOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && autocompleteOptions[selectedIndex]) {
          handleAutocompleteSelect(autocompleteOptions[selectedIndex]);
        } else {
          handleSingleSearch(e as any);
        }
        break;
      case 'Escape':
        setShowAutocomplete(false);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showAutocomplete && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'absolute',
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        maxHeight: '300px',
        overflowY: 'auto',
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      });
    }
  }, [showAutocomplete, autocompleteOptions]);

  const handleBulkSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkCards.length > 0) {
      onBulkSearch(bulkCards);
    }
  };

  const handleBulkInput = (value: string) => {
    setBulkQuery(value);
    const cards = value
      .split('\n')
      .map(card => card.trim())
      .filter(card => card.length > 0);
    setBulkCards(cards);
  };

  const removeCard = (index: number) => {
    const newCards = bulkCards.filter((_, i) => i !== index);
    setBulkCards(newCards);
    setBulkQuery(newCards.join('\n'));
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <button
            type="button"
            className={`btn ${searchMode === 'single' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSearchMode('single')}
          >
            <Search size={16} />
            Single Card
          </button>
          <button
            type="button"
            className={`btn ${searchMode === 'bulk' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSearchMode('bulk')}
          >
            <Upload size={16} />
            Bulk Import
          </button>
        </div>
      </div>

      {searchMode === 'single' ? (
        <form onSubmit={handleSingleSearch}>
          <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                ref={inputRef}
                type="text"
                className="input"
                placeholder="Enter card name (e.g., Lightning Bolt, Black Lotus)"
                value={singleQuery}
                onChange={(e) => handleSingleQueryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !singleQuery.trim()}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleBulkSearch}>
          <div style={{ marginBottom: '16px' }}>
            <textarea
              className="input"
              placeholder="Enter card names, one per line:&#10;Lightning Bolt&#10;Black Lotus&#10;Counterspell"
              value={bulkQuery}
              onChange={(e) => handleBulkInput(e.target.value)}
              rows={6}
              disabled={isLoading}
              style={{ resize: 'vertical' }}
            />
          </div>
          
          {bulkCards.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Cards to search ({bulkCards.length}):
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {bulkCards.map((card, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'var(--bg-tertiary)',
                      padding: '4px 8px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {card}
                    <button
                      type="button"
                      onClick={() => removeCard(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || bulkCards.length === 0}
          >
            {isLoading ? 'Searching...' : `Search ${bulkCards.length} Cards`}
          </button>
        </form>
      )}
      {/* Portal for autocomplete dropdown */}
      {showAutocomplete && autocompleteOptions.length > 0 && inputRef.current && createPortal(
        <div
          ref={autocompleteRef}
          style={dropdownStyle}
        >
          {autocompleteOptions.map((option, index) => (
            <div
              key={option.name}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: index < autocompleteOptions.length - 1 ? '1px solid var(--border-color)' : 'none',
                background: index === selectedIndex ? 'var(--bg-tertiary)' : 'transparent',
                color: 'var(--text-primary)',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => handleAutocompleteSelect(option)}
            >
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                {option.name}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}>
                {option.type_line}
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default SearchForm; 