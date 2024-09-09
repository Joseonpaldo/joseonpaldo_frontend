import React, { useState } from 'react';
import GameMap from './components/GameMap';
import './styles.css';
import { joinRoom } from './websocket';

function App() {
    const [roomId, setRoomId] = useState(null);

    const handleJoinRoom = () => {
        const generatedRoomId = prompt("방 ID 를 입력하세요:");
        if (generatedRoomId) {
            joinRoom(generatedRoomId); // 방에 입장
            setRoomId(generatedRoomId);
        }
    };

    return (
        <div className="App">
            {roomId ? (
                <GameMap roomId={roomId} />
            ) : (
                <div className="join-room-container">
                    <h1>스네이크 게임</h1>
                    <button onClick={handleJoinRoom} className="join-room-button">입장하기</button>
                </div>
            )}
        </div>
    );
}

export default App;
