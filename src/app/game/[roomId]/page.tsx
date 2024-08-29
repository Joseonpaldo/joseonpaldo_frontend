import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import Lobby from "@/components/game/Lobby";
import YutPan from "@/components/game/YutPan";
import ChatComponent from "@/components/game/chatComponent";




export const metadata = { title: `In Game | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3} sx={{overflow: "hidden", position: 'relative', height: "100%"}}>
      <YutPan/>
      <ChatComponent/>

    </Stack>
  );
}
