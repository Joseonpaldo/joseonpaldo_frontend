"use client"

import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import Lobby from "@/components/game/Lobby";
import App from "@/components/mini-game/snake/App";
import useWindowSizeCustom from "@/hooks/useWindowSizeCustom";
import GameMap from "@/components/mini-game/snake/components/GameMap";





export default function Page(): React.JSX.Element {
  const windowSizeCustom = useWindowSizeCustom();

  return (
    <Stack spacing={3}>
      <div style={{
        // scale: 0.3,
        // width: windowSizeCustom.width / ,
      }}>
        <GameMap roomId={11} />
      </div>


    </Stack>
  );
}
