import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LinearProgress from '@mui/material/LinearProgress'
import type { Navigation } from '@toolpad/core/AppProvider';

import theme from '../theme';
import NextTopLoader from 'nextjs-toploader';
import Image from 'next/image';

import { AuthProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import { SnackbarProvider } from './components/SnackBarProvider';
import LogoutIcon from '@mui/icons-material/Logout';
import UserAvatar from './components/UserAvatar';

import '@/app/styles/globals.css'

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '',
    title: 'Home',
    icon: <DashboardIcon />,
  },
  // {
  //   segment: 'orders',
  //   title: 'Orders',
  //   icon: <ShoppingCartIcon />,
  // },
  {
    title: 'Sign Out',
    segment: 'signout',
    icon: <LogoutIcon />,
  },
  {
    title: '',
    segment: 'account',
    icon: <UserAvatar />,
  }
];

const BRANDING = {
  title: 'bookMarker',
  description: 'A simple bookmark manager',
  homeUrl: 'https://bookMarker.dev',
  favicon: '/logo.png',
  logo: <Image src="/favicon.png" alt="Logo" width={32} height={35} />
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-toolpad-color-scheme="light" suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <React.Suspense fallback={<LinearProgress />}>
            <AuthProvider>
              <ProtectedRoute>
                <NextAppProvider
                  navigation={NAVIGATION}
                  branding={BRANDING}
                  theme={theme}
                >
                  <SnackbarProvider>
                    {props.children}
                  </SnackbarProvider>
                  <NextTopLoader
                    color="#2299DD"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={2}
                    crawl={true}
                    showSpinner={true}
                    easing="ease"
                    speed={200}
                    shadow="0 0 10px #2299DD,0 0 5px #2299DD"
                    template='<div class="bar" role="bar"><div class="peg"></div></div> 
                <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                    zIndex={1600}
                    showAtBottom={false}
                  />
                </NextAppProvider>
              </ProtectedRoute>
            </AuthProvider>
          </React.Suspense>
        </AppRouterCacheProvider>

      </body>
    </html>
  );
}