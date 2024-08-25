"use client";

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, provider } from '../../firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Button, Card, CardContent, Typography, Box, Container, TextField, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const SignInPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            console.log("User signed in with Google");
            router.push('/home-page');
        } catch (error) {
            console.error('Error signing in with Google:', error);
            setSnackbarMessage('Error signing in with Google. Please try again.');
            setSnackbarOpen(true);
        }
    };

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 6 characters long');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in with email");
            router.push('/home-page');
        } catch (error) {
            console.error('Error signing in with email:', error);
            setSnackbarMessage('Error signing in. Please check your credentials and try again.');
            setSnackbarOpen(true);
        }
    };

    const handleEmailSignUp = async () => {
        setEmailError('');
        setPasswordError('');

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 6 characters long');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up with email");
            router.push('/home-page');
        } catch (error) {
            console.error('Error signing up with email:', error);
            setSnackbarMessage('Error signing up. Please try again.');
            setSnackbarOpen(true);
        }
    };

    const handleResetPassword = async () => {
        if (!validateEmail(resetEmail)) {
            setSnackbarMessage('Please enter a valid email address');
            setSnackbarOpen(true);
            return;
        }

        try {
            const signInMethods = await fetchSignInMethodsForEmail(auth, resetEmail);
            
            if (signInMethods.length === 0) {
                setSnackbarMessage('No account found with this email address.');
                setSnackbarOpen(true);
            } else {
                await sendPasswordResetEmail(auth, resetEmail);
                setSnackbarMessage('Password reset email sent. Please check your inbox.');
                setSnackbarOpen(true);
                setResetDialogOpen(false);
            }
        } catch (error) {
            console.error('Error handling password reset:', error);
            setSnackbarMessage('Error processing your request. Please try again.');
            setSnackbarOpen(true);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: 400,
                p: 3,
            }}>
                <Card sx={{ width: '100%', boxShadow: 3, '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.3s ease-in-out' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography 
                            component="h1" 
                            variant="h5" 
                            sx={{ 
                                mb: 2, 
                                animation: 'fadeIn 1s ease-in-out', 
                                '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } } 
                            }}
                        >
                            Hi, welcome to Studyfy AI! 👋🏼
                        </Typography>
                        <form onSubmit={handleEmailSignIn}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!emailError}
                                helperText={emailError}
                                sx={{ transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!passwordError}
                                helperText={passwordError}
                                sx={{ transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none', '&:hover': { transform: 'scale(1.05)' }, transition: 'transform 0.2s ease-in-out' }}
                            >
                                Sign In
                            </Button>
                        </form>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 2, py: 1.5, textTransform: 'none', fontWeight: 'bold', '&:hover': { transform: 'scale(1.05)' }, transition: 'transform 0.2s ease-in-out' }}
                            onClick={handleEmailSignUp}
                        >
                            Sign Up
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            sx={{ mt: 1, textTransform: 'none', fontWeight: 'bold', '&:hover': { color: 'primary.main', transition: 'color 0.2s ease-in-out' } }}
                            onClick={() => setResetDialogOpen(true)}
                        >
                            Forgot Password?
                        </Button>
                        <Typography sx={{ mt: 2, mb: 1 }}>Or</Typography>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<GoogleIcon />}
                            onClick={handleGoogleSignIn}
                            sx={{ textTransform: 'none', justifyContent: 'flex-start', padding: '10px 20px', '&:hover': { transform: 'scale(1.05)' }, transition: 'transform 0.2s ease-in-out' }}
                        >
                            Sign in with Google
                        </Button>
                    </CardContent>
                </Card>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                sx={{ animation: 'slideInUp 0.5s ease-in-out', '@keyframes slideInUp': { from: { transform: 'translateY(20px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } } }}
            />
            <Dialog 
                open={resetDialogOpen} 
                onClose={() => setResetDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Enter your email address and we'll send you a link to reset your password.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        sx={{ transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleResetPassword} variant="contained">Reset Password</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SignInPage;
