import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import SetFilter from './components/SetFilter';
import Feedback from './components/Feedback';
import About from './components/About';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import CardDetails from './components/CardDetails';
import BulkCardList from './components/BulkCardList';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import SetSearchResults from './components/SetSearchResults';
import { SetFilter as SetFilterType, CardResult as CardResultType } from './types';
import { mtgApiService } from './services/mtgApi';
import { initializeFilters, searchCards, bulkSearchCards, searchCardsBySet, filterResults } from './utils/searchUtils';
import { appStyles } from './styles/appStyles';

const App: React.FC = () => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<CardResultType[]>([]);
  const [setFilters, setSetFilters] = useState<SetFilterType[]>([]);
  const [error, setError] = useState<string>('');
  const [sortOption, setSortOption] = useState('price-asc');
  const [bulkMode, setBulkMode] = useState(false);
  const [setMode, setSetMode] = useState(false);
  const [selectedBulkCard, setSelectedBulkCard] = useState<string>('');
  const [frameFilter, setFrameFilter] = useState('');
  const [borderFilter, setBorderFilter] = useState('');
  const [foilFilter, setFoilFilter] = useState('');
  const [showImages, setShowImages] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Initialize filters on component mount
  useEffect(() => {
    const loadFilters = async () => {
      const filters = await initializeFilters();
      setSetFilters(filters);
    };
    loadFilters();
  }, []);

  // Event handlers
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError('');
    setBulkMode(false);
    setSetMode(false);
    setSelectedBulkCard('');
    
    try {
      const results = await searchCards(query);
      if (results.length === 0) {
        setError('No cards found with that name.');
        setSearchResults([]);
        return;
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
    setSetMode(false);
    
    try {
      const results = await bulkSearchCards(cardNames);
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

  const handleSetSearch = async (setCode: string) => {
    setIsLoading(true);
    setError('');
    setBulkMode(false);
    setSetMode(true);
    setSelectedBulkCard('');
    
    try {
      const results = await searchCardsBySet(setCode);
      if (results.length === 0) {
        setError('No cards found in that set.');
        setSearchResults([]);
        setSetMode(false);
        return;
      }
      setSearchResults(results);
    } catch (error) {
      setError('Failed to search for cards in that set. Please try again.');
      setSearchResults([]);
      setSetMode(false);
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

  // Computed values
  const filteredResults = filterResults(
    searchResults,
    setFilters,
    sortOption,
    frameFilter,
    borderFilter,
    foilFilter,
    bulkMode,
    selectedBulkCard
  );

  const selectedCard = searchResults.length > 0 ? 
    mtgApiService.getMostRecentPrinting(searchResults[0].sets) : null;

  return (
    <div style={appStyles.mainContainer}>
      <Navbar 
        onAboutClick={() => setShowAbout(true)}
        onFeedbackClick={() => setShowFeedback(true)}
      />

      <div className="main-content" style={appStyles.mainContent}>
        <div className="container main-container" style={appStyles.container}>
          <SearchForm 
            onSearch={handleSearch}
            onBulkSearch={handleBulkSearch}
            onSetSearch={handleSetSearch}
            isLoading={isLoading}
          />

          {/* Card Details and Filters Section */}
          {selectedCard && !bulkMode && !setMode && (
            <div style={appStyles.cardDetailsFiltersLayout}>
              {/* Left Column: Filters */}
              <div style={appStyles.filtersColumn}>
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

              {/* Right Column: Card Details */}
              <CardDetails selectedCard={selectedCard} />
            </div>
          )}

          {/* Bulk Import Layout */}
          {bulkMode && searchResults.length > 0 && (
            <div style={appStyles.cardDetailsFiltersLayout}>
              {/* Left Column: Filters */}
              <div style={appStyles.filtersColumn}>
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

              {/* Right Column: Bulk Card List */}
              <BulkCardList
                searchResults={searchResults}
                selectedBulkCard={selectedBulkCard}
                onBulkCardChange={setSelectedBulkCard}
              />
            </div>
          )}

          {/* Set Search Layout */}
          {setMode && searchResults.length > 0 && (
            <div style={appStyles.cardDetailsFiltersLayout}>
              {/* Left Column: Filters */}
              <div style={appStyles.filtersColumn}>
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

              {/* Right Column: Set Search Summary */}
              <div style={{
                background: 'var(--md-surface-container)',
                border: '1px solid var(--md-outline-variant)',
                borderRadius: '16px',
                padding: '20px',
                height: 'fit-content',
                minHeight: '400px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                }}>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
                    Set Search Results
                  </h3>
                </div>

                <div style={{
                  padding: '16px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                  }}>
                    <strong>Total Cards Found:</strong> {searchResults.length}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                  }}>
                    <strong>Filtered Results:</strong> {filteredResults.length}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                  }}>
                    <strong>Images:</strong> {showImages ? 'Shown' : 'Hidden'}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                  }}>
                    <strong>Includes:</strong> Main set + Commander + Supplemental sets
                  </div>
                </div>

                <div style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                    Instructions:
                  </div>
                  <div>
                    Use the filters on the left to narrow down the results. All cards from the main set, commander sets, and supplemental sets are displayed together in a unified grid below.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {error && (
            <div className="card" style={appStyles.errorCard}>
              <div style={appStyles.errorText}>
                {error}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="card" style={appStyles.loadingCard}>
              <div style={appStyles.loadingText}>
                Searching for cards...
              </div>
            </div>
          )}

          {/* Search Results */}
          {filteredResults.length > 0 && !setMode && (
            <SearchResults 
              filteredResults={filteredResults}
              showImages={showImages}
            />
          )}

          {/* Set Search Results */}
          {filteredResults.length > 0 && setMode && (
            <SetSearchResults 
              filteredResults={filteredResults}
              showImages={showImages}
            />
          )}

          {/* Empty State */}
          {!isLoading && !error && searchResults.length === 0 && (
            <div className="card" style={appStyles.emptyStateCard}>
              <div style={appStyles.emptyStateIcon}>🃏</div>
              <h3 style={appStyles.emptyStateTitle}>
                Ready to Search
              </h3>
              <p style={appStyles.emptyStateText}>
                Search for a single card, import multiple cards in bulk, or browse cards by set.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showFeedback && (
        <Feedback onClose={() => setShowFeedback(false)} />
      )}

      {showAbout && (
        <About onClose={() => setShowAbout(false)} />
      )}

      {showPrivacy && (
        <Privacy onClose={() => setShowPrivacy(false)} />
      )}

      {showTerms && (
        <Terms onClose={() => setShowTerms(false)} />
      )}

      <Footer 
        onPrivacyClick={() => setShowPrivacy(true)}
        onTermsClick={() => setShowTerms(true)}
      />
    </div>
  );
};

export default App; 