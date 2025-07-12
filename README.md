# MTG Card Forge

A beautiful web application for searching Magic: The Gathering cards and discovering all their available printings across different sets. Built with React, TypeScript, and the Scryfall API.

## Features

- **Single Card Search**: Search for individual cards by name
- **Bulk Card Import**: Import a list of cards to search multiple at once
- **Set Filtering**: Toggle between different set types:
  - Core Sets
  - Expansion Sets
  - Commander Decks
  - Secret Lairs
  - Other Sets
- **Dark/Light Mode**: Toggle between dark and light themes
- **Card Images**: Display high-quality card images from the cheapest available printing
- **Price Information**: Show current market prices for each printing
- **Hover Effects**: Interactive set listings with smooth hover animations
- **MTG-Inspired Design**: Beautiful UI with Magic: The Gathering color scheme

## Screenshots

The app features a modern, responsive design with:
- Dark mode by default with light mode toggle
- MTG-inspired gold accent colors
- Smooth animations and hover effects
- Card images with fallback placeholders
- Organized set listings by category

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MTG-Card-Forge
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

## Usage

### Single Card Search
1. Enter a card name in the search field
2. Click "Search" or press Enter
3. View all available printings and sets

### Bulk Card Import
1. Switch to "Bulk Import" mode
2. Enter card names, one per line
3. Click "Search X Cards" to find all cards at once

### Set Filtering
- Use the set filter toggles to show/hide specific set types
- Click "Select All" or "Deselect All" to quickly toggle all filters
- Filters are applied in real-time to search results

### Theme Toggle
- Click the sun/moon icon in the top-right corner to switch between dark and light modes

## API Integration

This app uses the [Scryfall API](https://scryfall.com/docs/api) to fetch card data. The API provides:
- Comprehensive card information
- High-quality card images
- Current market prices
- Set information and categorization

## Technologies Used

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Axios**: HTTP client for API requests
- **Lucide React**: Beautiful icon library
- **CSS Variables**: Dynamic theming system
- **Scryfall API**: MTG card data and images

## Project Structure

```
src/
├── components/          # React components
│   ├── App.tsx         # Main application component
│   ├── CardResult.tsx  # Card display component
│   ├── SearchForm.tsx  # Search interface
│   ├── SetFilter.tsx   # Set filtering controls
│   └── ThemeToggle.tsx # Theme switcher
├── services/           # API and business logic
│   └── mtgApi.ts      # Scryfall API integration
├── types/             # TypeScript type definitions
│   └── index.ts       # Card and API types
├── index.tsx          # Application entry point
├── index.css          # Global styles and theming
└── App.tsx            # Main app component
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Scryfall](https://scryfall.com/) for providing the comprehensive MTG API
- [Wizards of the Coast](https://company.wizards.com/) for Magic: The Gathering
- The MTG community for inspiration and feedback 