import * as React from 'react';
import type {Metadata} from 'next';
import Stack from '@mui/material/Stack';

import {config} from '@/config';
import YutPan from "@/components/game/YutPan";
import ChatComponent from "@/components/game/chatComponent";
import {AuthGuard} from "@/components/auth/auth-guard";


export const metadata = {title: `In Game | ${config.site.name}`} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <AuthGuard>
      <Stack spacing={3} sx={{overflow: "hidden", position: 'relative', height: "100%"}}>
        <YutPan/>
      </Stack>
    </AuthGuard>
  );
}
