import React, { useState, useEffect, useCallback } from 'react';

const FilterModal = ({ isOpen, filters, artists, locations, onApply, onClear, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    artist: true,
    location: false,
    years: false
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({ artist: '', location: '', yearFrom: '', yearTo: '' });
    onClear();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="filter-modal" onClick={handleBackdropClick}>
      <div className="filter-modal-content">
        <button className="filter-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        <div className="filter-sections">
          <div className={`filter-section ${expandedSections.artist ? 'expanded' : ''}`}>
            <button 
              className="filter-section-header" 
              onClick={() => toggleSection('artist')}
            >
              <span className="filter-section-title">ARTIST</span>
              <span className="filter-section-icon">
                <svg className="icon-plus" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <svg className="icon-minus" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
            </button>
            <div className="filter-section-content">
              <div className="select-wrapper">
                <select 
                  className="filter-select-dropdown"
                  value={localFilters.artist}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, artist: e.target.value }))}
                >
                  <option value="">Select artist</option>
                  {artists.map(artist => (
                    <option key={artist} value={artist}>{artist}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={`filter-section ${expandedSections.location ? 'expanded' : ''}`}>
            <button 
              className="filter-section-header" 
              onClick={() => toggleSection('location')}
            >
              <span className="filter-section-title">LOCATION</span>
              <span className="filter-section-icon">
                <svg className="icon-plus" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <svg className="icon-minus" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
            </button>
            <div className="filter-section-content">
              <div className="select-wrapper">
                <select 
                  className="filter-select-dropdown"
                  value={localFilters.location}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, location: e.target.value }))}
                >
                  <option value="">Select location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={`filter-section ${expandedSections.years ? 'expanded' : ''}`}>
            <button 
              className="filter-section-header" 
              onClick={() => toggleSection('years')}
            >
              <span className="filter-section-title">YEARS</span>
              <span className="filter-section-icon">
                <svg className="icon-plus" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <svg className="icon-minus" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
            </button>
            <div className="filter-section-content">
              <div className="years-inputs-wrapper">
                <input 
                  type="text" 
                  className="year-input-modal" 
                  placeholder="From"
                  value={localFilters.yearFrom}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, yearFrom: e.target.value }))}
                />
                <span className="year-separator-modal">—</span>
                <input 
                  type="text" 
                  className="year-input-modal" 
                  placeholder="To"
                  value={localFilters.yearTo}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, yearTo: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="filter-modal-actions">
          <button className="filter-modal-btn" onClick={handleApply}>SHOW THE RESULTS</button>
          <button className="filter-modal-btn" onClick={handleClear}>CLEAR</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;