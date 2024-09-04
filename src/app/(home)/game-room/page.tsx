import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import GameRoom from "@/components/userManagement/GameRoom";
import {Button} from "@mui/material";
import {useRouter} from "next/navigation";

export const metadata = { title: `놀이방 | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const handleClickOpen = () => {
    location.href = '/game-room'
  }

  return (
    <Stack spacing={3}>
      {/*<div>*/}
      {/*  <Typography variant="h4">Settings</Typography>*/}
      {/*</div>*/}
      {/*<Notifications />*/}
      {/*<UpdatePasswordForm />*/}
      <GameRoom/>
    </Stack>
  );
}
