// components/RegisterSW.tsx

'use client';

import { useEffect } from 'react';

const RegisterSW: React.FC = () => {
    useEffect(() => {
        // Check if the browser supports service workers
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/firebase-messaging-sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }, []);

    return null;
};

export default RegisterSW;