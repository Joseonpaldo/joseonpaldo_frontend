"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  { id: 'C', src: '/image/map/3.png', alt: 'Map C' },
  { id: 'D', src: '/image/background.jpg', alt: 'Map D' }
];

const Lobby = () => {
  const [players, setPlayers] = useState([]);
  const [readyStates, setReadyStates] = useState({});
  const [allReady, setAllReady] = useState(false);
  const [client, setClient] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedMap, setSelectedMap] = useState(maps[0].src);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const playerName = React.useMemo(() => `${Math.random().toString(36).substring(7)}`, []);
  const [messages, setMessages] = useState([]);
  const chatMessagesRef = useRef(null);
  const [input, setInput] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [allPlayersReady, setAllPlayersReady] = useState(false);
  const [showRace, setShowRace] = useState(false);
  const [order, setOrder] = useState([]);
  const [balloons, setBalloons] = useState({});
  const runnersRef = useRef([]);

  const [showOptions, setShowOptions] = useState(false); // 버튼을 보여줄지 여부를 관리하는 상태


  useEffect(() => {
    const handleAnimationEnd = (runner, index) => {
      const finishLineOffset = document.querySelector('.finishLine').offsetLeft;
      const runnerOffset = runner.getBoundingClientRect().left + runner.offsetWidth;

      if (runnerOffset >= finishLineOffset) {
        runner.style.animationPlayState = 'paused';

        // 현재 시간을 기록하여 순위 계산
        const finishTime = new Date().getTime();
        setOrder(prevOrder => [...prevOrder, { name: players[index].name, finishTime }]);
      }
    };

    runnersRef.current.forEach((runner, index) => {
      runner.addEventListener('animationiteration', () => handleAnimationEnd(runner, index));
    });

    return () => {
      runnersRef.current.forEach((runner) => {
        runner.removeEventListener('animationiteration', handleAnimationEnd);
      });
    };
  }, [players]);

  useEffect(() => {
    if (order.length === players.length) {
      // finishTime을 기준으로 정렬
      const sortedOrder = order.sort((a, b) => a.finishTime - b.finishTime);
      setOrder(sortedOrder);
    }
  }, [order]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlPath = window.location.pathname;
      const pathSegments = urlPath.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      setRoomId(lastSegment);
    }
  }, []);

  useEffect(() => {
    const fetchRoomStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8080/room/${roomId}/status`);
        const roomStatus = await response.json();
        const playersInfo = roomStatus.players.map((player) => {
          return { name: player, ready: false, characterSrc: roomStatus.characters[player] || '/image/pinkbin.png' };
        });
        setPlayers(playersInfo);
        setSelectedMap(roomStatus.map);
      } catch (error) {
        console.error('Failed to fetch room status:', error);
      }
    };

    fetchRoomStatus();

    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      setClient(stompClient);
      stompClient.subscribe(`/topic/${roomId}`, (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          onMessageReceived(parsedMessage);
        } catch (error) {
          console.error('Failed to parse message:', message.body, error);
        }
      });

      stompClient.send(`/app/chat.addUser/${roomId}`, {}, JSON.stringify({ sender: playerName, type: 'JOIN', roomId }));

      const heartbeatInterval = setInterval(() => {
        if (stompClient.connected) {
          stompClient.send(`/app/chat.heartbeat/${roomId}`, {}, JSON.stringify({ sender: playerName, type: 'HEARTBEAT', roomId }));
        }
      }, 3000);

      window.addEventListener('beforeunload', (event) => {
        clearInterval(heartbeatInterval);
        leaveUser();
        event.preventDefault();
        event.returnValue = '';
      });
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [playerName, roomId]);

  const leaveUser = () => {
    if (client && client.connected) {
      client.send(`/app/chat.leaveUser/${roomId}`, {}, JSON.stringify({ sender: playerName, type: 'LEAVE', roomId }));
    }
  };

  const onMessageReceived = (message) => {
    if (message.type === 'JOIN') {
      setMessages(prevMessages => [...prevMessages, { content: message.content }]);
    } else if (message.type === 'UPDATE') {
      const playersInfo = message.content.split(",");
      const newPlayers = playersInfo.map((info) => {
        const [name, characterSrc] = info.split(":");
        return { name: name, ready: false, characterSrc: characterSrc || '/image/pinkbin.png' };
      });
      setPlayers(newPlayers);

      const selectedChars = newPlayers.map(player => player.characterSrc).filter(src => src !== '/image/pinkbin.png');
      setSelectedCharacters(selectedChars);
    } else if (message.type === 'READY') {
      setReadyStates(prevStates => ({
        ...prevStates,
        [message.sender]: message.ready
      }));
      setPlayers(prevPlayers => prevPlayers.map(p => p.name === message.sender ? { ...p, ready: message.ready } : p));
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

      const maxLength = 9;
      const trimmedContent = message.content.length > maxLength
        ? message.content.substring(0, maxLength) + '...'
        : message.content;

      setBalloons(prevBalloons => ({
        ...prevBalloons,
        [message.sender]: trimmedContent
      }));
      setTimeout(() => {
        setBalloons(prevBalloons => ({
          ...prevBalloons,
          [message.sender]: null
        }));
      }, 4000);
    } else if (message.type === 'LEAVE') {
      setMessages(prevMessages => [...prevMessages, { content: message.content }]);
      setPlayers(prevPlayers => prevPlayers.filter(p => p.name !== message.sender));
      setSelectedCharacters(prevSelected => prevSelected.filter(src => src !== message.content));
    } else if (message.type === 'CHANGE_MAP') {
      setSelectedMap(message.content);
    }
  };

  useEffect(() => {
    checkAllReady();
  }, [players]);

  const checkAllReady = () => {
    if (players.length > 1 && players.slice(1).every(player => player.ready)) {
      setAllPlayersReady(true);
    } else {
      setAllPlayersReady(false);
    }
  };

  const handleReadyClick = (player) => {
    if (client && client.connected) {
      const updatedReadyState = !player.ready;
      client.send(`/app/chat.ready/${roomId}`, {}, JSON.stringify({ sender: player.name, type: 'READY', ready: updatedReadyState, roomId }));
    }
  };

  const handleCharacterSelect = (characterId) => {
    const characterSrc = characters.find(c => c.id === characterId).src;
    if (selectedCharacters.includes(characterSrc)) {
      alert('이미 선택된 캐릭터입니다');
      return;
    }

    if (selectedCharacter !== null) {
      handleCharacterDeselect(selectedCharacter);
    }

    setSelectedCharacter(characterId);
    setPlayers(prevPlayers => prevPlayers.map(player =>
      player.name === playerName ? { ...player, characterSrc: characterSrc } : player
    ));

    setSelectedCharacters(prevSelected => [...prevSelected, characterSrc]);
    if (client && client.connected) {
      client.send(`/app/chat.selectCharacter/${roomId}`, {}, JSON.stringify({ sender: playerName, type: 'SELECT', content: characterSrc, roomId }));
    }
  };

  const handleCharacterDeselect = (characterId) => {
    const characterSrc = characters.find(c => c.id === characterId).src;
    setSelectedCharacter(null);
    setPlayers(prevPlayers => prevPlayers.map(player =>
      player.name === playerName ? { ...player, characterSrc: '/image/pinkbin.png' } : player
    ));
    setSelectedCharacters(prevSelected => prevSelected.filter(src => src !== characterSrc));
    if (client && client.connected) {
      client.send(`/app/chat.deselectCharacter/${roomId}`, {}, JSON.stringify({ sender: playerName, type: 'DESELECT', content: characterSrc, roomId }));
    }
  };

  const handleStartGame = () => {
    if (client && client.connected) {
      client.send(`/app/chat.startGame/${roomId}`, {}, JSON.stringify({
        sender: playerName,
        type: 'START',
        roomId: roomId,
      }));
    }

    client.subscribe(`/topic/${roomId}`, (message) => {
      const parsedMessage = JSON.parse(message.body);
      if (parsedMessage.type === 'START') {
        const gameInfo = parsedMessage.content.split("\n");
        const updatedPlayers = [];

        gameInfo.forEach(line => {
          const match = line.match(/^(\d+)\.\s(\w+):\s.+,\sSpeed:\s(\d+)$/);
          if (match) {
            const player = match[2];
            const speed = parseInt(match[3], 10);

            const runner = runnersRef.current.find(r => r.dataset.player === player);
            if (runner) {
              const duration = 50 / speed;
              runner.style.animationDuration = `${duration}s`;
            }

            updatedPlayers.push({ name: player, speed: speed, characterSrc: players.find(p => p.name === player).characterSrc });
          }
        });

        setPlayers(updatedPlayers);
        setShowRace(true);
      }
    });
  };

  useEffect(() => {
    if (showRace) {
      const finishOrder = players.slice().sort((a, b) => b.speed - a.speed);
      setOrder(finishOrder);
    }
  }, [showRace, players]);

  const handleMapSelect = () => {
    const currentIndex = maps.findIndex(map => map.src === selectedMap);
    const nextIndex = (currentIndex + 1) % maps.length;
    const newSelectedMap = maps[nextIndex].src;
    setSelectedMap(newSelectedMap);

    if (client && client.connected) {
      client.send(`/app/chat.changeMap/${roomId}`, {}, JSON.stringify({ sender: playerName, type: 'CHANGE_MAP', content: newSelectedMap, roomId }));
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${selectedMap})`;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
  }, [selectedMap]);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const chatMessage = {
        sender: playerName,
        content: input,
        type: 'CHAT',
        roomId: roomId
      };
      client.send(`/app/chat.sendMessage/${roomId}`, {}, JSON.stringify(chatMessage));
      setInput('');
    }
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);



  const handleButtonClick = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionClick = (option) => {
    console.log(`Selected option: ${option}`);
    // 여기서 각 옵션에 따른 동작을 추가할 수 있습니다.
  };


  return (
    <div className="backStyle">
      {!showRace && (
        <>
          <div className="titleStyle">
            <h1>Room {players.length}/4
              <button type="button" onClick={() => {
                leaveUser();
                window.close();
              }}>
                <h3>Exit</h3>
              </button>
            </h1>
          </div>

          {players.length > 0 && (
            <div className="formStyle">
              {players.map((player, index) => (
                <div className="cardStyle">
                  <div className="player-info">
                    <h2>{player.name}</h2>
                    <div className="options-container">
                      <button onClick={handleButtonClick} className="show-options-button" style={{backgroundColor:'skyblue'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                             className="bi bi-three-dots" viewBox="0 0 16 16">
                          <path
                            d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                        </svg>
                      </button>
                      {showOptions && (
                        <div className="options-menu">
                          <button onClick={() => handleOptionClick('Option 1')} style={{backgroundColor:'skyblue'}}>
                            정보
                          </button>
                          <button onClick={() => handleOptionClick('Option 2')} style={{backgroundColor:'skyblue'}}>
                            친구추가
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="player-container" style={{position: 'relative'}}>
                    <img src={player.characterSrc} alt={player.name}/>
                    {balloons[player.name] && (
                      <div className={`balloon ${balloons[player.name] ? 'show' : ''}`}>
                        {balloons[player.name]}
                      </div>
                    )}
                  </div>
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleReadyClick(player)}
                      className={!showOptions ? '' : 'hidden'}
                    >
                      {player.ready ? '준비완료' : '준비'}
                    </button>
                  )}
                </div>

              ))}
            </div>
          )}

          <div className="chatContainer">
            <div className="chatMessages" ref={chatMessagesRef}>
              {messages.map((msg, index) => (
                <div key={index}>
                  {msg.sender ? <b>{msg.sender}: </b> : null}{msg.content}
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
            <b style={{fontSize: '20px'}}>Select&nbsp;Character</b>

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
            <img src={selectedMap} alt="Map" className="map-image"/>
            <div className="map-details">
            </div>
            {players.length > 0 && players[0].name === playerName && (
              <button className="map-select-button" onClick={handleMapSelect}>맵 변경</button>
            )}
          </div>

          {players.length > 0 && players[0].name === playerName && (
            <div className="start-button-section">
              <button className="start-button" onClick={handleStartGame} disabled={!allPlayersReady}>
                시작
              </button>
            </div>
          )}

          {showCountdown && (
            <div className="countdown">
              <h2>{countdown}</h2>
            </div>
          )}
        </>
      )}

      {showRace && (
        <div className="raceTrack">
          {players.map((player, index) => (
            <div
              key={index}
              className={`runner runner-${index}`}
              style={{
                top: `${index * 25}%`,
                animationDuration: `${50 / player.speed}s`
              }}
              ref={(el) => {
                runnersRef.current[index] = el;
                if (el) {
                  el.dataset.player = player.name;  // dataset 설정
                }
              }}
            >
              <img src={player.characterSrc} alt={player.name}/>
              <span>{player.name}</span>
            </div>
          ))}

          <div className="finishLine"></div>
        </div>
      )}

      {order.length > 0 && (
        <div className="order">
          <h2>순번 결과</h2>
          <ul>
            {order.map((player, index) => (
              <li key={index}>{index + 1}. {player.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Lobby;
