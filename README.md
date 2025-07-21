# MTG Card Forge

A comprehensive web application for searching Magic: The Gathering cards and discovering all their available printings across different sets. Find the perfect version of any card with detailed information about each printing, including prices, set details, and high-quality images.

## Features

### 🔍 **Card Search**
- **Single Card Search**: Find any Magic card by name with instant results
- **Bulk Card Import**: Search multiple cards at once by entering a list of card names
- **Autocomplete**: Smart suggestions as you type card names

### 🎴 **Comprehensive Card Information**
- **All Printings**: See every available version of a card across all sets
- **High-Quality Images**: View card artwork from the most recent printing
- **Price Information**: Current market prices for each printing
- **Set Details**: Complete information about each set and printing
- **Card Details**: Full card text, mana costs, and special abilities

### 🎯 **Advanced Filtering**
- **Set Type Filters**: Organize results by set categories:
  - Core Sets
  - Expansion Sets
  - Masters Sets
  - Commander Decks
  - Secret Lairs
  - Masterpiece Series
  - Universes Beyond
  - Other Special Sets
- **Frame Filters**: Filter by card frame types
- **Border Filters**: Find borderless or full-art versions
- **Foil Options**: Filter for foil or non-foil printings

### 📊 **Sorting & Organization**
- **Price Sorting**: Find the cheapest or most expensive versions
- **Date Sorting**: Sort by newest or oldest printings
- **Alphabetical**: Sort sets alphabetically
- **Category Organization**: Results grouped by set type for easy browsing

## How to Use

### 🔍 **Searching for Cards**
1. **Single Card**: Enter a card name in the search field and press Enter or click Search
2. **Bulk Search**: Switch to "Bulk Import" mode and enter multiple card names (one per line)

### 🎯 **Filtering Results**
- Use the set type toggles to show/hide specific categories
- Filter by frame type, border style, or foil options
- Sort results by price, date, or alphabetically

### 📱 **Responsive Design**
- Works seamlessly on desktop, tablet, and mobile devices
- Touch-friendly interface for mobile users
- Optimized layout for all screen sizes

## Data Source

This application uses the [Scryfall API](https://scryfall.com/docs/api) to provide comprehensive Magic: The Gathering card data, including:
- Complete card information and text
- High-quality card images
- Current market prices
- Detailed set information
- Comprehensive printing history

All data is sourced from Scryfall's extensive MTG database, ensuring accuracy and completeness.

## Technology

Built with modern web technologies:
- **React** - User interface framework
- **TypeScript** - Type-safe development
- **Cloudflare Pages** - Global hosting and CDN

## Features in Detail

### 🎴 **Card Display**
- **Dual-Sided Cards**: Full support for transform cards with both sides displayed
- **Planeswalker Abilities**: Special formatting for loyalty abilities
- **Saga Chapters**: Visual representation of saga chapter abilities
- **Mana Symbols**: Proper rendering of all MTG mana symbols and costs
- **Card Text**: Complete oracle text with proper formatting

### 💰 **Price Information**
- **Multiple Price Types**: Regular, foil, and etched foil prices
- **TCGPlayer Integration**: Direct links to purchase cards
- **Price Sorting**: Find the most affordable or valuable versions
- **Price Display**: Clear price formatting with currency symbols

## Acknowledgments

- [Scryfall](https://scryfall.com/) for providing the comprehensive MTG API
- [Wizards of the Coast](https://company.wizards.com/) for Magic: The Gathering
- The MTG community for inspiration and feedback

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests to help improve MTG Card Forge. 