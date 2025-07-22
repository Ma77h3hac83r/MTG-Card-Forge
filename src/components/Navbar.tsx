import React from 'react';
import { appStyles } from '../styles/appStyles';

interface NavbarProps {
  onAboutClick: () => void;
  onFeedbackClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAboutClick, onFeedbackClick }) => {
  return (
    <nav style={appStyles.navbar}>
      <div style={appStyles.navbarContent}>
        <div style={appStyles.navbarLeft}>
          <h1 style={appStyles.navbarTitle}>
            MTG Card Forge
          </h1>
          <span 
            className="beta-badge"
            style={appStyles.betaBadge}
          >
            Beta
          </span>
        </div>
        
        <div style={appStyles.navbarRight}>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            onClick={onAboutClick}
          >
            About
          </button>
          <button 
            className="btn btn-primary" 
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            onClick={onFeedbackClick}
          >
            Feedback
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 