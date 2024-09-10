import { io } from 'socket.io-client';

const socket = io('/snake',{
  path: "/nws"
});

socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

export function joinRoom(roomId) {
    socket.emit('joinRoom', { roomId: roomId });
}

export default socket;
