import React from 'react';
import './Header.css';

const Header = ({ toggleTheme, theme }) => {
  return (
    <div className="header-content">
      <div className="logo-section">
        <span className="title">Task Manager</span>
      </div>
      
      <div className="header-actions">
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
     
        </div>
      </div>
  );
};

export default Header;