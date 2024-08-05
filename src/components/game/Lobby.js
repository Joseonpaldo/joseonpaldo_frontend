"use client";
import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Lobby.css';

const characters = [
  { id: 1, src: '/image/character/bear.png', alt: 'Character 1' },
  { id: 2, src: '/image/character/cow.png', alt: 'Character 2' },
  { id: 3, src: '/image/character/dragon.png', alt: 'Character 3' },
  { id: 4, src: '/image/character/duck.png', alt: 'Character 4' },
  { id: 5, src: '/image/character/fox.png', alt: 'Character 5' },
  { id: 6, src: '/image/character/monkey.png', alt: 'Character 6' },
  { id: 7, src: '/image/character/panda.png', alt: 'Character 7' },
  { id: 8, src: '/image/character/rabbit.png', alt: 'Character 8' },
  { id: 9, src: '/image/character/tiger.png', alt: 'Character 9' }
];

const maps = [
  { id: 'A', src: '/image/map/1.png', alt: 'Map A' },
  { id: 'B', src: '/image/map/2.png', alt: 'Map B' },
  { id: 'C', src: '/image/map/3.png', alt: 'Map C' }
];

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
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedMap, setSelectedMap] = useState(maps[0].src);
  const [selectedCharacters, setSelectedCharacters] = useState([]); // 선택된 캐릭터 상태 추가

  const playerName = React.useMemo(() => `${Math.random().toString(36).substring(7)}`, []);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

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

      stompClient.send('/app/chat.addUser', {}, JSON.stringify({ sender: playerName, type: 'JOIN', roomId: 'default' }));
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [playerName]);

  const onMessageReceived = (message) => {
    if (message.type === 'JOIN') {
      const playersInfo = message.content.split(",");
      const newPlayers = playersInfo.map((info) => {
        const [name, characterSrc] = info.split(":");
        return { name: name, ready: "", characterSrc: characterSrc || '/image/pinkbin.png' };
      });
      setPlayers(newPlayers);
    } else if (message.type === 'READY') {
      setReadyStates(prevStates => ({
        ...prevStates,
        [message.sender]: message.ready
      }));
      setPlayers(prevPlayers => prevPlayers.map(p => p.name === message.sender ? { ...p, ready: message.ready } : p));
    } else if (message.type === 'LEAVE') {
      setPlayers(prevPlayers => prevPlayers.filter(p => p.name !== message.sender));
    } else if (message.type === 'SELECT') {
      setPlayers(prevPlayers => prevPlayers.map(p => p.name === message.sender ? { ...p, characterSrc: message.content } : p));
      setSelectedCharacters(prevSelected => [...prevSelected, message.content]);
    } else if (message.type === 'DESELECT') {
      setPlayers(prevPlayers => prevPlayers.map(p => p.name === message.sender ? { ...p, characterSrc: '/image/pinkbin.png' } : p));
      setSelectedCharacters(prevSelected => prevSelected.filter(src => src !== message.content));
    } else if (message.type === 'ERROR' && message.content === 'Character already selected') {
      alert('The character has already been selected by another player.');
    } else if (message.type === 'CHAT') {
      setMessages(prevMessages => [...prevMessages, { sender: message.sender, content: message.content }]);
    }
  };

  const handleReadyClick = (player) => {
    if (client && client.connected) {
      const updatedReadyState = !player.ready;
      client.send('/app/chat.ready', {}, JSON.stringify({ sender: player.name, type: 'READY', ready: updatedReadyState, roomId: 'default' }));
    }
  };

  const handleCharacterSelect = (characterId) => {
    const characterSrc = characters.find(c => c.id === characterId).src;
    if (selectedCharacters.includes(characterSrc)) {
      alert('This character has already been selected by another player.');
      return;
    }
    setSelectedCharacter(characterId);
    setPlayers(prevPlayers => prevPlayers.map(player =>
      player.name === playerName ? { ...player, characterSrc: characterSrc } : player
    ));
    setSelectedCharacters(prevSelected => [...prevSelected, characterSrc]); // 선택된 캐릭터 추가
    if (client && client.connected) {
      client.send('/app/chat.selectCharacter', {}, JSON.stringify({ sender: playerName, type: 'SELECT', content: characterSrc, roomId: 'default' }));
    }
  };

  const handleCharacterDeselect = (characterId) => {
    const characterSrc = characters.find(c => c.id === characterId).src;
    setSelectedCharacter(null);
    setPlayers(prevPlayers => prevPlayers.map(player =>
      player.name === playerName ? { ...player, characterSrc: '/image/pinkbin.png' } : player
    ));
    setSelectedCharacters(prevSelected => prevSelected.filter(src => src !== characterSrc)); // 선택된 캐릭터 제거
    if (client && client.connected) {
      client.send('/app/chat.deselectCharacter', {}, JSON.stringify({ sender: playerName, type: 'DESELECT', content: characterSrc, roomId: 'default' }));
    }
  };

  const handleStartGame = () => {
    // 게임 시작 로직을 추가합니다.
  };

  const handleMapSelect = () => {
    const currentIndex = maps.findIndex(map => map.src === selectedMap);
    const nextIndex = (currentIndex + 1) % maps.length;
    setSelectedMap(maps[nextIndex].src);
  };

  const sendMessage = () => {
    const chatMessage = {
      sender: playerName,
      content: input,
      type: 'CHAT'
    };
    client.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
    setInput('');
  };

  return (
    <div className="backStyle">
      <div className="titleStyle">
        <h1>Room {players.length}/4
          <button type="button">
            <h3>Exit</h3>
          </button>
        </h1>
      </div>

      {!showLadder && players.length > 0 && (
        <div className="formStyle">
          {players.map((player, index) => (
            <div key={index} className="cardStyle">
              <h2>{player.name}</h2>
              <img src={player.characterSrc} alt={player.name} />
              {index !== 0 && (
                <button type="button" onClick={() => handleReadyClick(player)}>
                  {player.ready ? '준비완료' : '준비'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="chatContainer">
        <div className="chatMessages">
          {messages.map((msg, index) => (
            <div key={index}>
              <b>{msg.sender}: </b>{msg.content}
            </div>
          ))}
        </div>
        <div className="chatInputContainer">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            className="chatInput"
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="chatSendButton">
            Send
          </button>
        </div>
      </div>

      <div className="game-container">
        <b style={{ fontSize: '20px' }}>Select&nbsp;Character</b>
        <div className="character-selection">
          {characters.map((character) => (
            <div key={character.id} className="character-slot">
              <img
                src={character.src}
                alt={character.alt}
                className={`character ${selectedCharacter === character.id ? 'selected' : ''}`}
                onClick={() => {
                  if (selectedCharacter === character.id) {
                    handleCharacterDeselect(character.id);
                  } else if (!selectedCharacters.includes(character.src)) {
                    handleCharacterSelect(character.id);
                  }
                }}
              />
              {selectedCharacters.includes(character.src) && (
                <div className="character-overlay">X</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="map-info">
        <img src={selectedMap} alt="Map" className="map-image" />
        <div className="map-details">
        </div>
        <button className="map-select-button" onClick={handleMapSelect}>맵 변경</button>
      </div>

      {isHost && allReady && showStartButton && (
        <div className="start-button-section">
          <button className="start-button" onClick={handleStartGame}>시작</button>
        </div>
      )}

      {showCountdown && (
        <div className="countdown">
          <h2>{countdown}</h2>
        </div>
      )}

      {showLadder && (
        <div className="ladder-container">
          {ladder.map((row, rowIndex) => (
            <div key={rowIndex} className="ladder-row">
              {row.map((cell, cellIndex) => (
                <div key={cellIndex}
                     className={`ladder-cell ${cell ? 'connected' : ''} ${currentStep === rowIndex ? 'current-step' : ''}`}></div>
              ))}
            </div>
          ))}
        </div>
      )}

      {playerOrder.length > 0 && showLadder && (
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
