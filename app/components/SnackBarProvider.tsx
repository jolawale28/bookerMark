'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Button, Alert, CircularProgress } from '@mui/material';

type SnackbarContextType = {
    showMessage: (message: string, severity: string, loading?: boolean, variant?: boolean) => void;
    closeSnackbar: () => void
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);
    const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
    const [variant, setVariant] = useState<'filled' | 'standard'>('standard');

    const showMessage = (msg: string, severity: string, loading?: boolean, variant?: boolean) => {
        // If snackbar is open with the same message, do nothing
        if (open && msg === message) return;

        // If snackbar is already open, close it first before showing the next one
        if (open) {
            setOpen(false);
            setTimeout(() => {
                setMessage(msg);
                setSeverity(severity as 'success' | 'error' | 'info' | 'warning');
                setLoading(loading ?? false);
                setVariant(variant ? 'filled' : 'standard');
                setOpen(true);
            }, 200); // give time for exit animation
        } else {
            setMessage(msg);
            setSeverity(severity as 'success' | 'error' | 'info' | 'warning');
            setLoading(loading ?? false);
            setVariant(variant ? 'filled' : 'standard');
            setOpen(true);
        }
    };

    const handleClose = () => setOpen(false);

    const action = (
        <Button color="secondary" size="small" onClick={handleClose}>
            CLOSE
        </Button>
    );

    return (
        <SnackbarContext.Provider value={{ showMessage, closeSnackbar: handleClose }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={loading ? null: 5000}
                onClose={handleClose}
                message={message}
                action={action}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant={variant}
                    sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}
                    icon={
                        loading ? <CircularProgress size={20} color="inherit" /> : undefined
                    }
                >
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
