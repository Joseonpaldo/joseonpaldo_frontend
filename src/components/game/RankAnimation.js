import React, {useEffect, useState} from 'react';
import Race from './Race'; // Race 컴포넌트를 가져옵니다.
import './RankAnimation.css';
import Button from "@mui/material/Button";
import {useParams} from "next/navigation";

const RankAnimation = ({players, userData, client}) => {
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

  // userData와 players가 모두 존재하고 players 배열이 비어있지 않은 경우만 isHost를 계산
  const isHost = players[0]?.user_id == userData?.user_id;

  if (!players || players.length === 0) {
    return null;
  }

  const {roomId} = useParams();

  const mainGameStart = () => {
    if (displayedPlayers != null) {
      client.send(`/app/chat.mainGameStart/${roomId}`, {}, JSON.stringify({
        displayedPlayers
      }));
    }
  }

  return (
    <div className="rank-animation-container">
      <div className="ball-mixing-container">
        {/* 입장 순서대로 레이스 컴포넌트에 원래의 players 전달 */}
        <Race players={players}/>
      </div>
      <div className="rank-display-container">
        {displayedPlayers.map((player, index) => (
          <div key={index} className="rank-ball" style={{animation: `reveal 1s ease-in-out ${index * 2}s forwards`}}>
            <span className="rank-text">{index + 1}위: {player.nickname}</span>
          </div>
        ))}
      </div>
      <br /><br />
      {isHost && (
        <Button
          style={{backgroundColor: '#007bff', color: 'black', boxShadow: '3px 3px 3px gray', width: '100px'}}
          onClick={mainGameStart}
        >
          시작
        </Button>
      )}
    </div>
  );
};

export default RankAnimation;
