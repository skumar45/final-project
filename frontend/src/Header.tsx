import React from 'react';
import './tokens.css';
import './index.css';
import './app.css';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

function Header({ isDarkMode, setIsDarkMode }: HeaderProps) {
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDarkMode(e.target.checked);
  };
  return (
    <header>
      <nav>
        <ul className="nav-list">
          <li><Link to="/sell">Sell</Link></li>
          <li><Link to="/buy">Buy</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
      <label className="dark-mode-toggle">
        <input 
          type="checkbox" 
          checked={isDarkMode} 
          onChange={handleToggle} 
          autoComplete="off" 
        />
        Dark mode
      </label>
    </header>
  );
}

export default Header;