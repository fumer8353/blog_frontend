import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  Box,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import useAdminPosts from '../../hooks/useAdminPosts';
import PostForm from './PostForm';

const AdminDashboard = () => {
  const { posts, loading: postsLoading, error: postsError, refetchAdminPosts } = useAdminPosts();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleOpenDialog = (post = null) => {
    setEditingPost(post);
    setOpenDialog(true);
    setFormError('');
    setFormSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPost(null);
  };

  const handleFormSubmit = async (formDataToSend) => {
    setFormError('');
    setFormSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (editingPost) {
        await axios.put(
          `/api/admin/posts/${editingPost.id.replace('post:','')}`,
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        setFormSuccess('Post updated successfully');
      } else {
        await axios.post(
          `/api/admin/posts`,
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        setFormSuccess('Post created successfully');
      }
      handleCloseDialog();
      refetchAdminPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      setFormError(error.response?.data?.error || 'Error saving post');
      if (error.response?.data?.details) {
        console.error('Error details:', error.response.data.details);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/admin/posts/${id.replace('post:','')}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFormSuccess('Post deleted successfully');
        refetchAdminPosts();
      } catch (error) {
        setFormError('Error deleting post');
        console.error('Error:', error);
      }
    }
  };

  const handlePublishToggle = async (post) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      const postDataToUpdate = { ...post, status: newStatus };
      delete postDataToUpdate.id;
      await axios.put(
        `/api/admin/posts/${post.id.replace('post:','')}`,
        postDataToUpdate,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormSuccess(`Post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
      refetchAdminPosts();
    } catch (error) {
      setFormError('Error updating post status');
      console.error('Error:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Post
        </Button>
      </Box>

      {formError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError('')}>
          {formError}
        </Alert>
      )}
      {formSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setFormSuccess('')}>
          {formSuccess}
        </Alert>
      )}

      {postsLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
          <Typography sx={{ml:1}}>Loading posts...</Typography>
        </Box>
      )}
      {postsError && !postsLoading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {postsError}
        </Alert>
      )}

      {!postsLoading && !postsError && posts && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.categories?.join(', ')}</TableCell>
                  <TableCell>{post.isPremium ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={post.status}
                      color={post.status === 'published' ? 'success' : 'default'}
                      onClick={() => handlePublishToggle(post)}
                      clickable
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(post)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(post.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        {openDialog && (
            <PostForm 
                initialData={editingPost}
                onSubmit={handleFormSubmit}
                onCancel={handleCloseDialog}
                isEditing={!!editingPost}
            />
        )}
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 