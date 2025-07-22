import { MTGCard, SetFilter as SetFilterType, CardResult as CardResultType } from '../types';
import { mtgApiService } from '../services/mtgApi';
import { getDisplayPrice } from './cardRenderers';

export const initializeFilters = async (): Promise<SetFilterType[]> => {
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
    
    return filters;
  } catch (error) {
    console.error('Failed to initialize filters:', error);
    return [];
  }
};

export const searchCards = async (query: string): Promise<CardResultType[]> => {
  const cards = await mtgApiService.getCardByName(query);
  if (cards.length === 0) {
    return [];
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

  return results;
};

export const bulkSearchCards = async (cardNames: string[]): Promise<CardResultType[]> => {
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

  return results;
};

export const searchCardsBySet = async (setCode: string): Promise<CardResultType[]> => {
  try {
    // Get all related sets (main set + commander + supplemental)
    const relatedSets = await mtgApiService.getRelatedSets(setCode);
    
    if (relatedSets.length === 0) {
      return [];
    }

    // Search for cards in all related sets
    const allCards: MTGCard[] = [];
    for (const set of relatedSets) {
      try {
        const setCards = await mtgApiService.searchCardsBySetCode(set.code);
        allCards.push(...setCards);
      } catch (error) {
        console.warn(`Failed to get cards for set ${set.code}:`, error);
      }
    }

    if (allCards.length === 0) {
      return [];
    }

    const results: CardResultType[] = [];
    
    // Group cards by name to handle multiple printings
    const cardGroups = allCards.reduce((acc, card) => {
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

    return results;
  } catch (error) {
    console.error('Failed to search cards by set:', error);
    return [];
  }
};

export const filterResults = (
  searchResults: CardResultType[],
  setFilters: SetFilterType[],
  sortOption: string,
  frameFilter: string,
  borderFilter: string,
  foilFilter: string,
  bulkMode: boolean,
  selectedBulkCard: string
): CardResultType[] => {
  // For bulk mode, filter to only the selected card
  const baseResults = bulkMode && selectedBulkCard
    ? searchResults.filter(result => result.card.name === selectedBulkCard)
    : searchResults;

  // Filter and sort the results
  const filteredResults = baseResults.map(result => ({
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

  // Sort the overall results based on sortOption
  return filteredResults.sort((a, b) => {
    if (sortOption === 'price-asc') {
      const priceA = parseFloat(getDisplayPrice(a.cheapestPrinting.prices)) || 0;
      const priceB = parseFloat(getDisplayPrice(b.cheapestPrinting.prices)) || 0;
      return priceA - priceB;
    } else if (sortOption === 'price-desc') {
      const priceA = parseFloat(getDisplayPrice(a.cheapestPrinting.prices)) || 0;
      const priceB = parseFloat(getDisplayPrice(b.cheapestPrinting.prices)) || 0;
      return priceB - priceA;
    } else if (sortOption === 'newest') {
      const dateA = new Date(a.cheapestPrinting.released_at || '1900-01-01');
      const dateB = new Date(b.cheapestPrinting.released_at || '1900-01-01');
      return dateB.getTime() - dateA.getTime();
    } else if (sortOption === 'oldest') {
      const dateA = new Date(a.cheapestPrinting.released_at || '1900-01-01');
      const dateB = new Date(b.cheapestPrinting.released_at || '1900-01-01');
      return dateA.getTime() - dateB.getTime();
    } else if (sortOption === 'alpha') {
      return a.card.name.localeCompare(b.card.name);
    }
    return 0;
  });
}; 