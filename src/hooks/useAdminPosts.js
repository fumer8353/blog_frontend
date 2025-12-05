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
      setPosts(response.data);
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