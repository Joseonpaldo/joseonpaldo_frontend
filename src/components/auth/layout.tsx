import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'flex' },
        minHeight: '100%',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'flex',}}>
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
