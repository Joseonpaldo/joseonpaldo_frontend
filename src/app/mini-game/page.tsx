"use client"

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Minigame from "@/components/mini-game/Minigame";

export default function Page(): React.JSX.Element {
    const [param, setParam] = React.useState(null);

    return (
        <Stack spacing={3}>
            <Minigame param={2} roomNumber={123}/>
        </Stack>
    );
}
