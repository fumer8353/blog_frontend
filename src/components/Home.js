import React from 'react';
// import { Link } from 'react-router-dom'; // No longer needed directly
import {
  // Container, Typography, // Handled by PageLayout
  Grid,
  // Alert, CircularProgress // Handled by PageLayout
} from '@mui/material';
import usePosts from '../hooks/usePosts';
// import Header from './Header'; // Handled by PageLayout
// import Footer from './Footer'; // Handled by PageLayout
import PostCard from './common/PostCard';
import PageLayout from './common/PageLayout'; // Import PageLayout
import '../styles/Home.css'; // Review this later

const Home = () => {
  const { posts, loading, error } = usePosts();

  // Loading and error display will be handled by PageLayout

  return (
    <PageLayout pageTitle="Blog Posts" loading={loading} error={error}>
      {/* The main content specific to Home.js goes here */}
      {!loading && !error && (
        <Grid container spacing={3} className="blog-grid">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <PostCard post={post} type="summary" />
              </Grid>
            ))
          ) : (
            <p>No posts available at the moment. Check back soon!</p> // Refined message
          )}
        </Grid>
      )}
    </PageLayout>
  );
};

export default Home; 