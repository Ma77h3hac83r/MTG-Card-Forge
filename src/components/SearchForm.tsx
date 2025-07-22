import React, { useState, useEffect, useRef } from 'react';
import { Search, Upload, X, BookOpen } from 'lucide-react';
import { createPortal } from 'react-dom';
import { mtgApiService } from '../services/mtgApi';

interface SearchFormProps {
  onSearch: (query: string) => void;
  onBulkSearch: (cards: string[]) => void;
  onSetSearch: (setCode: string) => void;
  isLoading: boolean;
}

interface AutocompleteOption {
  name: string;
  type_line?: string;
}

interface SetOption {
  code: string;
  name: string;
  released_at?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, onBulkSearch, onSetSearch, isLoading }) => {
  const [searchMode, setSearchMode] = useState<'single' | 'bulk' | 'set'>('single');
  const [singleQuery, setSingleQuery] = useState('');
  const [bulkQuery, setBulkQuery] = useState('');
  const [bulkCards, setBulkCards] = useState<string[]>([]);
  const [setQuery, setSetQuery] = useState('');
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutocompleteOption[]>([]);
  const [setOptions, setSetOptions] = useState<SetOption[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showSetAutocomplete, setShowSetAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedSetIndex, setSelectedSetIndex] = useState(-1);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const setAutocompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setInputRef = useRef<HTMLInputElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [setDropdownStyleState, setSetDropdownStyle] = useState<React.CSSProperties>({});

  const handleSingleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (singleQuery.trim()) {
      onSearch(singleQuery.trim());
      setShowAutocomplete(false);
    }
  };

  const handleSetSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (setQuery.trim()) {
      onSetSearch(setQuery.trim());
      setShowSetAutocomplete(false);
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

  const handleSetQueryChange = async (value: string) => {
    setSetQuery(value);
    setSelectedSetIndex(-1);
    
    if (value.length >= 2) {
      try {
        const sets = await mtgApiService.searchSets(value);
        const options = sets.slice(0, 5).map((set: any) => ({
          code: set.code,
          name: set.name,
          released_at: set.released_at
        }));
        setSetOptions(options);
        setShowSetAutocomplete(options.length > 0);
      } catch (error) {
        setSetOptions([]);
        setShowSetAutocomplete(false);
      }
    } else {
      setSetOptions([]);
      setShowSetAutocomplete(false);
    }
  };

  const handleAutocompleteSelect = (option: AutocompleteOption) => {
    setSingleQuery(option.name);
    setShowAutocomplete(false);
    onSearch(option.name);
  };

  const handleSetAutocompleteSelect = (option: SetOption) => {
    setSetQuery(option.code);
    setShowSetAutocomplete(false);
    onSetSearch(option.code);
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

  const handleSetKeyDown = (e: React.KeyboardEvent) => {
    if (!showSetAutocomplete) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSetIndex(prev => 
          prev < setOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSetIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSetIndex >= 0 && setOptions[selectedSetIndex]) {
          handleSetAutocompleteSelect(setOptions[selectedSetIndex]);
        } else {
          handleSetSearch(e as any);
        }
        break;
      case 'Escape':
        setShowSetAutocomplete(false);
        setSelectedSetIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
      if (setAutocompleteRef.current && !setAutocompleteRef.current.contains(event.target as Node)) {
        setShowSetAutocomplete(false);
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

  useEffect(() => {
    if (showSetAutocomplete && setInputRef.current) {
      const rect = setInputRef.current.getBoundingClientRect();
      setSetDropdownStyle({
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
  }, [showSetAutocomplete, setOptions]);

  const handleBulkSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkCards.length > 0) {
      onBulkSearch(bulkCards);
    }
  };

  const cleanCardName = (cardText: string): string => {
    let cleaned = cardText.trim();
    
    // Remove count numbers at the beginning (e.g., "1 ", "2x ", "3 ", "4x")
    cleaned = cleaned.replace(/^\d+x?\s*/, '');
    
    // Find the card name by looking for the pattern: name (set) number foiling
    // This regex captures the card name and ignores everything after the set code
    const cardNameMatch = cleaned.match(/^(.+?)\s*\([A-Z0-9]{2,4}\)/);
    if (cardNameMatch) {
      // If we find a set code pattern, extract just the card name
      cleaned = cardNameMatch[1].trim();
    } else {
      // If no set code pattern, remove common suffixes
      // Remove foiling indicators (e.g., "*F*", "*Foil*", "F", "Foil")
      cleaned = cleaned.replace(/\s*\*F\*\s*$/gi, '');
      cleaned = cleaned.replace(/\s*\*Foil\*\s*$/gi, '');
      cleaned = cleaned.replace(/\s*F\s*$/gi, '');
      cleaned = cleaned.replace(/\s*Foil\s*$/gi, '');
      
      // Remove card numbers at the end (e.g., "420", "001")
      cleaned = cleaned.replace(/\s*\d{1,4}\s*$/g, '');
      
      // Remove "123/456" format numbers
      cleaned = cleaned.replace(/\s*\d+\/\d+\s*$/g, '');
    }
    
    // Clean up extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  };

  const handleBulkInput = (value: string) => {
    setBulkQuery(value);
    const cards = value
      .split('\n')
      .map(card => cleanCardName(card))
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
          <button
            type="button"
            className={`btn ${searchMode === 'set' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSearchMode('set')}
          >
            <BookOpen size={16} />
            Set Search
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
      ) : searchMode === 'bulk' ? (
        <form onSubmit={handleBulkSearch}>
          <div style={{ marginBottom: '16px' }}>
            <textarea
              className="input"
              placeholder="Enter card names, one per line:&#10;Lightning Bolt&#10;2x Black Lotus (FIN) 328 *F*&#10;Counterspell&#10;3x Sol Ring (SLD) 001 Foil"
              value={bulkQuery}
              onChange={(e) => handleBulkInput(e.target.value)}
              rows={6}
              disabled={isLoading}
              style={{ resize: 'vertical' }}
            />
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginTop: '8px',
              fontStyle: 'italic',
            }}>
              Automatically removes: counts (2x), set codes (FIN), card numbers (328), and foiling (*F*)
            </div>
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
      ) : (
        <form onSubmit={handleSetSearch}>
          <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                ref={setInputRef}
                type="text"
                className="input"
                placeholder="Enter set code or name (e.g., NEO, Kamigawa: Neon Dynasty)"
                value={setQuery}
                onChange={(e) => handleSetQueryChange(e.target.value)}
                onKeyDown={handleSetKeyDown}
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !setQuery.trim()}
            >
              {isLoading ? 'Searching...' : 'Search Set'}
            </button>
          </div>
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

      {/* Portal for set autocomplete dropdown */}
      {showSetAutocomplete && setOptions.length > 0 && setInputRef.current && createPortal(
        <div
          ref={setAutocompleteRef}
          style={setDropdownStyleState}
        >
          {setOptions.map((option, index) => (
            <div
              key={option.code}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: index < setOptions.length - 1 ? '1px solid var(--border-color)' : 'none',
                background: index === selectedSetIndex ? 'var(--bg-tertiary)' : 'transparent',
                color: 'var(--text-primary)',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={() => setSelectedSetIndex(index)}
              onClick={() => handleSetAutocompleteSelect(option)}
            >
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                {option.code} - {option.name}
              </div>
              {option.released_at && (
                <div style={{ 
                  fontSize: '12px', 
                  color: 'var(--text-secondary)',
                }}>
                  Released: {new Date(option.released_at).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default SearchForm; 