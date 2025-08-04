import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, clearError } from '../store/fileSlice';

const FileUpload = () => {
  const dispatch = useDispatch();
  const { loading, error, uploadProgress } = useSelector((state) => state.files);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file && !fileName) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }
    
    if (!fileName.trim()) {
      alert('Please enter a file name');
      return;
    }

    try {
      await dispatch(uploadFile({
        file: selectedFile,
        fileName: fileName.trim(),
        description: description.trim()
      })).unwrap();
      
      // Reset form
      setSelectedFile(null);
      setFileName('');
      setDescription('');
      document.getElementById('fileInput').value = '';
      
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="file-upload-container">
      <h2>Upload File</h2>
      
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={handleClearError} className="clear-error-btn">
            Clear Error
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="fileInput">Select File:</label>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileSelect}
            disabled={loading}
            className="file-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="fileName">File Name:</label>
          <input
            id="fileName"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            disabled={loading}
            className="text-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description (Optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter file description"
            disabled={loading}
            className="textarea-input"
            rows="3"
          />
        </div>
        
        {selectedFile && (
          <div className="file-info">
            <h4>Selected File Info:</h4>
            <p><strong>Original Name:</strong> {selectedFile.name}</p>
            <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
            <p><strong>Type:</strong> {selectedFile.type}</p>
          </div>
        )}
        
        {loading && (
          <div className="loading-indicator">
            <p>Uploading... {uploadProgress}%</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading || !selectedFile}
          className="submit-btn"
        >
          {loading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
