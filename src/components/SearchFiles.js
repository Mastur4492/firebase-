import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const SearchFiles = ({ onFilter }) => {
  const { files } = useSelector((state) => state.files);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [filteredFiles, setFilteredFiles] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setFilteredFiles([]);
      onFilter([]);
      return;
    }

    const filtered = files.filter(file => {
      const searchValue = searchTerm.toLowerCase();
      
      switch (searchType) {
        case 'name':
          return file.name.toLowerCase().includes(searchValue);
        case 'description':
          return file.description.toLowerCase().includes(searchValue);
        case 'date':
          return file.uploadedAt.toLowerCase().includes(searchValue);
        default:
          return file.name.toLowerCase().includes(searchValue) ||
                 file.description.toLowerCase().includes(searchValue);
      }
    });

    setFilteredFiles(filtered);
    onFilter(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredFiles([]);
    onFilter([]);
  };

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Auto-search as user types
    if (!value.trim()) {
      setFilteredFiles([]);
      onFilter([]);
      return;
    }

    const filtered = files.filter(file => {
      const searchValue = value.toLowerCase();
      
      switch (searchType) {
        case 'name':
          return file.name.toLowerCase().includes(searchValue);
        case 'description':
          return file.description.toLowerCase().includes(searchValue);
        case 'date':
          return file.uploadedAt.toLowerCase().includes(searchValue);
        default:
          return file.name.toLowerCase().includes(searchValue) ||
                 file.description.toLowerCase().includes(searchValue);
      }
    });

    setFilteredFiles(filtered);
    onFilter(filtered);
  };

  return (
    <div className="search-container">
      <h3>Search Files</h3>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-inputs">
          <div className="search-field-group">
            <label htmlFor="searchTerm">Search Term:</label>
            <input
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder="Enter search term..."
              className="search-input"
            />
          </div>
          
          <div className="search-type-group">
            <label htmlFor="searchType">Search In:</label>
            <select
              id="searchType"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-select"
            >
              <option value="name">File Name</option>
              <option value="description">Description</option>
              <option value="date">Upload Date</option>
              <option value="all">All Fields</option>
            </select>
          </div>
          
          <div className="search-buttons">
            <button type="submit" className="search-btn">
              🔍 Search
            </button>
            <button 
              type="button" 
              onClick={handleClearSearch}
              className="clear-search-btn"
              disabled={!searchTerm}
            >
              ✕ Clear
            </button>
          </div>
        </div>
      </form>
      
      {searchTerm && (
        <div className="search-results-info">
          <p>
            {filteredFiles.length > 0 
              ? `Found ${filteredFiles.length} file(s) matching "${searchTerm}"`
              : `No files found matching "${searchTerm}"`
            }
          </p>
        </div>
      )}
      
      {searchTerm && filteredFiles.length > 0 && (
        <div className="search-results">
          <h4>Search Results:</h4>
          <ul className="results-list">
            {filteredFiles.map(file => (
              <li key={file.id} className="result-item">
                <div className="result-info">
                  <strong>{file.name}</strong>
                  {file.description && (
                    <p className="result-description">{file.description}</p>
                  )}
                  <small className="result-date">
                    Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                  </small>
                </div>
                <div className="result-actions">
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="result-view-btn"
                  >
                    View
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchFiles;
