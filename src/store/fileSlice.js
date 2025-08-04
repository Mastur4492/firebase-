import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  updateMetadata,
  getMetadata
} from 'firebase/storage';
import { ref as dbRef, set } from 'firebase/database';
import { storage, database } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

// Upload file and store metadata in Realtime Database
export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async ({ file, fileName, description }, { rejectWithValue }) => {
    try {
      const fileId = uuidv4();
      const fileRef = storageRef(storage, `files/${fileId}_${fileName}`);

      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const uploadedAt = new Date().toISOString();
      const metadata = {
        customMetadata: {
          description: description || '',
          originalName: fileName,
          uploadedAt
        }
      };

      await updateMetadata(fileRef, metadata);

      // Save metadata to Realtime Database
      await set(dbRef(database, `files/${fileId}`), {
        id: fileId,
        name: fileName,
        url: downloadURL,
        description: description || '',
        uploadedAt,
        fullPath: snapshot.ref.fullPath
      });

      return {
        id: fileId,
        name: fileName,
        url: downloadURL,
        description: description || '',
        uploadedAt,
        fullPath: snapshot.ref.fullPath
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all files
export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async (_, { rejectWithValue }) => {
    try {
      const listRef = storageRef(storage, 'files/');
      const res = await listAll(listRef);

      const files = await Promise.all(
        res.items.map(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);

          return {
            id: itemRef.name.split('_')[0],
            name: metadata.customMetadata?.originalName || itemRef.name,
            url: downloadURL,
            description: metadata.customMetadata?.description || '',
            uploadedAt: metadata.customMetadata?.uploadedAt || '',
            fullPath: itemRef.fullPath
          };
        })
      );

      return files;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete file
export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async (filePath, { rejectWithValue }) => {
    try {
      const fileRef = storageRef(storage, filePath);
      await deleteObject(fileRef);
      return filePath;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update file metadata
export const updateFileMetadata = createAsyncThunk(
  'files/updateFileMetadata',
  async ({ filePath, description }, { rejectWithValue }) => {
    try {
      const fileRef = storageRef(storage, filePath);
      const metadata = {
        customMetadata: {
          description,
          updatedAt: new Date().toISOString()
        }
      };

      await updateMetadata(fileRef, metadata);
      return { filePath, description };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fileSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    loading: false,
    error: null,
    uploadProgress: 0
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files.push(action.payload);
        state.uploadProgress = 0;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })

      // Fetch
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = state.files.filter(file => file.fullPath !== action.payload);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update metadata
      .addCase(updateFileMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFileMetadata.fulfilled, (state, action) => {
        state.loading = false;
        const { filePath, description } = action.payload;
        const index = state.files.findIndex(file => file.fullPath === filePath);
        if (index !== -1) {
          state.files[index].description = description;
        }
      })
      .addCase(updateFileMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setUploadProgress } = fileSlice.actions;
export default fileSlice.reducer;
