import axios from 'axios';
import { MTGCard, SearchResult, MTGSet } from '../types';
import { categorizeSetByType } from '../data/setCategories';

const API_BASE_URL = 'https://api.scryfall.com';

class MTGApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  async searchCards(query: string): Promise<MTGCard[]> {
    try {
      const response = await this.api.get<SearchResult>(`/cards/search`, {
        params: {
          q: query,
          unique: 'cards',
          order: 'name',
        },
      });
      
      // Filter out cards that are not available in paper
      return response.data.data.filter(card => 
        card.games && card.games.includes('paper')
      );
    } catch (error) {
      console.error('Error searching cards:', error);
      throw new Error('Failed to search cards');
    }
  }

  async searchCardsBySetCode(setCode: string): Promise<MTGCard[]> {
    try {
      const response = await this.api.get<SearchResult>(`/cards/search`, {
        params: {
          q: `set:${setCode}`,
          unique: 'prints',
          order: 'name',
        },
      });
      
      // Filter out cards that are not available in paper
      return response.data.data.filter(card => 
        card.games && card.games.includes('paper')
      );
    } catch (error) {
      console.error('Error searching cards by set:', error);
      throw new Error('Failed to search cards by set');
    }
  }

  async getCardByName(name: string): Promise<MTGCard[]> {
    try {
      const response = await this.api.get<SearchResult>(`/cards/search`, {
        params: {
          q: `!"${name}" -set:plst -set_type:memorabilia -set_type:promo`,
          unique: 'prints',
          order: 'set',
        },
      });
      
      // Filter out cards that are not available in paper
      const paperCards = response.data.data.filter(card => 
        card.games && card.games.includes('paper')
      );
      
      // For planeswalkers, sagas, and dual-sided cards, get more detailed information
      const enhancedCards = await Promise.all(
        paperCards.map(async (card) => {
          // If it's a planeswalker, saga, or dual-sided card, get the detailed card info
          if (card.type_line && 
            ((card.type_line.toLowerCase().includes('planeswalker') || 
              card.type_line.toLowerCase().includes('saga')) ||
             card.layout === 'transform')) {
            try {
              const detailedCard = await this.getCardByExactName(card.name);
              return {
                ...card,
                loyalty: detailedCard.loyalty,
                card_faces: detailedCard.card_faces,
                all_parts: detailedCard.all_parts,
                layout: detailedCard.layout,
              };
            } catch (error) {
              console.warn(`Could not get detailed info for ${card.name}:`, error);
              return card;
            }
          }
          return card;
        })
      );
      
      return enhancedCards;
    } catch (error) {
      console.error('Error getting card by name:', error);
      throw new Error('Failed to get card');
    }
  }

  async getCardByExactName(name: string): Promise<MTGCard> {
    try {
      const response = await this.api.get<MTGCard>(`/cards/named`, {
        params: {
          exact: name,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting exact card:', error);
      throw new Error('Card not found');
    }
  }

  async getSets(): Promise<MTGSet[]> {
    try {
      const response = await this.api.get<{ data: MTGSet[] }>('/sets');
      return response.data.data;
    } catch (error) {
      console.error('Error getting sets:', error);
      throw new Error('Failed to get sets');
    }
  }

  async searchSets(query: string): Promise<MTGSet[]> {
    try {
      const response = await this.api.get<{ data: MTGSet[] }>('/sets');
      const allSets = response.data.data;
      
      // Filter sets based on query (code or name)
      const filteredSets = allSets.filter(set => 
        set.code.toLowerCase().includes(query.toLowerCase()) ||
        set.name.toLowerCase().includes(query.toLowerCase())
      );
      
      // Sort by relevance (exact matches first, then partial matches)
      return filteredSets.sort((a, b) => {
        const aCodeMatch = a.code.toLowerCase() === query.toLowerCase();
        const bCodeMatch = b.code.toLowerCase() === query.toLowerCase();
        const aNameMatch = a.name.toLowerCase() === query.toLowerCase();
        const bNameMatch = b.name.toLowerCase() === query.toLowerCase();
        
        if (aCodeMatch && !bCodeMatch) return -1;
        if (!aCodeMatch && bCodeMatch) return 1;
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Error searching sets:', error);
      throw new Error('Failed to search sets');
    }
  }

  async getRelatedSets(mainSetCode: string): Promise<MTGSet[]> {
    try {
      const response = await this.api.get<{ data: MTGSet[] }>('/sets');
      const allSets = response.data.data;
      
      // Get the main set
      const mainSet = allSets.find(set => set.code.toLowerCase() === mainSetCode.toLowerCase());
      if (!mainSet) return [];

      const relatedSets: MTGSet[] = [mainSet];
      
      // Find related sets based on common patterns
      const baseCode = mainSetCode.toLowerCase();
      const setName = mainSet.name.toLowerCase();
      
      // Look for commander sets (usually end with 'c' or contain 'commander')
      const commanderSets = allSets.filter(set => {
        const setCode = set.code.toLowerCase();
        const setType = set.set_type?.toLowerCase();
        const setTypeName = set.name.toLowerCase();
        
        return (
          // Commander sets often have 'c' suffix or contain 'commander' in name
          (setCode.startsWith(baseCode) && setCode.endsWith('c')) ||
          (setTypeName.includes('commander') && 
           (setTypeName.includes(setName.replace(':', '').replace(' ', '')) ||
            setTypeName.includes(baseCode))) ||
          // Check for set type being commander and related to main set
          (setType === 'commander' && 
           (setTypeName.includes(setName.replace(':', '').replace(' ', '')) ||
            setTypeName.includes(baseCode)))
        );
      });
      
      // Look for supplemental sets (draft boosters, collector boosters, etc.)
      const supplementalSets = allSets.filter(set => {
        const setCode = set.code.toLowerCase();
        const setType = set.set_type?.toLowerCase();
        const setTypeName = set.name.toLowerCase();
        
        return (
          // Same base code but different suffix
          (setCode.startsWith(baseCode) && setCode !== baseCode && !setCode.endsWith('c')) ||
          // Supplemental set types
          ((setType === 'draft_innovation' || setType === 'arsenal' || setType === 'box') &&
          (setTypeName.includes(setName.replace(':', '').replace(' ', '')) ||
           setTypeName.includes(baseCode)))
        );
      });
      
      // Add related sets, avoiding duplicates
      const allRelatedSets = [...commanderSets, ...supplementalSets];
      allRelatedSets.forEach(set => {
        if (!relatedSets.find(existing => existing.code === set.code)) {
          relatedSets.push(set);
        }
      });
      
      return relatedSets;
    } catch (error) {
      console.error('Error getting related sets:', error);
      return [];
    }
  }

  async getCardImageUrl(card: MTGCard): Promise<string> {
    // For dual-sided cards, return the front face image
    if (card.card_faces && card.card_faces.length > 0 && card.card_faces[0].image_uris?.normal) {
      return card.card_faces[0].image_uris.normal;
    }
    
    // For single-sided cards, return the normal image
    if (card.image_uris?.normal) {
      return card.image_uris.normal;
    }
    
    // Fallback to card name search for image
    try {
      const exactCard = await this.getCardByExactName(card.name);
      
      // Check for dual-sided card in the detailed response
      if (exactCard.card_faces && exactCard.card_faces.length > 0 && exactCard.card_faces[0].image_uris?.normal) {
        return exactCard.card_faces[0].image_uris.normal;
      }
      
      // Return normal image from detailed response
      return exactCard.image_uris?.normal || '';
    } catch (error) {
      return '';
    }
  }

  getCheapestPrinting(cards: MTGCard[]): MTGCard {
    let cheapest = cards[0];
    let lowestPrice = Infinity;

    for (const card of cards) {
      const price = this.getCardPrice(card);
      if (price > 0 && price < lowestPrice) {
        lowestPrice = price;
        cheapest = card;
      }
    }

    return cheapest;
  }

  getMostRecentPrinting(cards: MTGCard[]): MTGCard {
    let mostRecent = cards[0];
    let latestDate = new Date(0); // Start with earliest possible date

    for (const card of cards) {
      if (card.released_at) {
        const cardDate = new Date(card.released_at);
        if (cardDate > latestDate) {
          latestDate = cardDate;
          mostRecent = card;
        }
      }
    }

    return mostRecent;
  }

  private getCardPrice(card: MTGCard): number {
    if (!card.prices) return Infinity;
    
    const prices = [
      parseFloat(card.prices.usd || '0'),
      parseFloat(card.prices.usd_foil || '0'),
      parseFloat(card.prices.usd_etched || '0'),
    ].filter(price => price > 0);

    return prices.length > 0 ? Math.min(...prices) : Infinity;
  }

  categorizeSetType(setType: string, setCode?: string): 'core' | 'expansion' | 'masters' | 'commander' | 'secret_lair' | 'masterpiece' | 'universes_beyond' | 'other' {
    return categorizeSetByType(setType, setCode);
  }
}

export const mtgApiService = new MTGApiService(); 