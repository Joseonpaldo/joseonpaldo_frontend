import * as React from 'react';
import type {Metadata} from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import {config} from '@/config';
import type {Customer} from '@/components/dashboard/ranking/customers-table';
import {CustomersTable} from '@/components/dashboard/ranking/customers-table';
import Grid from "@mui/material/Unstable_Grid2";
import Winner from "@/components/rank/Winner";

export const metadata = {title: `순위 | ${config.site.name}`} satisfies Metadata;

const customers = [

  {
    id: 'USR-007',
    name: 'Nasimiyu Danai',
    avatar: '/assets/avatar-7.png',
    fourPlay: 60,
    fourPlayWin: 12
  },
  {
    id: 'USR-006',
    name: 'Iulia Albu',
    avatar: '/assets/avatar-6.png',
    fourPlay: 60,
    fourPlayWin: 12
  },
  {
    id: 'USR-005',
    name: 'Fran Perez',
    avatar: '/assets/avatar-5.png',
    fourPlay: 60,
    fourPlayWin: 12
  },

  {
    id: 'USR-004',
    name: 'Penjani Inyene',
    avatar: '/assets/avatar-4.png',
    fourPlay: 60,
    fourPlayWin: 12
  },
  {
    id: 'USR-003',
    name: 'Carson Darrin',
    avatar: '/assets/avatar-3.png',
    fourPlay: 60,
    fourPlayWin: 12
  },
  {
    id: 'USR-002',
    name: 'Siegbert Gottfried',
    avatar: '/assets/avatar-2.png',
    fourPlay: 60,
    fourPlayWin: 12
  },
  {
    id: 'USR-001',
    name: 'Miron Vitold',
    avatar: '/assets/avatar-1.png',
    fourPlay: 60,
    fourPlayWin: 12
  },
] satisfies Customer[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 10;

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);


  return (
    <Stack spacing={3}>
      <Typography variant="h4">순위</Typography>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{flex: '1 1 auto'}}>
          <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
            <Button variant="contained">
              단체
            </Button>
            <Button variant="contained">
              개인
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid lg={6} xs={12}>
            <Winner/>
          </Grid>

          <Grid lg={6} xs={12}>
            <CustomersTable
              count={paginatedCustomers.length}
              page={page}
              rows={paginatedCustomers}
              rowsPerPage={rowsPerPage}
            />
          </Grid>

        </Grid>
      </Stack>
      {/*<CustomersFilters />*/}

    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
