import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const user = {
  name: '민석이짱',
  avatar: '/assets/avatar.png',
  twoPlay : '5',
  twoPlayWin: '1',
  fourPlay: '7',
  fourPlayWin: '2',
} as const;

export function AccountInfo(): React.JSX.Element {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              2인 승률
            </Typography>
            <Typography color="text.secondary" variant="h6">
               {user.twoPlay}판 {user.twoPlayWin}승
            </Typography>
            <Divider/>
            <Typography color="text.secondary" variant="body2">
              4인 승률
            </Typography>
            <Typography color="text.secondary" variant="h6">
              {user.fourPlay}판 {user.fourPlayWin}승
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
