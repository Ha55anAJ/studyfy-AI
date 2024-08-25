"use client";
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  Box,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#FFFFFF', 
      },
      secondary: {
        main: '#000000', 
      },
      tertiary: {
        main: '#970747', 
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease-in-out',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
    },
  });

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'tertiary.main' }}>
              STUDYFY
            </Typography>
            <IconButton onClick={handleThemeChange} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: 'linear-gradient(1deg, #FFFFFF, #990747)',
            color: 'white',
            px: 3,
            py: 6,
          }}
        >
          <Box sx={{ maxWidth: '800px' }}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                animation: 'fadeIn 1s ease-in-out',
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            >
              Welcome to STUDYFY
            </Typography>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                animation: 'fadeIn 1.5s ease-in-out',
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            >
              Transform your YouTube videos into concise summaries, notes, and quizzes.
            </Typography>

            <Box
              sx={{
                mt: 4,
                animation: 'slideInUp 2s ease-in-out',
                '@keyframes slideInUp': {
                  from: { transform: 'translateY(20px)', opacity: 0 },
                  to: { transform: 'translateY(0)', opacity: 1 },
                },
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mx: 1, px: 3 }}
              >
                <a href='/signin' style={{ color: 'inherit', textDecoration: 'none' }}>
                  Get Started
                </a>
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{ mx: 1, px: 3 }}
              >
                <a href="/learn-more" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Learn More
                </a>
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ py: 4, px: 3, bgcolor: 'background.default' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  Instant Summaries
                </Typography>
                <Typography>
                  Our AI-powered tool quickly generates summaries of your favorite YouTube videos.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  Automatic Notes
                </Typography>
                <Typography>
                  Receive organized notes that highlight the essential points of the video content.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  Interactive Quizzes
                </Typography>
                <Typography>
                  Test your knowledge with quizzes tailored to the video’s content.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ bgcolor: 'primary.main', color: 'tertiary.main', py: 3, mt: 'auto' }}>
          <Typography variant="body2" align="center">
            &copy; {new Date().getFullYear()} Studyfy. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
