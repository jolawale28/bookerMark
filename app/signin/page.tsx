// app/signin/page.tsx
'use client';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button, Box, Typography, Divider, TextField } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Image from 'next/image';
import { useState } from 'react';
import { useSnackbar } from '../components/SnackBarProvider';
import Link from 'next/link';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

export default function SignInPage() {
    const router = useRouter();

    const { showMessage } = useSnackbar();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        showMessage('Signing you in...', 'info', true, true);
        try {
            const signInRef = await signInWithPopup(auth, googleProvider);

            // let's check if user details already exists in the database
            const userRef = doc(db, "users", signInRef.user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // Create record for the user
                await setDoc(userRef, {
                    uid: signInRef.user.uid,
                    name: signInRef.user.displayName,
                    email: signInRef.user.email,
                    photoURL: signInRef.user.photoURL,
                    createdAt: serverTimestamp(),
                });
                showMessage(`Account created! Welcome, ${signInRef.user.displayName}.`, 'success', false, false);
            }
            else {
                showMessage(`Sign-in success! Welcome back ${signInRef.user.displayName}`, 'success', false, false)
            }

            router.push('/');
        } catch (error: any) {
            console.error('Sign-in failed:', error);
            showMessage(error.message, 'error', false, false);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        showMessage('Signing you in...', 'info', true, true);

        if (!email || !password) {
            showMessage('Please fill in all fields', 'error', false, true);
            return
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
            // closeSnackbar()
            showMessage('You are now signed in...', 'success', false, false);
        } catch (error: any) {
            console.log(error.message);
            showMessage(error.message, 'error', false, false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                p: 3
            }}
        >
            {/* Logo Section */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Image
                    src="/favicon.png"
                    alt="Company Logo"
                    width={63}
                    height={60}
                    style={{ borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Typography variant="h5" component="h1" sx={{ mt: 2, fontWeight: 700 }}>
                    Welcome to BookMarker
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '15px' }}>
                    Your personal bookmark manager
                </Typography>
            </Box>

            {/* Sign-In Card */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: '100%',
                    maxWidth: 400
                }}
            >
                <form onSubmit={handleEmailSignIn}>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Box sx = {{display: 'flex', justifyContent: 'flex-end'}}>
                        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            <Link href="/forgot-password">Forgot password?</Link>
                        </Typography>
                    </Box>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        color="primary"
                        sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
                    >
                        Sign In
                    </Button>
                </form>

                <Divider sx={{ my: 3 }}>or</Divider>

                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<GoogleIcon />}
                    onClick={handleSignIn}
                    size="large"
                    sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        bgcolor: '#4285F4',
                        '&:hover': { bgcolor: '#357ABD' }
                    }}
                >
                    Sign-in with Google
                </Button>

                <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
                    Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
                </Typography>
            </Box>
        </Box>
    );
}