import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import SearchFiles from './components/SearchFiles';
import './App.css';

function App() {
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

  const handleFilter = (files) => {
    setFilteredFiles(files);
  };

  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <h1>🔥 Firebase Storage CRUD App</h1>
          <p>Upload, manage, and search your files with Firebase Storage & Redux</p>
        </header>
        
        <nav className="app-nav">
          <button 
            className={`nav-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📤 Upload Files
          </button>
          <button 
            className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            🔍 Search Files
          </button>
          <button 
            className={`nav-btn ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            📁 Manage Files
          </button>
        </nav>

        <main className="app-main">
          {activeTab === 'upload' && (
            <section className="upload-section">
              <FileUpload />
            </section>
          )}
          
          {activeTab === 'search' && (
            <section className="search-section">
              <SearchFiles onFilter={handleFilter} />
            </section>
          )}
          
          {activeTab === 'manage' && (
            <section className="manage-section">
              <FileList filteredFiles={filteredFiles} />
            </section>
          )}
        </main>
        
        <footer className="app-footer">
          <p>Built with React, Redux Toolkit, and Firebase Storage</p>
          <p>Features: File Upload, Download, Delete, Edit Metadata, Search</p>
        </footer>
      </div>
    </Provider>
  );
}

export default App;
