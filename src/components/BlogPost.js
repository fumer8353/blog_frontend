import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  // Container, CircularProgress, Alert // Handled by PageLayout
  Button,
  Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import Header from './Header'; // Handled by PageLayout
// import Footer from './Footer'; // Handled by PageLayout
import usePost from '../hooks/usePost';
import PostCard from './common/PostCard';
import PageLayout from './common/PageLayout'; // Import PageLayout
import '../styles/BlogPost.css'; // Review this later

const BlogPost = () => {
  const { id } = useParams();
  const { post, loading, error } = usePost(id);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // The pageTitle for PageLayout can be set dynamically once the post loads,
  // or we can pass a generic one initially and update it if PostCard doesn't show the title prominently enough at the top.
  // For now, PostCard with type="full" should make the title very clear.

  return (
    <PageLayout 
      loading={loading} 
      error={error || (!loading && !post ? 'Post not found.' : null)} // Combine error states
      containerMaxWidth="md" // BlogPost page is typically narrower
      // pageTitle={post ? post.title : "Blog Post"} // Optionally set dynamic title
    >
      {!loading && !error && post && (
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={handleGoBack}
            sx={{ mb: 2, alignSelf: 'flex-start' }}
          >
            Go Back
          </Button>
          <PostCard post={post} type="full" />
        </Box>
      )}
      {/* If !post and no error from hook, PageLayout will show its own error or we rely on the combined error prop */}
    </PageLayout>
  );
};

export default BlogPost; 