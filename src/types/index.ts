export interface MTGCard {
  id: string;
  name: string;
  mana_cost?: string;
  cmc?: number;
  colors?: string[];
  color_identity?: string[];
  type_line?: string;
  oracle_text?: string;
  flavor_text?: string;
  power?: string;
  toughness?: string;
  rarity: string;
  set_name: string;
  set: string;
  set_type: string;
  collector_number: string;
  released_at?: string;
  frame?: string;
  border_color?: string;
  tcgplayer_id?: number;
  games?: string[];
  layout?: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  prices?: {
    usd?: string;
    usd_foil?: string;
    usd_etched?: string;
    eur?: string;
    eur_foil?: string;
    tix?: string;
  };
  legalities?: {
    standard?: string;
    future?: string;
    historic?: string;
    gladiator?: string;
    pioneer?: string;
    explorer?: string;
    modern?: string;
    legacy?: string;
    pauper?: string;
    vintage?: string;
    penny?: string;
    commander?: string;
    oathbreaker?: string;
    brawl?: string;
    historicbrawl?: string;
    alchemy?: string;
    paupercommander?: string;
    duel?: string;
    oldschool?: string;
    premodern?: string;
    predh?: string;
  };
  // Additional fields for planeswalkers and sagas
  loyalty?: string;
  all_parts?: Array<{
    id: string;
    name: string;
    uri: string;
  }>;
  card_faces?: Array<{
    name: string;
    mana_cost?: string;
    type_line?: string;
    oracle_text?: string;
    loyalty?: string;
    power?: string;
    toughness?: string;
    image_uris?: {
      small: string;
      normal: string;
      large: string;
      png: string;
      art_crop: string;
      border_crop: string;
    };
  }>;
}

export interface MTGSet {
  id: string;
  code: string;
  name: string;
  set_type: string;
  card_count: number;
  digital: boolean;
  foil_only: boolean;
  nonfoil_only: boolean;
  icon_svg_uri?: string;
  released_at?: string;
}

export interface SearchResult {
  data: MTGCard[];
  has_more: boolean;
}

export interface SetFilter {
  id: string;
  name: string;
  type: 'core' | 'expansion' | 'masters' | 'commander' | 'secret_lair' | 'masterpiece' | 'universes_beyond' | 'other';
  enabled: boolean;
}

export interface CardResult {
  card: MTGCard;
  sets: MTGCard[];
  cheapestPrinting: MTGCard;
} 