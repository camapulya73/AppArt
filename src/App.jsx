import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import ArtCard from './components/ArtCard';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import FilterModal from './components/FilterModal';

function App() {
  const [paintings, setPaintings] = useState([]);
  const [filteredPaintings, setFilteredPaintings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    artist: '',
    location: '',
    yearFrom: '',
    yearTo: ''
  });
  
  const itemsPerPage = 6;

  useEffect(() => {
    const OPEN_API_URL = 'https://registry.scalar.com/@mail-ufgwz/apis/gallery-api@latest';

    const fetchOpenApiSpec = async () => {
      try {
        const response = await fetch(OPEN_API_URL);
        
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const spec = await response.json();
        
        const paintingsArray = spec?.paths?.["/paintings"]?.get?.responses?.["200"]?.content?.["application/json"]?.example;
        
        if (paintingsArray && Array.isArray(paintingsArray)) {
          setPaintings(paintingsArray);
          setFilteredPaintings(paintingsArray);
        } else {
          throw new Error("Не удалось найти массив 'example' в OpenAPI спецификации.");
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpenApiSpec();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('galleryTheme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('galleryTheme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('galleryTheme', 'light');
    }
  }, [isDarkTheme]);

  useEffect(() => {
    if (isFilterOpen) {
      document.body.classList.add('filter-open');
    } else {
      document.body.classList.remove('filter-open');
    }
    return () => document.body.classList.remove('filter-open');
  }, [isFilterOpen]);

  useEffect(() => {
    if (paintings.length === 0) return;
    
    let filtered = [...paintings];

    if (filters.artist) {
      filtered = filtered.filter(p => p.artist === filters.artist);
    }
    if (filters.location) {
      filtered = filtered.filter(p => p.location === filters.location);
    }
    if (filters.yearFrom) {
      const yearFromNum = parseInt(filters.yearFrom);
      filtered = filtered.filter(p => !isNaN(yearFromNum) && p.year >= yearFromNum);
    }
    if (filters.yearTo) {
      const yearToNum = parseInt(filters.yearTo);
      filtered = filtered.filter(p => !isNaN(yearToNum) && p.year <= yearToNum);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.artist.toLowerCase().includes(query)
      );
    }

    setFilteredPaintings(filtered);
    setCurrentPage(1);
  }, [paintings, filters, searchQuery]);

  const handleSearch = useCallback((query) => setSearchQuery(query), []);
  const handleApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  }, []);
  const handleClearFilters = useCallback(() => {
    setFilters({ artist: '', location: '', yearFrom: '', yearTo: '' });
    setIsFilterOpen(false);
  }, []);
  const toggleTheme = useCallback(() => setIsDarkTheme(prev => !prev), []);

  const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPaintings = filteredPaintings.slice(startIndex, startIndex + itemsPerPage);
  const uniqueArtists = [...new Set(paintings.map(p => p.artist))];
  const uniqueLocations = [...new Set(paintings.map(p => p.location))];

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка OpenAPI спецификации с картинами...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <p>Ошибка загрузки галереи</p>
          <p>{error}</p>
          <p>Проверьте, что файл api-docs.json лежит в папке public и имеет правильную структуру OpenAPI.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="top-bar">
        <div className="theme-toggle-wrapper">
          <button className="theme-btn" onClick={toggleTheme} aria-label="Переключить тему">
            <svg className="icon-sun" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <svg className="icon-moon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} onOpenFilter={() => setIsFilterOpen(true)} />

      <main className="gallery-grid">
        {currentPaintings.length === 0 ? (
          <div className="no-results">
            {searchQuery ? (
              <>По вашему запросу "{searchQuery}" ничего не найдено</>
            ) : (
              <>Ничего не найдено</>
            )}
          </div>
        ) : (
          currentPaintings.map((painting, index) => (
            <ArtCard key={`${painting.title}-${index}`} painting={painting} />
          ))
        )}
      </main>

      {filteredPaintings.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <FilterModal
        isOpen={isFilterOpen}
        filters={filters}
        artists={uniqueArtists}
        locations={uniqueLocations}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
}

export default App;