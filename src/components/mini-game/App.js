"use client"

import React, { useState, useEffect } from 'react';
import Game from './components/game';
import AlienViewer from './components/AlienViewer';
import Viewer from './components/viewer';
import AlienShooter from './components/AlienShooter';
import io from 'socket.io-client';

const socket = io('https://joseonpaldo.site/nws');

const App = () => {
  const [role, setRole] = useState(null);
  const [gameType, setGameType] = useState(null);

  useEffect(() => {
    if (gameType) {
      socket.emit('joinGame', gameType);
    }
  }, [gameType]);

  useEffect(() => {
    socket.on('role', (assignedRole) => {
      console.log('Assigned role:', assignedRole);
      console.log(socket);
      setRole(assignedRole);
    });

    socket.on('connect_error', (err) => {
      console.log(socket);
      console.error('Connection Error:', err);
    });

    return () => {
      socket.off('role');
    };
  }, []);

  const handleGameSelection = (selectedGameType) => {
    setGameType(selectedGameType);
  };

  if (!gameType) {
    return (
      <div>
        <button onClick={() => handleGameSelection('alienShooting')}>Join Alien Shooting Game</button>
        <button onClick={() => handleGameSelection('platformer')}>Join Platformer Game</button>
      </div>
    );
  }

  if (role === null) {
    return <div>Connecting...</div>;
  }

  return (
    <div>
      {role === 'host' && gameType === 'alienShooting' && <AlienShooter socket={socket} gameType="alienShooting" />}
      {role === 'viewer' && gameType === 'alienShooting' && <AlienViewer socket={socket} />}
      {role === 'host' && gameType === 'platformer' && <Game socket={socket} gameType="platformer" />}
      {role === 'viewer' && gameType === 'platformer' && <Viewer socket={socket} />}
    </div>
  );
};

export default App;
