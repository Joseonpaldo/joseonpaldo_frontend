import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { Notifications } from '@/components/dashboard/settings/notifications';
import { UpdatePasswordForm } from '@/components/dashboard/settings/update-password-form';
import GameRoom from "@/components/userManagement/GameRoom";

export const metadata = { title: `놀이방 | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">놀이방</Typography>
      {/*<div>*/}
      {/*  <Typography variant="h4">Settings</Typography>*/}
      {/*</div>*/}
      {/*<Notifications />*/}
      {/*<UpdatePasswordForm />*/}
      <GameRoom/>
    </Stack>
  );
}
