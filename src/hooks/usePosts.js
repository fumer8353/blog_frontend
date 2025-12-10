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
      
      // Ensure we always have an array
      let postsData = response.data;
      
      // Handle different response formats
      if (Array.isArray(postsData)) {
        setPosts(postsData);
      } else if (postsData && Array.isArray(postsData.posts)) {
        // Handle wrapped response like { posts: [...] }
        setPosts(postsData.posts);
      } else if (postsData && Array.isArray(postsData.data)) {
        // Handle wrapped response like { data: [...] }
        setPosts(postsData.data);
      } else {
        // If response is not an array, log warning and set empty array
        console.warn('API response is not an array:', postsData);
        setPosts([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      if (err.code === 'ECONNREFUSED') {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else if (err.response) {
        setError(err.response.data?.error || 'Error fetching posts');
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