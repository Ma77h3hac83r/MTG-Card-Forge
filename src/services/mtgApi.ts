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

  async getCardImageUrl(card: MTGCard): Promise<string> {
    // For dual-sided cards, return the front face image
    if (card.card_faces && card.card_faces.length > 0 && card.card_faces[0].image_uris?.large) {
      return card.card_faces[0].image_uris.large;
    }
    
    // For single-sided cards, return the large image
    if (card.image_uris?.large) {
      return card.image_uris.large;
    }
    
    // Fallback to card name search for image
    try {
      const exactCard = await this.getCardByExactName(card.name);
      
      // Check for dual-sided card in the detailed response
      if (exactCard.card_faces && exactCard.card_faces.length > 0 && exactCard.card_faces[0].image_uris?.large) {
        return exactCard.card_faces[0].image_uris.large;
      }
      
      // Return large image from detailed response
      return exactCard.image_uris?.large || '';
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