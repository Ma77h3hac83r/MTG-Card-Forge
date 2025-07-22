import React from 'react';
import { appStyles } from '../styles/appStyles';

interface FooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPrivacyClick, onTermsClick }) => {
  return (
    <footer style={appStyles.footer}>
      <div style={appStyles.footerContent}>
        <div style={appStyles.footerTop}>
          <span style={appStyles.footerText}>
            Powered by Scryfall API & TCGPlayer (no affiliation)
          </span>
        </div>
        
        <div style={appStyles.footerLinks}>
          <button
            onClick={onPrivacyClick}
            style={appStyles.footerLink}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--md-on-surface)'}
          >
            Privacy
          </button>
          <button
            onClick={onTermsClick}
            style={appStyles.footerLink}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--md-on-surface)'}
          >
            Terms
          </button>
          <a 
            href="https://github.com/Ma77h3hac83r/MTG-Card-Forge" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: 'var(--md-on-surface-variant)', 
              textDecoration: 'none',
            }} 
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--md-on-surface)'}
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 