import * as React from 'react';
import type {Metadata} from 'next';
import Stack from '@mui/material/Stack';

import {config} from '@/config';
import { RankingPage } from '@/components/dashboard/ranking/component-page';

export const metadata = {title: `순위 | ${config.site.name}`} satisfies Metadata;

// const customers = [

//   {
//     id: 'USR-007',
//     name: 'Nasimiyu Danai',
//     avatar: '/assets/avatar-7.png',
//     fourPlay: 60,
//     fourPlayWin: 12
//   },
//   {
//     id: 'USR-006',
//     name: 'Iulia Albu',
//     avatar: '/assets/avatar-6.png',
//     fourPlay: 60,
//     fourPlayWin: 12
//   },
//   {
//     id: 'USR-005',
//     name: 'Fran Perez',
//     avatar: '/assets/avatar-5.png',
//     fourPlay: 60,
//     fourPlayWin: 12
//   },

//   {
//     id: 'USR-004',
//     name: 'Penjani Inyene',
//     avatar: '/assets/avatar-4.png',
//     fourPlay: 60,
//     fourPlayWin: 12
//   },
//   {
//     id: 'USR-003',
//     name: 'Carson Darrin',
//     avatar: '/assets/avatar-3.png',
//     fourPlay: 60,
//     fourPlayWin: 12
//   },
//   {
//     id: 'USR-002',
//     name: 'Siegbert Gottfried',
//     avatar: '/assets/avatar-2.png',
//     fourPlay: 60,
//     fourPlayWin: 12
//   },
//   {
//     id: 'USR-001',
//     name: 'Miron Vitold',
//     avatar: '/assets/avatar-1.png',
//     fourPlay: 60,
//     fourPlayWin: 12
//   },
// ] satisfies Customer[];

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <RankingPage />
      {/*<CustomersFilters />*/}
    </Stack>
  );
}