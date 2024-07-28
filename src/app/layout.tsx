import * as React from 'react';
import type {Metadata, Viewport} from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import {config} from "@/config";

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  icons: {
    icon : "/favicon.png",
  }
} satisfies Metadata;

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <LocalizationProvider>
          <UserProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </UserProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
