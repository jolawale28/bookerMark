// app/signin/page.tsx
'use client';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
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

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleGoogleSignUp = async () => {
        showMessage('Processing...', 'info', true, false)
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user

            // I use this to check if user already exists in the database
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // If user not exists, create the user document
                await setDoc(userRef, {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp(),
                });
                showMessage(`Success! Welcome, ${firstName} ${lastName}.`, 'success', false, false);
                router.push('/')
            } else {
                console.log("User already exists.");
                try {
                    await signOut(auth); // Sign out user to avoid getting them signed-in without actually completing the process
                    showMessage(`'${user?.email}' already exists! Please sign in instead.`, 'error', false, false);
                    router.push('/signin');
                } catch (error) {
                    console.error('Sign-out failed: ', error);
                }
            }
        } catch (error: any) {
            console.error('Sign-in failed:', error);
            showMessage(error.message, 'error');
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password != confirmPassword) {
            showMessage('Password fields must match', 'error', false, true);
            return
        }

        if (!firstName || !lastName || !email || !password) {
            showMessage('Please fill in all fields', 'error', false, true);
            return
        }

        showMessage('Signing you up...', 'info', true, true);

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;

            // This is to set the displayName
            await updateProfile(user, { displayName: (firstName + ' ' + lastName) || '' });

            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                name: firstName + " " + lastName,
                email: email,
                photoURL: user.photoURL || null,
                createdAt: serverTimestamp(),
            });

            console.log(user, userRef)
            showMessage(`Success! Welcome ${firstName} ${lastName}.`, 'success', false, false);
            router.push('/')
        } catch (error: any) {
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
                <Typography component={'h4'} sx={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>Sign Up</Typography>
                <form onSubmit={handleEmailSignUp}>
                    <TextField
                        fullWidth
                        label="First Name"
                        variant="outlined"
                        margin="normal"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        variant="outlined"
                        margin="normal"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
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
                        slotProps={{ htmlInput: { minLength: 8 } }}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        slotProps={{ htmlInput: { minLength: 8 } }}
                        required
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        color="primary"
                        sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
                    >
                        Sign Up
                    </Button>
                </form>

                <Divider sx={{ my: 3 }}>or</Divider>

                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleSignUp}
                    size="large"
                    sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        bgcolor: '#4285F4',
                        '&:hover': { bgcolor: '#357ABD' }
                    }}
                >
                    Sign-up with Google
                </Button>

                <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
                    Already have an account? <Link href="/signin">Sign In</Link>
                </Typography>
            </Box>
        </Box>
    );
}