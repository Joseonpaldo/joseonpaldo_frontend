"use client";
import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Lobby.css';

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

  const playerName = `플레이어-${Math.random().toString(36).substring(7)}`;


  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      setClient(stompClient);
      stompClient.subscribe('/topic/public', (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          onMessageReceived(parsedMessage);
        } catch (error) {
          console.error('Failed to parse message:', message.body, error);
        }
      });

      stompClient.send('/app/chat.addUser', {}, JSON.stringify({ sender: playerName, type: 'JOIN' }));
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  const onMessageReceived = (message) => {
    if (message.type === 'JOIN') {
      setPlayers(() => {
        let names = message.content.split(",");
        let prevPlayers = names.map((name) => {
          return {name: name, ready: ""}
        })

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




  //준비
  const checkAllReady = () => {
    if (players.length > 1) {
      const allReady = players.every(player => readyStates[player.name] === true);
      setAllReady(allReady);
    } else {
      setAllReady(false);
    }
  };


  useEffect(() => {
    checkAllReady();
  }, [players, readyStates]);


  const handleReadyClick = (player) => {
    if (client && client.connected) {
      const updatedReadyState = !player.ready;
      client.send('/app/chat.ready', {}, JSON.stringify({ sender: player.name, type: 'READY', ready: updatedReadyState }));
    }
  };

  return (
    <div className="backStyle">
      <div className={"titleStyle"}>
        <h1>Room {players.length}/4
          <button type={"button"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5.5 0 0 0 0 3.5v9A1.5.1.5 0 0 0 1.5 14h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-1 0z"/>
              <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
            </svg>
          </button>
        </h1>
      </div>

      {!showLadder && players.length > 0 && ( // 사다리 게임이 표시되지 않은 경우에만 렌더링
        <div className="formStyle">
          {players.map((prevPlayers, index) => (
            <div key={index} className="cardStyle">
              <h2>{prevPlayers.name}</h2>
              <img src="/image/pinkbin.png" alt={prevPlayers.name} />
              {index !== 0 && (
                <button type="button" onClick={() => handleReadyClick(prevPlayers)}>
                  {prevPlayers.ready ? '준비완료' : '준비'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/*isHost &&*/ allReady && showStartButton && ( // 게임 시작 버튼이 표시될 때만 렌더링
        <div className="startGame">
          <button type="button" onClick={handleStartGame}>게임 시작하기</button>
        </div>
      )}

      {showCountdown && ( // 카운트다운 표시
        <div className="countdown">
          <h2>{countdown}</h2>
        </div>
      )}

      {showLadder && ( // 사다리 게임 표시 여부에 따라 렌더링
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

      {playerOrder.length > 0 && showLadder && ( // 사다리 게임이 표시된 후에만 렌더링
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
