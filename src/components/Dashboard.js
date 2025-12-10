import React from 'react';
import {
  Grid,
} from '@mui/material';
import usePosts from '../hooks/usePosts';
import PostCard from './common/PostCard';
import PageLayout from './common/PageLayout';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { posts, loading, error } = usePosts();

  // Ensure posts is always an array to prevent .map() errors
  const safePosts = Array.isArray(posts) ? posts : [];

  return (
    <PageLayout 
      pageTitle="Tech Blog Dashboard" 
      loading={loading} 
      error={error}
      sx={{ backgroundColor: '#f5f5f5' }}
    >
      {!loading && !error && (
        <Grid container spacing={3} className="blog-grid">
          {safePosts.length > 0 ? (
            safePosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <PostCard post={post} type="summary" />
              </Grid>
            ))
          ) : (
            <p>No posts to display. Start by exploring other blog posts or check back later!</p>
          )}
        </Grid>
      )}
    </PageLayout>
  );
};

export default Dashboard; 