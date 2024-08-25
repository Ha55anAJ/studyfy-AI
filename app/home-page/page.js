"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  Box,
  TextField,
  IconButton,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Brightness1, Brightness4, Brightness7 } from '@mui/icons-material';

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [isTranscriptProcessed, setIsTranscriptProcessed] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `
Welcome to Studyfy AI, your personalized study assistant! I will help you understand and engage with the content of your chosen YouTube video by performing the following tasks:

    1. Summarize the video to provide you with a concise overview.
    2. Extract important points to highlight key takeaways.
    3. Create at least 10 quiz questions to test your understanding.
    4. Encourage you to write a summary of the topic in your own words.
    5. Provide feedback on the summary you wrote to help you improve.
    6. Answer any questions you have about the topic.
`,
    },
  ]);

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

  const handleInputChange = (event) => {
    setYoutubeUrl(event.target.value);
  };

  const handleSummarizeClick = () => {
    console.log('Summarizing video:', youtubeUrl);
    setYoutubeUrl(youtubeUrl);
    handleFetchTranscript(); // Start the transcript fetching process
  };

  // const cleanTranscript = (transcriptText) => {
  //   // Remove common end phrases that are not relevant
  //   return transcriptText.replace(/(Please don.*$)/i, '').trim();
  // };

  const sendTranscriptToChatbot = async (transcriptText) => {
    setIsLoading(true);
    try {
      // Making the fetch call
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ role: 'user', content: transcriptText }]),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Attempt to parse the entire response as text
      const chatbotResponse = await response.text();
  
      console.log('Chatbot Response:', chatbotResponse); // Debugging log
  
      // Update the messages with the chatbot's response
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: chatbotResponse },
      ]);
      setIsTranscriptProcessed(true);
  
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleFetchTranscript = async () => {
    try {
      const videoId = youtubeUrl.split('v=')[1];
      const response = await fetch(`/api/transcript?videoId=${videoId}`);
      const data = await response.json();

      if (response.ok) {
        let transcriptText = data.transcript.map(item => item.text).join(' ');
        setTranscriptText(transcriptText); // Update the transcript state
        setMessages((messages) => [
          ...messages,
          { role: 'assistant', content: "Press learn to start your lesson!" },
        ]);
        console.log('Transcript Text:', transcriptText);
        await sendTranscriptToChatbot(transcriptText);
      } else {
        setMessages((messages) => [
          ...messages,
          { role: 'assistant', content: "An error occured while processing the video! Please try again later." },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch transcript:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "Failed to fetch transcript. Please check the console for more details." },
      ]);
    }
  };

  

  const handleButtonClick = async (prompt) => {
    if (isLoading || !isTranscriptProcessed) return;
    setIsLoading(true);

    setMessages((messages) => [
      ...messages,
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ role: 'user', content: prompt }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }

    setIsLoading(false);
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color='primary'>
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
          <Box sx={{ maxWidth: '600px' }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                animation: 'fadeIn 1s ease-in-out',
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            >
              Transform Videos into Knowledge
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                animation: 'fadeIn 1.5s ease-in-out',
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            >
              Enter a YouTube link to get a summary, notes, and a quiz based on the content.
            </Typography>

            <Box
              sx={{
                mt: 4,
                width: '100%',
                maxWidth: '600px',
                mx: 'auto',
                animation: 'slideInUp 2s ease-in-out',
                '@keyframes slideInUp': {
                  from: { transform: 'translateY(20px)', opacity: 0 },
                  to: { transform: 'translateY(0)', opacity: 1 },
                },
              }}
            >
              <TextField
                fullWidth
                value={youtubeUrl}
                onChange={handleInputChange}
                sx={{ bgcolor: 'white', borderRadius: 1 }}
              />
              <Button
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSummarizeClick}
              >
                Process Video
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Chat Messages */}
        <Box sx={{ py: 4, px: 3, bgcolor: 'black' }}>
          <div className="chat-window" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
  <div key={index} className={`message ${msg.role}`}>
    <pre style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</pre>
  </div>
))}
            <div ref={messagesEndRef} />
          </div>

          <div className="button-group" style={{ marginTop: '20px' }}>
            <Button 
            sx = {{ mx: 1, px: 3, 
              bgcolor : 'white',
            }}
            color='secondary'
            onClick={() => handleButtonClick('Please summarize it from the provided transcript.')}>Learn
            </Button>
          </div>
        </Box>

        <Box sx={{ bgcolor: 'black', color: 'tertiary.main', py: 3, mt: 'auto' }}>
          <Typography variant="body2" align="center">
            &copy; {new Date().getFullYear()} Studyfy. All rights reserved.
            </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
