// Set categorization using Scryfall API set_type property
// This provides more accurate categorization based on official set types

export type SetCategory = 'core' | 'expansion' | 'masters' | 'commander' | 'secret_lair' | 'masterpiece' | 'universes_beyond' | 'other';

const UNIVERSES_BEYOND_CODES = [
  '40k', 'bot', 'ltr', 'ltc', 'who', 'rex', 'clu', 'pip', 'acr', 'fin', 'fca', 'fic', 'spm'
];

export function categorizeSetByType(setType: string, setCode?: string): SetCategory {
  const type = setType.toLowerCase();
  const code = setCode?.toLowerCase() || '';

  if (UNIVERSES_BEYOND_CODES.includes(code)) return 'universes_beyond';
  if (type.includes('core')) return 'core';
  if (type.includes('expansion')) return 'expansion';
  if (type.includes('draft_innovation')) return 'expansion';
  if (type.includes('masters')) return 'masters';
  if (type.includes('commander')) return 'commander';
  if (type.includes('box')) return 'secret_lair';
  if (type.includes('masterpiece')) return 'masterpiece';

  // Everything else goes to 'other'
  return 'other';
}

// Special handling for Secret Lair and Universes Beyond set codes
export function categorizeSetCode(setCode: string): SetCategory {
  const code = setCode.toLowerCase();
  if (code === 'sld' || code === 'slx') return 'secret_lair';
  if (UNIVERSES_BEYOND_CODES.includes(code)) return 'universes_beyond';
  return 'other';
}