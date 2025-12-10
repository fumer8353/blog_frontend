import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const useAdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }
      // Use shared API client (baseURL set per environment)
      const response = await api.get(`/api/admin/posts`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
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
      console.error('Error fetching admin posts:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Error fetching admin posts';
      setError(errorMessage);
      setPosts([]); // Clear posts on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminPosts();
  }, [fetchAdminPosts]);

  return { posts, loading, error, refetchAdminPosts: fetchAdminPosts, setPosts }; // Expose setPosts for optimistic updates if needed
};

export default useAdminPosts; 