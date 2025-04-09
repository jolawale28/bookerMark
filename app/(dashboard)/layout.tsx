import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer, PageHeader } from '@toolpad/core/PageContainer';
import { Box } from '@mui/material';

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <PageContainer>
        {props.children}
      </PageContainer>
    </DashboardLayout>
  );
}  
