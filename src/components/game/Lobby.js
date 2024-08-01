"use client";
import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Lobby.css';

const initializeLadder = (numPlayers) => {
  const ladder = Array.from({ length: numPlayers * 2 }, () => Array(numPlayers - 1).fill(false));
  return ladder;
};

const generateLadderConnections = (ladder) => {
  for (let i = 0; i < ladder.length - 1; i++) {
    const randomPosition = Math.floor(Math.random() * (ladder[0].length));
    ladder[i][randomPosition] = true;
    ladder[i + 1][randomPosition] = true;
  }
  return ladder;
};

const determineOrder = (ladder, players) => {
  const order = [];
  for (let i = 0; i < players.length; i++) {
    let position = i;
    for (let j = 0; j < ladder.length; j++) {
      if (ladder[j][position]) {
        position += 1;
      } else if (position > 0 && ladder[j][position - 1]) {
        position -= 1;
      }
    }
    order[position] = players[i];
  }
  return order;
};

const Lobby = () => {
  const [players, setPlayers] = useState([]);
  const [readyStates, setReadyStates] = useState({});
  const [allReady, setAllReady] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [client, setClient] = useState(null);
  const [ladder, setLadder] = useState([]);
  const [playerOrder, setPlayerOrder] = useState([]);
  const [showLadder, setShowLadder] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      console.log('Connected to WebSocket');
      setClient(stompClient);
      stompClient.subscribe('/topic/public', (message) => {
        onMessageReceived(JSON.parse(message.body));
      });
      stompClient.subscribe(`/user/queue/players`, (message) => {
        onExistingPlayersReceived(JSON.parse(message.body));
      });
      stompClient.send('/app/chat.addUser', {}, JSON.stringify({ sender: `플레이어-${Math.random().toString(36).substring(7)}`, type: 'JOIN' }));
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    checkAllReady();
  }, [players, readyStates]);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(countdownInterval);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
      setShowLadder(true);
      animateLadder();
    }
  }, [showCountdown, countdown]);

  const onMessageReceived = (message) => {
    if (message.type === 'JOIN') {
      setPlayers(prevPlayers => {
        if (prevPlayers.length < 4 && !prevPlayers.find(player => player.name === message.sender)) {
          const newPlayers = [...prevPlayers, { name: message.sender, ready: false }];
          if (newPlayers.length === 1) setIsHost(true);
          return newPlayers;
        }
        return prevPlayers;
      });
    } else if (message.type === 'READY') {
      setReadyStates(prevStates => ({
        ...prevStates,
        [message.sender]: message.ready
      }));
      setPlayers(prevPlayers => prevPlayers.map(p => p.name === message.sender ? { ...p, ready: message.ready } : p));
    } else if (message.type === 'LEAVE') {
      setPlayers(prevPlayers => prevPlayers.filter(p => p.name !== message.sender));
    }
  };

  const onExistingPlayersReceived = (message) => {
    if (message.type === 'EXISTING_PLAYERS') {
      const existingPlayers = message.content.split(',');
      const updatedPlayers = existingPlayers.map(player => ({ name: player, ready: false }));
      setPlayers(prevPlayers => [...prevPlayers, ...updatedPlayers]);
    }
  };

  const checkAllReady = () => {
    if (players.length > 1) {
      const allReady = players.every(player => readyStates[player.name] === true);
      setAllReady(allReady);
    } else {
      setAllReady(false);
    }
  };

  const handleReadyClick = (player) => {
    if (client && client.connected) {
      const updatedReadyState = !player.ready;
      client.send('/app/chat.ready', {}, JSON.stringify({ sender: player.name, type: 'READY', ready: updatedReadyState }));
    }
  };

  const handleStartGame = () => {
    if (allReady && isHost) {
      const ladder = initializeLadder(players.length);
      const ladderWithConnections = generateLadderConnections(ladder);
      const order = determineOrder(ladderWithConnections, players);
      setLadder(ladderWithConnections);
      setPlayerOrder(order);
      setShowStartButton(false);
      setShowCountdown(true);
      setCountdown(3);
    }
  };

  const animateLadder = () => {
    const animationInterval = setInterval(() => {
      setCurrentStep(prevStep => {
        if (prevStep < ladder.length - 1) {
          return prevStep + 1;
        } else {
          clearInterval(animationInterval);
          return prevStep;
        }
      });
    }, 500);
  };

  return (
    <div className="backStyle">
      <div className={"titleStyle"}>
        <h1>Room
          <button type={"button"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor"
                 className="bi bi-box-arrow-right" viewBox="0 0 16 16">
              <path fillRule="evenodd"
                    d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5.5 0 0 0 0 3.5v9A1.5.1.5 0 0 0 1.5 14h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-1 0z"/>
              <path fillRule="evenodd"
                    d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
            </svg>
          </button>
        </h1>
      </div>

      {!showLadder && players.length > 0 && (  // 사다리 게임이 표시되지 않은 경우에만 렌더링
        <div className="formStyle">
          {players.map((player, index) => (
            <div key={index} className="cardStyle">
              <h2>{player.name}</h2>
              <img src="/image/pinkbin.png" alt={player.name} />
              {index !== 0 && (
                <button type="button" onClick={() => handleReadyClick(player)}>
                  {player.ready ? '준비완료' : '준비'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isHost && allReady && showStartButton && (  // 게임 시작 버튼이 표시될 때만 렌더링
        <div className="startGame">
          <button type="button" onClick={handleStartGame}>게임 시작하기</button>
        </div>
      )}

      {showCountdown && (  // 카운트다운 표시
        <div className="countdown">
          <h2>{countdown}</h2>
        </div>
      )}

      {showLadder && (  // 사다리 게임 표시 여부에 따라 렌더링
        <div className="ladder-container">
          {ladder.map((row, rowIndex) => (
            <div key={rowIndex} className="ladder-row">
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} className={`ladder-cell ${cell ? 'connected' : ''} ${currentStep === rowIndex ? 'current-step' : ''}`}></div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="chatContainer">
        <div className="chatMessages">
          <h5>핑크빈 : ㅎㅇㅎㅇ</h5>
          <h5>핑크빈 : ㅎㅇㅎㅇ</h5>
          <h5>핑크빈 : ㅎㅇㅎㅇ</h5>
          <h5>핑크빈 : ㅎㅇㅎㅇ</h5>
        </div>
        <div className="chatInputContainer">
          <input
            placeholder="Type your message..."
            className="chatInput" />
          <button variant="solid" className="chatSendButton">
            Send
          </button>
        </div>
      </div>

      {playerOrder.length > 0 && showLadder && (  // 사다리 게임이 표시된 후에만 렌더링
        <div className="orderList">
          <h2>플레이어 순서</h2>
          <ol>
            {playerOrder.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Lobby;
