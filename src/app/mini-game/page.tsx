"use client"

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Minigame from "@/components/mini-game/Minigame";

export default function Page(): React.JSX.Element {
    const [param, setParam] = React.useState<number | null>(null);
    const [roomNumber, setRoomNumber] = React.useState<number | null>(null);

    React.useEffect(() => {
      const inputA: string | null = prompt("Please enter roomNumber:");
      const a: number | null = inputA ? parseInt(inputA) : null; // Provide a default value for the room number
      setRoomNumber(a);
      const inputB: string | null = prompt("Please enter game:");
      const b:number | null = inputB ? parseInt(inputB) : null;
      setParam(b);
    });

    return (
        <Stack spacing={3}>
            <Minigame roomNumber={roomNumber} param={param} javaSocket={null} player={null} />
        </Stack>
    );
}
