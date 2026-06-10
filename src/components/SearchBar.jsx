import React, { useState, useCallback, useRef } from 'react';

const SearchBar = ({ onSearch, onOpenFilter }) => {
  const [query, setQuery] = useState('');
  const debounceTimerRef = useRef(null);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  }, [onSearch]);

  return (
    <div className="search-section" id="searchSection">
      <div className="search-filter-row">
        <div className="search-wrapper">
          <div className="search-input-wrapper">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M15 15L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Painting title"
              value={query}
              onChange={handleInputChange}
            />
          </div>
          <button className="filter-btn" onClick={onOpenFilter} aria-label="Фильтры">
            <span className="filter-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Верхняя линия с кружочком справа */}
                <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="18" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                
                {/* Средняя линия с кружочком слева */}
                <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                
                {/* Нижняя линия с кружочком справа */}
                <path d="M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="16" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;