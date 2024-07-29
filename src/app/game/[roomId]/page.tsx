import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import YutPan from "@/components/game/YutPan";
import ChatComponent from "@/components/game/chatComponent";
import Lobby from "@/components/game/Lobby";

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      {/*<YutPan/>*/}
{/*
      <ChatComponent/>
*/}
      <Lobby/>
    </Stack>
  );
}
