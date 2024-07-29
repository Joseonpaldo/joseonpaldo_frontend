"use client";
import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Lobby.css';
import { Button, Input } from "@mui/material";

const Lobby = () => {
  const [players, setPlayers] = useState([]);
  const [readyStates, setReadyStates] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [allReady, setAllReady] = useState(false);

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    checkAllReady();
  }, [players, readyStates]);

  const connect = () => {
    let socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => onConnected(stompClient),
      onStompError: onError,
    });
    stompClient.activate();
  };

  const onConnected = (stompClient) => {
    setIsConnected(true);
    setClient(stompClient);
    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.publish({
      destination: "/app/chat.addUser",
      body: JSON.stringify({ sender: `플레이어-${Math.random().toString(36).substring(7)}`, type: 'JOIN' })
    });
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    if (message.type === 'JOIN') {
      setPlayers(prevPlayers => {
        if (prevPlayers.length < 4 && prevPlayers.findIndex(player => player.name === message.sender) === -1) {
          const newPlayers = [...prevPlayers, { name: message.sender, ready: false }];
          if (newPlayers.length === 1) {
            setIsHost(true);
          }
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

  const onError = (error) => {
    console.error('Could not connect to WebSocket server. Please refresh this page to try again!', error);
  };

  const handleReadyClick = (player) => {
    if (isConnected && client) {
      const updatedReadyState = !player.ready;
      client.publish({
        destination: "/app/chat.ready",
        body: JSON.stringify({ sender: player.name, type: 'READY', ready: updatedReadyState })
      });
      setReadyStates(prevStates => ({
        ...prevStates,
        [player.name]: updatedReadyState
      }));
      setPlayers(prevPlayers => prevPlayers.map(p => p.name === player.name ? { ...p, ready: updatedReadyState } : p));
    } else {
      console.error('STOMP client is not connected');
    }
  };

  const handleStartGame = () => {
    if (allReady && isHost) {
      console.log('Game Started!');
      // Here you can add the logic to start the game
    }
  };

  return (
    <div className="backStyle">
      <div className={"titleStyle"}>
        <h1>Room
          <button type={"button"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor"
                 className="bi bi-box-arrow-right" viewBox="0 0 16 16">
              <path fillRule="evenodd"
                    d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-1 0z"/>
              <path fillRule="evenodd"
                    d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
            </svg>
          </button>
        </h1>
      </div>

      <div className="formStyle">
        {players.map((player, index) => (
          <div key={index} className="cardStyle">
            <h2>{index === 0 && isHost ? '방장' : `플레이어 ${index + 1}`}</h2>
            <img src="/image/pinkbin.png" alt={player.name}/>
            {index !== 0 && (
              <button type="button" onClick={() => handleReadyClick(player)}>
                {player.ready ? '준비완료' : '준비'}
              </button>
            )}
          </div>
        ))}
      </div>

      {isHost && allReady && (
        <div className="startGame">
          <button type="button" onClick={handleStartGame}>게임 시작하기</button>
        </div>
      )}

      <div className="chatContainer">
        <div className="chatMessages">
          {/* 채팅 메시지 목록이 여기 들어갑니다 */}
          <h5>핑크빈 : ㅎㅇㅎㅇ</h5>
          <h5>핑크빈 : ㅎㅇㅎㅇ</h5>
          <h5>핑크빈 : ㅎㅇㅎㅇ</h5>
          <h5>핑크빈 : ㅎㅇㅎㅇ</h5>
        </div>
        <div className="chatInputContainer">
          <input
            placeholder="Type your message..."
            className="chatInput"/>
          <button variant="solid" className="chatSendButton">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
