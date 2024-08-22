"use client"

import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import Lobby from "@/components/game/Lobby";
import App from "@/components/mini-game/App";
import useWindowSizeCustom from "@/hooks/useWindowSizeCustom";





export default function Page(): React.JSX.Element {
  const windowSizeCustom = useWindowSizeCustom();

  return (
    <Stack spacing={3}>
      <div style={{
        // scale: 0.3,
        // width: windowSizeCustom.width / ,
      }}>
      <App/>
      </div>


    </Stack>
  );
}
