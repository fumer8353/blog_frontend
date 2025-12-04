import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Typography,
  Box,
  Alert,
  Divider
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

// Basic styling, can be expanded or customized via props
const cardStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const cardContentStyle = {
  flexGrow: 1,
};

const PostCard = ({ post, type = 'summary' }) => {
  const { user } = useAuth();
  console.log('PostCard - User:', user);
  console.log('PostCard - Post:', post);

  if (!post) return null;

  const numericId = post.id.replace('post:', '');
  const isFullView = type === 'full';

  // Content display logic: if full view or user is logged in, show full content
  const displayContent = isFullView || user 
    ? post.content 
    : post.isPremium 
      ? post.content?.substring(0, 200) + '... (Login to read more)'
      : post.content;

  const renderContentWithParagraphs = (content) => {
    if (!content) return null;
    return content.split('\n').map((paragraph, index) => (
      <Typography 
        key={index} 
        variant="body1" 
        component="div" 
        sx={{ mb: isFullView ? 2 : 0, textAlign: isFullView ? 'justify' : undefined }}
      >
        {paragraph}
      </Typography>
    ));
  };

  const renderActions = () => {
    if (isFullView) return null;

    if (!post.isPremium || user) {
      return (
        <Button
          size="small"
          component={RouterLink}
          to={`/blog/${numericId}`}
          variant="outlined"
        >
          Read More
        </Button>
      );
    }
    return (
      <Box sx={{ width: '100%' }}>
        <Alert severity="info" sx={{ mb: 1, fontSize: '0.8rem' }}>
          Premium content. Please{' '}
          <RouterLink to="/login" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
            log in
          </RouterLink>{' '}
          to read more.
        </Alert>
        <Button
          size="small"
          component={RouterLink}
          to={`/blog/${numericId}`}
          variant="outlined"
        >
          View Preview
        </Button>
      </Box>
    );
  };

  return (
    <Card sx={cardStyle}>
      {isFullView && post.imageUrl && (
        <Box
          component="img"
          src={post.imageUrl}
          alt={post.title}
          sx={{
            width: '100%',
            maxHeight: '400px',
            objectFit: 'cover',
            mb: 2
          }}
        />
      )}
      <CardContent sx={cardContentStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            variant={isFullView ? "h3" : "h5"} 
            component="h1"
            gutterBottom 
            sx={isFullView ? { mb: 2 } : { flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          >
            {post.title}
          </Typography>
          {post.isPremium && (
            <Chip
              label="Premium"
              color="secondary"
              size="small"
              variant="outlined"
              sx={{ ml: 1, whiteSpace: 'nowrap', mt: isFullView ? 1 : 0 }}
            />
          )}
        </Box>
        
        {isFullView && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            {post.categories?.map((category) => (
              <Chip key={category} label={category} size="small" color="primary" variant="outlined" />
            ))}
          </Box>
        )}

        <Box className="blog-post-metadata" sx={{ display: 'flex', gap: 1, color: 'text.secondary', mb: 2 }}>
          <Typography variant="body2">By {post.author}</Typography>
          <Typography variant="body2">
            • {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Box>

        {isFullView && <Divider sx={{ mb: 2 }} />}

        {isFullView ? renderContentWithParagraphs(displayContent) : 
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              display: '-webkit-box', 
              WebkitLineClamp: 3 , 
              WebkitBoxOrient: 'vertical',
              textAlign: 'justify',
              mb: 1
            }}
          >
            {displayContent}
          </Typography>
        }
        
        {!isFullView && post.categories && post.categories.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb:1 }}>
            {post.categories.map((category) => (
              <Chip key={category} label={category} size="small" />
            ))}
          </Box>
        )}
        {!isFullView && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{mt: 'auto'}}>
                Posted by: {post.author} on {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
        )}
        {post.updatedAt !== post.createdAt && (
           <Typography variant="caption" color="text.secondary" display="block" sx={{mt: !isFullView ? 0.5 : 2}}>
             Last updated: {new Date(post.updatedAt).toLocaleDateString()}
           </Typography>
        )}

        {isFullView && post.tags && post.tags.length > 0 && (
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Tags:</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap'}}>
                {post.tags.map((tag) => (
                    <Chip key={tag} label={tag} variant="outlined" size="small" />
                ))}
                </Box>
            </Box>
        )}
      </CardContent>
      {!isFullView && 
        <CardActions sx={{ p: 2, pt: 0, alignSelf: 'flex-start' }}>
          {renderActions()}
        </CardActions>
      }
    </Card>
  );
};

export default PostCard; 