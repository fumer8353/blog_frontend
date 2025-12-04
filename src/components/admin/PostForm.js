import React, { useState, useEffect } from 'react';
import {
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  Autocomplete,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';

// Assume CATEGORIES might be passed as a prop or defined/fetched here if static
const CATEGORIES = [
  'Technology',
  'Science',
  'Health',
  'Business',
  'Lifestyle',
  'Travel',
  'Food',
  'Sports'
];

const PostForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categories: [],
    tags: [],
    image: null,
    imageName: '', // To display existing or new image name
    isPremium: false
  });

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        categories: initialData.categories || [],
        tags: initialData.tags || [],
        image: null, // Do not re-populate file input, user must re-select if changing
        imageName: initialData.imageUrl ? 'Current Image' : '', // Or display actual name if available and desired
        isPremium: initialData.isPremium || false,
      });
    } else {
      // Reset for new post form
      setFormData({
        title: '',
        content: '',
        categories: [],
        tags: [],
        image: null,
        imageName: '',
        isPremium: false
      });
    }
  }, [isEditing, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file, imageName: file.name }));
    } else {
      setFormData(prev => ({ ...prev, image: null, imageName: initialData?.imageUrl && isEditing ? 'Current Image' : '' }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('content', formData.content);
    dataToSend.append('categories', JSON.stringify(formData.categories));
    dataToSend.append('tags', JSON.stringify(formData.tags));
    dataToSend.append('isPremium', JSON.stringify(formData.isPremium));
    if (formData.image) {
      dataToSend.append('image', formData.image);
    }
    // If isEditing and no new image, backend should keep the old one. 
    // If image is explicitly to be removed, that needs separate handling (e.g. a remove image button)
    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="content"
          label="Content"
          type="text"
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <Autocomplete
          multiple
          options={CATEGORIES}
          value={formData.categories}
          onChange={(event, newValue) => {
            setFormData(prev => ({ ...prev, categories: newValue }));
          }}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...chipProps } = getTagProps({ index });
              return <Chip key={key} variant="outlined" label={option} {...chipProps} />;
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Categories"
              placeholder="Select or add categories"
              margin="normal"
            />
          )}
        />
        <Autocomplete
          multiple
          options={[]} // Provide suggestions if any
          value={formData.tags}
          onChange={(event, newValue) => {
            setFormData(prev => ({ ...prev, tags: newValue }));
          }}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...chipProps } = getTagProps({ index });
              return <Chip key={key} variant="outlined" label={option} {...chipProps} />;
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Tags"
              placeholder="Enter tags"
              margin="normal"
            />
          )}
        />
        <FormControlLabel
          control={<Switch name="isPremium" checked={formData.isPremium} onChange={handleChange} />}
          label="Premium Content"
          sx={{ mt: 1 }}
        />
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>Upload Image</Typography>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          {formData.imageName && <Typography variant="caption" sx={{ml:1}}>{formData.imageName}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">{isEditing ? 'Update' : 'Create'}</Button>
      </DialogActions>
    </form>
  );
};

export default PostForm; 