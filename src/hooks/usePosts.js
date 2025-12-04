import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { API_ENDPOINTS } from '../constants';

const usePosts = (customEndpoint) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = customEndpoint || API_ENDPOINTS.POSTS.LIST;
      console.log('Fetching posts from:', endpoint);
      const response = await api.get(endpoint);
      console.log('Posts response:', response.data);
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      if (err.code === 'ECONNREFUSED') {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else if (err.response) {
        setError(err.response.data.error || 'Error fetching posts');
      } else {
        setError(err.message || 'Error fetching posts');
      }
      setPosts([]); // Clear posts on error
    } finally {
      setLoading(false);
    }
  }, [customEndpoint]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetchPosts: fetchPosts };
};

export default usePosts; 