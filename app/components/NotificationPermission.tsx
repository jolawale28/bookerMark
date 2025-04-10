// components/NotificationPermission.tsx

import React, { useEffect, useState } from 'react';
import { messaging } from '@/app/lib/firebase'; // Firebase messaging instance
import { getToken } from 'firebase/messaging';
import { Button, IconButton, Snackbar, SnackbarCloseReason } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const NotificationPermission: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);
    const [open, setOpen] = useState(true);

    // Request permission when the user clicks the button
    const requestPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setIsPermissionGranted(true);
                if (messaging) {
                    const token = await getToken(messaging, {
                        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY, // My VAPID key
                    });
                    if (token) {
                        console.log('FCM Token:', token);
                        setToken(token);
                    }
                }
            } else {
                console.error('Notification permission denied');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        requestPermission()
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                YES
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    useEffect(() => {
        // Optionally handle other effects on page load
    }, []);

    return (
        <>
            {
                !isPermissionGranted ? (
                    <Snackbar
                        open={open}
                        autoHideDuration={null}
                        onClose={handleClose}
                        message="Allow notifications?"
                        action={action}
                    />
                ) : (
                    <Snackbar
                        open={open}
                        autoHideDuration={5000}
                        onClose={() => setOpen(false)}
                        message={`Your FCM token: ${token}`}
                    />
                )
            }

        </>
    );
};

export default NotificationPermission;
