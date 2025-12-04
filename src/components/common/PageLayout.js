import React from 'react';
import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Typography
} from '@mui/material';
import Header from '../Header'; // Adjust path if Header/Footer are moved or structure changes
import Footer from '../Footer';

const PageLayout = ({ children, loading, error, pageTitle, containerMaxWidth = 'lg' }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth={containerMaxWidth} sx={{ flexGrow: 1, py: 3, mt: { xs: 2, sm: 3 } , mb: { xs: 2, sm: 3 } }}>
        {pageTitle && (
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3 }}>
            {pageTitle}
          </Typography>
        )}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(60vh)' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ml: 2}}>Loading content...</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {typeof error === 'string' ? error : 'An unexpected error occurred. Please try again later.'}
          </Alert>
        ) : (
          children
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default PageLayout; 