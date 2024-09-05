import React, { useState, useEffect } from 'react';
import Race from './Race';
import './RankAnimation.css';
import Button from "@mui/material/Button";

const RankAnimation = ({ players, roomId, stompClient }) => {
  const [currentRank, setCurrentRank] = useState(0);
  const [displayedPlayers, setDisplayedPlayers] = useState([]);
  const [sortedPlayers, setSortedPlayers] = useState([]);

  useEffect(() => {
    // players 배열이 존재하고 길이가 0보다 큰 경우에만 실행
    if (players && players.length > 0) {
      console.log("Initial players: ", players);

      // speed에 따라 players 배열을 내림차순으로 정렬
      const sorted = players.sort((a, b) => b.speed - a.speed);
      setSortedPlayers(sorted);

      console.log("Sorted players: ", sorted);
    }
  }, [players]);

  useEffect(() => {
    if (currentRank < sortedPlayers.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedPlayers(prev => [...prev, sortedPlayers[currentRank]]);
        setCurrentRank(currentRank + 1);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else if (currentRank === sortedPlayers.length) {
      // 모든 순위가 공개된 후 서버로 데이터를 전송
      const rankings = sortedPlayers.map((player, index) => ({
        name: player.name,
        userId: player.userId, // 여기서 userId 사용
        rank: index + 1
      }));

      console.log("Rankings being sent: ", rankings);

      // 서버로 순위 데이터 전송
      if (stompClient && stompClient.connected) {
        stompClient.send(`/app/chat.updateRank/${roomId}`, {}, JSON.stringify(rankings));
      }
    }
  }, [currentRank, sortedPlayers, stompClient, roomId]);



  const isHost = players.length > 0 && players[0].isHost;

  if (!players || players.length === 0) {
    return null;
  }

  return (
    <div className="rank-animation-container">
      <div className="ball-mixing-container">
        <Race players={players} />
      </div>
      <div className="rank-display-container">
        {displayedPlayers.map((player, index) => (
          <div key={index} className="rank-ball" style={{ animation: `reveal 1s ease-in-out ${index * 2}s forwards` }}>
            <span className="rank-text">{index + 1}위: {player.name}</span>
          </div>
        ))}
      </div>
      <br /><br />
      {isHost && (
        <Button
          style={{ backgroundColor: '#007bff', color: 'black', boxShadow: '3px 3px 3px gray', width: '100px' }}
          onClick={() => console.log('Game Start!')}
        >
          시작
        </Button>
      )}
    </div>
  );
};

export default RankAnimation;
