import React, {useEffect, useState} from 'react';
import Snake from './Snake';
import PlayerList from './PlayerList';
import '../styles.css';
import {io} from "socket.io-client";

function GameMap({roomId}) {
  const [players, setPlayers] = useState({});
  const [foods, setFoods] = useState([]);
  const [countdown, setCountdown] = useState(0); // 카운트다운 초기값을 0으로 설정
  const [gameStarted, setGameStarted] = useState(false); // 게임 시작 여부
  const [waiting, setWaiting] = useState(true); // 대기 상태 관리
  const [client, setClient] = useState(null);


  useEffect(() => {
    const socket = io('/snake', {
      path: "/nws"
    });
    setClient(socket);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.emit('joinRoom', {roomNum: roomId});

    // 서버에서 모든 플레이어가 입장하면 카운트다운 시작 이벤트를 수신
    socket.on('startCountdown', () => {
      setCountdown(10); // 카운트다운 초기화
      setGameStarted(false); // 카운트다운 중에는 게임 시작되지 않음
      setWaiting(false); // 대기 상태 종료

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval); // 카운트다운이 끝나면 타이머 제거
            setGameStarted(true); // 카운트다운 종료 후 게임 시작
            socket.emit('countdownFinished'); // 서버에 카운트다운 완료 이벤트 전송
          }
          return prev - 1;
        });
      }, 1000);
    });

    // 서버에서 게임 상태를 수신하여 플레이어 및 음식 상태 업데이트
    socket.on('gameState', (gameState) => {
      setPlayers(gameState.players);
      setFoods(gameState.foods);
      console.log("im am receiving data");
    });

    return () => {
      socket.off('startCountdown'); // 이벤트 클린업
      socket.off('gameState');
    };
  }, [roomId]);

  // 뱀의 방향을 조작하는 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted) return; // 게임 시작 전에는 움직임 차단
      let direction;
      switch (e.key) {
        case 'w':
          direction = {x: 0, y: -1}; // 위쪽
          break;
        case 's':
          direction = {x: 0, y: 1}; // 아래쪽
          break;
        case 'a':
          direction = {x: -1, y: 0}; // 왼쪽
          break;
        case 'd':
          direction = {x: 1, y: 0}; // 오른쪽
          break;
        default:
          return;
      }
      client.emit('gameState', direction);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted]);

  return (
    <div className="game-container">
      <div className="info-panel">
        <h1>스네이크 게임</h1>
        <p>4인용 스네이크 게임에 오신 것을 환영합니다!</p>
        <p>방 ID: {roomId}</p>
        <p>스네이크 게임의 규칙은 다음과 같습니다:</p>
        <p>사방이 막혀있는 네모난 공간에 플레이어가 조종하는 뱀 한 마리가 놓여집니다. 뱀은 현재 머리가 향하고 있는 방향으로 멈추지 않고 이동할 수 있으며 플레이어의 조작으로는 머리가 진행하는 방향만 바꿀
          수 있습니다. 화면에 랜덤으로 먹이가 생성되고 뱀이 먹이를 먹으면 먹을수록 꼬리가 길어집니다. 그리고 뱀의 머리가 자신의 몸통과 닿거나 벽 또는 다른 뱀과 충돌하게 되면 게임에서 패배하게 됩니다.
          먹이를 많이 먹을수록 점수가 증가하게 되고 최종적으로 살아남은 플레이어가 승리하게 됩니다! (단, 먹이 점수에 따라 순위가 변동될 수 있습니다.)</p>
        <p>일반 사과: 개당 10점, 꼬리 길이가 1씩 늘어남</p>
        <p>황금 사과: 개당 50점, 꼬리 길이가 5씩 늘어남</p>
        <br/>
        <h2>조작법:</h2>
        <ul>
          <li><strong>w:</strong> 상단으로 이동</li>
          <li><strong>a:</strong> 좌측으로 이동</li>
          <li><strong>s:</strong> 하단으로 이동</li>
          <li><strong>d:</strong> 우측으로 이동</li>
        </ul>
      </div>

      <div className="game-map">
        {/* 플레이어들의 뱀을 그립니다 */}
        {Object.values(players).map((player) => (
          <Snake
            key={player.id}
            segments={player.snake}
            direction={player.direction}
            color={player.color}
          />
        ))}

        {/* 음식들을 그립니다 */}
        {foods.map((food, index) => (
          <div
            key={index}
            className={`food ${food.type}`}
            style={{
              left: `${food.x * 20}px`,
              top: `${food.y * 20}px`,
            }}
          />
        ))}

        {/* 카운트다운 중일 때 카운트다운을 표시합니다 */}
        {countdown > 0 && (
          <div className="countdown-overlay">
            <div className="countdown-timer">{countdown}</div>
          </div>
        )}

        {/* 대기 중 메시지: 모든 플레이어가 입장하지 않았을 때 */}
        {waiting && (
          <div className="waiting-overlay">
            <div className="waiting-text">대기 중...</div>
          </div>
        )}
      </div>

      {/* 플레이어 목록 */}
      <PlayerList players={players}/>
    </div>
  );
}

export default GameMap;
