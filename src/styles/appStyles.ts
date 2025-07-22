export const appStyles = {
  // Main container styles
  mainContainer: {
    minHeight: '100vh',
    position: 'relative' as const,
    zIndex: 1,
  },

  // Navbar styles
  navbar: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    background: 'var(--md-surface-container-high)',
    borderBottom: '1px solid var(--md-outline-variant)',
    padding: '12px 16px',
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },

  navbarContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  navbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  navbarTitle: {
    fontSize: '1.25rem',
    margin: 0,
    background: 'linear-gradient(135deg, var(--md-primary), var(--md-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: '600',
  },

  betaBadge: {
    fontSize: '0.75rem',
    color: 'var(--md-on-surface-variant)',
    padding: '2px 6px',
    background: 'var(--md-surface-container)',
    borderRadius: '8px',
    border: '1px solid var(--md-outline-variant)',
  },

  navbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Main content styles
  mainContent: {
    paddingTop: '60px',
    paddingBottom: '80px',
  },

  container: {
    maxWidth: '100%',
    margin: '0 auto',
    position: 'relative' as const,
    zIndex: 1,
  },

  // Card details and filters layout
  cardDetailsFiltersLayout: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
    marginBottom: '16px',
    background: 'var(--bg-tertiary)',
    padding: '16px',
    borderRadius: '16px',
    border: '1px solid var(--md-outline-variant)',
  },

  cardDetailsColumn: {
    flex: 1,
  },

  filtersColumn: {
    flexShrink: 0,
    width: '300px',
    background: 'var(--md-surface-container)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid var(--md-outline-variant)',
  },

  // Card layout styles
  dualCardLayout: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
  },

  dualCardImages: {
    flexShrink: 0,
  },

  dualCardImagesContainer: {
    display: 'flex',
    gap: '12px',
  },

  cardDetailsLayout: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
  },

  cardImageContainer: {
    flexShrink: 0,
    textAlign: 'center' as const,
  },

  cardImage: {
    width: '200px',
    height: '280px',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    border: '2px solid var(--border-color)',
    objectFit: 'cover' as const,
  },

  cardImagePlaceholder: {
    width: '200px',
    height: '280px',
    background: 'var(--bg-secondary)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--border-color)',
    color: 'var(--text-muted)',
  },

  // Card content styles
  cardNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },

  cardName: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },

  manaCost: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },

  cardType: {
    color: 'var(--text-secondary)',
    fontSize: '1.1rem',
    marginBottom: '8px',
  },

  cardText: {
    color: 'var(--text-primary)',
    fontSize: '1rem',
    marginBottom: '8px',
    whiteSpace: 'pre-line' as const,
  },

  powerToughness: {
    color: 'var(--text-primary)',
    fontSize: '1rem',
    marginBottom: '8px',
    fontWeight: '600',
  },

  // Format legalities styles
  legalitiesContainer: {
    marginTop: '16px',
  },

  legalitiesTitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    marginBottom: '4px',
    fontWeight: '600',
  },

  legalitiesList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },

  legalityBadge: (legality: string) => ({
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '500',
    textTransform: 'capitalize' as const,
    background: legality === 'legal' ? 'rgba(34, 197, 94, 0.2)' : 
                legality === 'restricted' ? 'rgba(245, 158, 11, 0.2)' :
                legality === 'banned' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(107, 114, 128, 0.2)',
    color: legality === 'legal' ? 'rgb(34, 197, 94)' :
           legality === 'restricted' ? 'rgb(245, 158, 11)' :
           legality === 'banned' ? 'rgb(239, 68, 68)' : 'rgb(107, 114, 128)',
    border: `1px solid ${legality === 'legal' ? 'rgba(34, 197, 94, 0.3)' : 
                        legality === 'restricted' ? 'rgba(245, 158, 11, 0.3)' :
                        legality === 'banned' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
  }),

  // Results styles
  simpleResults: {
    marginTop: '0',
  },

  categorySection: {
    // Add styles as needed
  },

  setTypeBanner: {
    background: 'var(--md-primary-container)',
    color: 'var(--md-on-primary-container)',
    padding: '12px 16px',
    borderRadius: '12px 12px 0 0',
    borderBottom: 'none',
    marginBottom: '0',
    fontSize: '1.1rem',
    fontWeight: '600',
    textTransform: 'capitalize' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  categoryResults: {
    background: 'var(--bg-tertiary)',
    borderRadius: '0 0 12px 12px',
    padding: '16px',
    border: '1px solid var(--md-outline-variant)',
    borderTop: 'none',
    marginTop: '0',
    gap: '0 !important',
  },

  // Error and loading styles
  errorCard: {
    marginBottom: '24px',
    borderColor: 'var(--mtg-red)',
    background: 'rgba(211, 47, 47, 0.1)',
  },

  errorText: {
    color: 'var(--mtg-red)',
    fontWeight: '600',
  },

  loadingCard: {
    textAlign: 'center' as const,
    marginBottom: '24px',
  },

  loadingText: {
    fontSize: '1.2rem',
    color: 'var(--text-secondary)',
  },

  // Empty state styles
  emptyStateCard: {
    textAlign: 'center' as const,
  },

  emptyStateIcon: {
    fontSize: '3rem',
    marginBottom: '16px',
  },

  emptyStateTitle: {
    margin: '0 0 8px 0',
    color: 'var(--text-primary)',
  },

  emptyStateText: {
    color: 'var(--text-secondary)',
    margin: 0,
  },

  // Footer styles
  footer: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'var(--md-surface-container-high)',
    borderTop: '1px solid var(--md-outline-variant)',
    padding: '12px 16px',
    zIndex: 1000,
    boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },

  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  footerTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },

  footerText: {
    color: 'var(--md-on-surface-variant)',
  },

  footerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  footerLink: {
    background: 'none',
    border: 'none',
    color: 'var(--md-on-surface-variant)',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: 'inherit',
    fontFamily: 'inherit',
  },

  footerLinkHover: {
    color: 'var(--md-on-surface)',
  },
}; 