import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const usePost = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchPost = useCallback(async () => {
    if (!postId) {
      setLoading(false);
      setError('No post ID provided.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const numericId = postId.replace('post:', '');
      console.log('Current user:', user);
      console.log('Fetching post for ID:', numericId);

      const response = await api.get(`/api/posts/${numericId}`);
      console.log('Post response:', response.data);
      setPost(response.data);
    } catch (err) {
      console.error('Error fetching post:', err);
      if (err.code === 'ECONNREFUSED') {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else if (err.response) {
        setError(err.response.data.error || 'Failed to fetch post');
      } else {
        setError(err.message || 'Failed to fetch post');
      }
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [postId, user]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, refetchPost: fetchPost };
};

export default usePost;
