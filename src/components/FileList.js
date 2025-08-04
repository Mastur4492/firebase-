import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFiles, deleteFile, updateFileMetadata } from '../store/fileSlice';

const FileList = () => {
  const dispatch = useDispatch();
  const { files, loading, error } = useSelector((state) => state.files);
  
  const [editingFile, setEditingFile] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  const handleDelete = async (filePath, fileName) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      try {
        await dispatch(deleteFile(filePath)).unwrap();
        alert('File deleted successfully!');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete file');
      }
    }
  };

  const handleEdit = (file) => {
    setEditingFile(file.id);
    setEditDescription(file.description);
  };

  const handleSaveEdit = async (file) => {
    try {
      await dispatch(updateFileMetadata({
        filePath: file.fullPath,
        description: editDescription
      })).unwrap();
      
      setEditingFile(null);
      setEditDescription('');
      alert('File description updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update file description');
    }
  };

  const handleCancelEdit = () => {
    setEditingFile(null);
    setEditDescription('');
  };

  const handleRefresh = () => {
    dispatch(fetchFiles());
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };


  if (loading && files.length === 0) {
    return (
      <div className="file-list-container">
        <div className="loading">Loading files...</div>
      </div>
    );
  }

  return (
    <div className="file-list-container">
      <div className="file-list-header">
        <h2>File Storage ({files.length} files)</h2>
        <button onClick={handleRefresh} className="refresh-btn" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {files.length === 0 ? (
        <div className="no-files">
          <p>No files uploaded yet. Upload your first file above!</p>
        </div>
      ) : (
        <div className="files-grid">
          {files.map((file) => (
            <div key={file.id} className="file-card">
              <div className="file-preview">
                {file.url && (
                  <div className="file-thumbnail">
                    {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="image-preview"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : (
                      <div className="file-icon">📄</div>
                    )}
                    <div className="file-icon" style={{ display: 'none' }}>📄</div>
                  </div>
                )}
              </div>

              <div className="file-info">
                <h3 className="file-name">{file.name}</h3>
                
                <div className="file-details">
                  <p><strong>Uploaded:</strong> {formatDate(file.uploadedAt)}</p>
                  
                  <div className="description-section">
                    <strong>Description:</strong>
                    {editingFile === file.id ? (
                      <div className="edit-description">
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="description-input"
                          placeholder="Enter description..."
                          rows="2"
                        />
                        <div className="edit-buttons">
                          <button 
                            onClick={() => handleSaveEdit(file)}
                            className="save-btn"
                            disabled={loading}
                          >
                            Save
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            className="cancel-btn"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="description-display">
                        <p className="description-text">
                          {file.description || 'No description'}
                        </p>
                        <button 
                          onClick={() => handleEdit(file)}
                          className="edit-description-btn"
                          disabled={loading}
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="file-actions">
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-btn"
                  >
                    👁️ View
                  </a>
                  <a 
                    href={file.url} 
                    download={file.name}
                    className="download-btn"
                  >
                    ⬇️ Download
                  </a>
                  <button 
                    onClick={() => handleDelete(file.fullPath, file.name)}
                    className="delete-btn"
                    disabled={loading}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;
