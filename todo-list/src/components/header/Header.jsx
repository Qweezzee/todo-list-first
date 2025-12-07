import React from 'react';
import './Header.css';

const Header = ({ toggleTheme, theme }) => {
  return (
    <div className="header-content">
      <div className="logo-section">
        <div className="logo-icon">✅</div>
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
        
        <div className="user-info">
          <div className="avatar-container">
            <div className="avatar">👤</div>
            <div className="user-status online"></div>
          </div>
          <div className="user-details">
            <span className="username">Qweez</span>
            <span className="user-role">Администратор</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;