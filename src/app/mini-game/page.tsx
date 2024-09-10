"use client"

import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import Lobby from "@/components/game/Lobby";
import App from "@/components/mini-game/snake/App";
import useWindowSizeCustom from "@/hooks/useWindowSizeCustom";
import GameMap from "@/components/mini-game/snake/components/GameMap";
import Roulette from "@/components/game/roulette";
import {useState} from "react";
import {joinRoom} from "@/components/mini-game/snake/websocket";





export default function Page(): React.JSX.Element {
  const windowSizeCustom = useWindowSizeCustom();

  const [roomId, setRoomId] = useState("");

  const handleJoinRoom = () => {
    const generatedRoomId = prompt("방 ID 를 입력하세요:");
    if (generatedRoomId) {
      joinRoom(generatedRoomId); // 방에 입장
      setRoomId(generatedRoomId);
    }
  };

  return (
    <Stack spacing={3}>
      <div style={{
        // scale: 0.3,
        // width: windowSizeCustom.width / ,
      }}>
        {!(roomId === null || roomId === "") ?
          <GameMap roomId={roomId} /> : null
        }

        <button onClick={handleJoinRoom} className="join-room-button">입장하기</button>
      </div>


    </Stack>
  );
}
