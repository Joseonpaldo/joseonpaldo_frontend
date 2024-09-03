'use client';

import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {CustomersTable} from './customers-table';
import Grid from "@mui/material/Unstable_Grid2";
import Winner from "@/components/rank/Winner";

export function RankingPage(): React.JSX.Element {
    const [rankType, setRankType] = useState('2p');
  
    return (
        <>
            <Typography variant="h4">순위</Typography>
            <Stack direction="row" spacing={3}>
            <Stack spacing={1} sx={{flex: '1 1 auto'}}>
                <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                <Button variant="contained" onClick={() => setRankType('2p')}>
                    2p
                </Button>
                <Button variant="contained" onClick={() => setRankType('4p')}>
                    4p
                </Button>
                </Stack>
            </Stack>
            </Stack>
            <Stack spacing={3}>
            <Grid container spacing={3}>
                <Grid lg={6} xs={12}>
                <Winner type={rankType}/>
                </Grid>
    
                <Grid lg={6} xs={12}>
                <CustomersTable type={rankType} />
                </Grid>
            </Grid>
            </Stack>
        </>
    );
  }