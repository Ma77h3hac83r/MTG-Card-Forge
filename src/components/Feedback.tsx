import React from 'react';

interface FeedbackProps {
  onClose: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({ onClose }) => {
  const faqItems = [
    {
      question: "Why are some card images not showing?",
      answer: "Card images are loaded from Scryfall's servers. If an image doesn't appear, it may be temporarily unavailable or the card might not have an image in Scryfall's database."
    },
    {
      question: "How do I search for cards with specific mana costs?",
      answer: "Currently, the search only supports card names. Advanced search features like mana cost filtering are planned for future updates."
    },
    {
      question: "Can I search for cards by set?",
      answer: "Yes! After searching for a card, you can use the set type filters on the right to show only cards from specific set categories (Core, Expansion, Commander, etc.)."
    },
    {
      question: "Why are some prices showing as 'N/A'?",
      answer: "Prices are sourced from TCGPlayer. If a price shows 'N/A', it means the card doesn't have a current market price listed on TCGPlayer."
    },
    {
      question: "How do I report a bug or request a feature?",
      answer: "Please use the GitHub Issues link below to report bugs, request features, or ask questions. This helps us track and manage all feedback in one place."
    },
    {
      question: "Is this app affiliated with Wizards of the Coast?",
      answer: "No, this is an unofficial fan project. All card data comes from Scryfall's API, and prices are from TCGPlayer. We're not affiliated with Wizards of the Coast."
    }
  ];

  const handleGitHubClick = () => {
    window.open('https://github.com/Ma77h3hac83r/MTG-Card-Forge/issues', '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
    }}>
      <div className="card" style={{
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--md-outline-variant)',
        }}>
          <h2 style={{
            margin: 0,
            color: 'var(--md-on-surface)',
            fontSize: '1.5rem',
            fontWeight: '600',
          }}>
            FAQ & Support
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--md-on-surface-variant)',
              padding: '4px',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--md-on-surface)'}
          >
            ×
          </button>
        </div>

        {/* FAQ Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            margin: '0 0 16px 0',
            color: 'var(--md-on-surface)',
            fontSize: '1.25rem',
            fontWeight: '600',
          }}>
            Frequently Asked Questions
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {faqItems.map((item, index) => (
              <div key={index} style={{
                padding: '16px',
                background: 'var(--md-surface-container-high)',
                borderRadius: '8px',
                border: '1px solid var(--md-outline-variant)',
              }}>
                <h4 style={{
                  margin: '0 0 8px 0',
                  color: 'var(--md-on-surface)',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}>
                  {item.question}
                </h4>
                <p style={{
                  margin: 0,
                  color: 'var(--md-on-surface-variant)',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Issues Section */}
        <div style={{
          padding: '20px',
          background: 'var(--md-primary-container)',
          borderRadius: '8px',
          border: '1px solid var(--md-outline-variant)',
          textAlign: 'center',
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            color: 'var(--md-on-primary-container)',
            fontSize: '1.125rem',
            fontWeight: '600',
          }}>
            Need More Help?
          </h3>
          <p style={{
            margin: '0 0 16px 0',
            color: 'var(--md-on-primary-container)',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}>
            Can't find what you're looking for? Report bugs, request features, or ask questions on our GitHub Issues page.
          </p>
          <button
            onClick={handleGitHubClick}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            📋 Open GitHub Issues
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback; 