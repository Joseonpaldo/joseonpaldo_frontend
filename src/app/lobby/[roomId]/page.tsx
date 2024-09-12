import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import Lobby from "@/components/game/Lobby";
import Gameover from "@/components/game/Gameover";




export const metadata = { title: `Lobby | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>

      <Lobby/>
      {/*<Gameover/>*/}
    </Stack>
  );
}
