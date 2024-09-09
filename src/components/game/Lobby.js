"use client";

import React, {useEffect, useRef, useState} from 'react';
import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Lobby.css';
import dynamic from 'next/dynamic'
import Button from "@mui/material/Button";
import YutPan from "@/components/game/YutPan";
import RankAnimation from "@/components/game/RankAnimation";
import Modal from "@/components/game/Modal";
import InviteModal from "@/components/game/InviteModal";
import apiAxiosInstance from "@/hooks/apiAxiosInstance";
import InforModal from "@/components/game/InforModal";
import FriendTo from "@/components/game/FriendTo";
import FriendFrom from "@/components/game/FriendFrom";

const characters = [
  {id: 1, src: '/image/character/bear.png', alt: 'Character 1'},
  {id: 2, src: '/image/character/cow.png', alt: 'Character 2'},
  {id: 3, src: '/image/character/dragon.png', alt: 'Character 3'},
  {id: 4, src: '/image/character/duck.png', alt: 'Character 4'},
  {id: 5, src: '/image/character/fox.png', alt: 'Character 5'},
  {id: 6, src: '/image/character/monkey.png', alt: 'Character 6'},
  {id: 7, src: '/image/character/panda.png', alt: 'Character 7'},
  {id: 8, src: '/image/character/rabbit.png', alt: 'Character 8'},
  {id: 9, src: '/image/character/tiger.png', alt: 'Character 9'}
];

const maps = [
  {id: 'A', src: '/image/map/1.png', alt: 'Map A'},
  {id: 'B', src: '/image/map/2.png', alt: 'Map B'},
  {id: 'C', src: '/image/map/3.png', alt: 'Map C'},
  {id: 'D', src: '/image/background.jpg', alt: 'Map D'}
];

const Picker = dynamic(() => import('emoji-picker-react'), {ssr: false});

const Lobby = () => {
  const [players, setPlayers] = useState([]);
  const [readyStates, setReadyStates] = useState({});
  const [allReady, setAllReady] = useState(false);
  const [client, setClient] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedMap, setSelectedMap] = useState(maps[0].src);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const chatMessagesRef = useRef(null);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [balloons, setBalloons] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [visibleOptions, setVisibleOptions] = useState({});
  const [showYutPan, setShowYutPan] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInforModalOpen, setIsInforModalOpen] = useState(false); // 정보 모달 상태
  const [isHost, setIsHost] = useState(false);
  const [order, setOrder] = useState([]);
  const [showGameResult, setShowGameResult] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState("flex");
  const [selectedUserId, setSelectedUserId] = useState(null); // 선택된 유저 ID 저장
  const [selectedUserNickname, setSelectedUserNickname] = useState(null); // 선택된 유저 닉네임 저장

  const [senderNickname, setSenderNickname] = useState(''); // 친구 요청을 보낸 유저 닉네임
  const [isFriendFromModalOpen, setIsFriendFromModalOpen] = useState(false); // 친구 추가 요청 모달 상태
  const [isFriendToModalOpen, setIsFriendToModalOpen] = useState(false); // 친구 요청 받은 모달 상태
  const [receiver, setReciver] = useState(''); // 친구 요청을 보낸 유저 닉네임
  const [sender, setSender] = useState(''); // 친구 요청을 보낸 유저 닉네임


  async function getUserData(jwt) {
    try {
      const response = await apiAxiosInstance.get(`/user/${jwt}`);
      return response.data;
    } catch (error) {
      console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
      throw error;
    }
  }

  useEffect(() => {
    const jwt = localStorage.getItem('custom-auth-token');
    if (jwt) {
      getUserData(jwt)
        .then(data => setUserData(data))
        .catch(error => console.error('사용자 데이터 로드 실패:', error));
    }
  }, []);

  //roomId
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlPath = window.location.pathname;
      const pathSegments = urlPath.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      setRoomId(lastSegment);
    }
  }, []);

  //방 제목
  useEffect(() => {
    const fetchRoomName = async () => {
      try {
        const response = await apiAxiosInstance.get(`/roomName/${roomId}`);
        setRoomName(response.data); // 서버에서 반환된 roomName 설정
      } catch (err) {
        setError(err.message);
      }
    };

    if (roomId) {
      fetchRoomName();
    }
  }, [roomId]);


  useEffect(() => {
    const socket = new SockJS('/ws/');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      const url = socket._transport.url;
      const parts = url.split('/');
      const session = parts[parts.length - 2];

      setClient(stompClient);

      // 기존 룸 메시지 구독
      stompClient.subscribe(`/topic/${roomId}`, (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          onMessageReceived(parsedMessage);
        } catch (error) {
          console.error('Failed to parse message:', message.body, error);
        }
      });


      if (userData) {
        stompClient.send(`/app/chat.addUser/${roomId}`, {}, JSON.stringify({
          sender: userData.user_id,
          type: 'JOIN',
          roomId,
          nickname: userData.nickname,
          content: userData.profilePicture,
          session: session,
        }));
      }

      window.addEventListener('beforeunload', (event) => {
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
  }, [roomId, userData]);



  const leaveUser = () => {
    if (client && client.connected && userData) {
      client.send(`/app/chat.leaveUser/${roomId}`, {}, JSON.stringify({
        sender: userData.user_id,
        type: 'LEAVE',
        roomId
      }));
    }
  };

  useEffect(() => {
    checkAllReady();
  }, [players]);

  useEffect(() => {
    if (players.length > 0 && players[0].name === userData.nickname) {
      setIsHost(true);
    }
  }, [players, userData]);

  const checkAllReady = () => {
    if (players.length > 1 && players.slice(1).every(player => player.ready)) {
      setAllReady(true);
    } else {
      setAllReady(false);
    }
  };

  const handleReadyClick = (player) => {
    if (player?.user_id == userData?.user_id) {
      if (client && client.connected) {
        const updatedReadyState = !player.ready;
        client.send(`/app/chat.ready/${roomId}`, {}, JSON.stringify({
          sender: player.user_id,
          type: 'READY',
          ready: updatedReadyState,
          roomId
        }));
      }
    }
  };

  const handleButtonClick = (user_id) => {
    setVisibleOptions((prevState) => ({
      ...prevState,
      [user_id]: !prevState[user_id] // user_id를 기준으로 상태 업데이트
    }));
  };


  const handleOptionClick = (option) => {
    console.log(`Selected option: ${option}`);
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
      player.name === userData.nickname ? {...player, characterSrc: characterSrc} : player
    ));

    setSelectedCharacters(prevSelected => [...prevSelected, characterSrc]);
    if (client && client.connected) {
      client.send(`/app/chat.selectCharacter/${roomId}`, {}, JSON.stringify({
        sender: userData.user_id,
        type: 'SELECT',
        content: characterSrc,
        roomId
      }));
    }
  };

  const handleCharacterDeselect = (characterId) => {
    const characterSrc = characters.find(c => c.id === characterId).src;
    setSelectedCharacter(null);

    setPlayers(prevPlayers => prevPlayers.map(player =>
      player.name === userData.nickname ? {...player, characterSrc: userData.profilePicture} : player
    ));

    setSelectedCharacters(prevSelected => prevSelected.filter(src => src !== characterSrc));

    if (client && client.connected) {
      client.send(`/app/chat.deselectCharacter/${roomId}`, {}, JSON.stringify({
        sender: userData.user_id,
        type: 'DESELECT',
        content: userData.profilePicture,
        roomId
      }));
    }
  };

  const handleMapSelect = () => {
    const currentIndex = maps.findIndex(map => map.src === selectedMap);
    const nextIndex = (currentIndex + 1) % maps.length;
    const newSelectedMap = maps[nextIndex].src;
    setSelectedMap(newSelectedMap);

    if (client && client.connected) {
      client.send(`/app/chat.changeMap/${roomId}`, {}, JSON.stringify({
        sender: userData.user_id,
        type: 'CHANGE_MAP',
        content: newSelectedMap,
        roomId
      }));
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${selectedMap})`;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = '100% 100%';
    document.body.style.backgroundPosition = 'center';
  }, [selectedMap]);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const chatMessage = {
        sender: userData.user_id,
        nickname: userData.nickname,
        content: input,
        type: 'CHAT',
        roomId: roomId
      };
      client.send(`/app/chat.sendMessage/${roomId}`, {}, JSON.stringify(chatMessage));
      setInput('');
    }
  };

  const handleEmojiClick = (event, emojiObject) => {
    const emoji = emojiObject.emoji; // 선택된 이모지를 가져옴

    if (emoji) {
      setInput(prevInput => prevInput + emoji);
    } else {
      console.error("Emoji data is undefined or incorrect");
    }
  };


// 친구 추가 요청 보내기
  const handleSendFriendRequest = (user_id) => {
    if (client && client.connected) {
      client.send(`/app/chat.friendRequest/${user_id}`, {}, JSON.stringify({
        sender: userData.user_id,
        receiver: user_id,
        type: 'FRIEND_REQUEST',
        nickname: userData.nickname, // 친구 요청 보낸 사람의 닉네임
      }));
    }
    setIsFriendFromModalOpen(true); // 모달 닫기
  };



  useEffect(() => {
    if (client && userData) {
      client.subscribe(`/topic/friendRequest/${userData.user_id}`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log('Received dddd:', parsedMessage); // 수신된 메시지 확인

        if (parsedMessage.type === 'FRIEND_REQUEST') {
          console.log("Setting modal state to true"); // 상태 업데이트 확인
          setSenderNickname(parsedMessage.nickname);
          setSender(parsedMessage.sender)
          setReciver(parsedMessage.receiver)
          setIsFriendToModalOpen(true); // 친구 요청 받은 모달 열기
        }
      });
    }
  }, [client, userData]);



  // 친구 추가 요청 수락 로직 구현
  const handleAcceptInvite = (userId) => {
    if (client && client.connected) {
      client.send(`/app/chat.acceptFriend/${roomId}`, {}, JSON.stringify({
        sender: userData.user_id,
        receiver: userId, // 수락한 유저 ID를 전송
        type: 'ACCEPT_FRIEND',
      }));
    }
    setIsFriendToModalOpen(false); // 모달 닫기
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartGame = () => {
    if (client && client.connected) {
      // 현재 사용자가 선택한 캐릭터 이미지를 가져옴
      const selectedCharacterSrc = players.find(player => player.name === userData.nickname)?.characterSrc;

      client.send(`/app/chat.startGame/${roomId}`, {}, JSON.stringify({
        sender: userData.user_id,
        type: 'START',
        roomId: roomId,
        character: selectedCharacterSrc // 선택한 캐릭터 이미지를 함께 전송
      }));
      setShowGameResult(true); // 결과 화면을 표시하도록 설정
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.close();
  };

  const handleInviteClick = (user_id) => {
    setSelectedUserId(user_id);  // 선택된 유저 ID 설정
    setIsInviteModalOpen(true);
  };


  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };
  const handleInforClick = (user_id) => {

    setSelectedUserId(user_id);
    setIsInforModalOpen(true);
  };

  const handleCloseInforModal = () => {
    setIsInforModalOpen(false); // 모달 닫기
  };

  const onMessageReceived = (message) => {
    if (message.type === 'JOIN') {
      setMessages(prevMessages => [...prevMessages, {content: message.content}]);
    } else if (message.type === 'UPDATE') {
      const playersInfo = message.content.split(",");
      console.log("playersInfo");
      console.log(playersInfo);
      setLoading("none");

      const newPlayers = playersInfo.map((info) => {
        const [user_id, characterSrc, nickname] = info.split("|");

        // 올바르게 user_id, characterSrc, nickname을 매핑하는지 확인
        console.log("user_id:", user_id);
        console.log("characterSrc:", characterSrc);
        console.log("nickname:", nickname);

        return {
          user_id: user_id, // 첫 번째 값은 user_id
          ready: false,
          characterSrc: characterSrc || userData.profilePicture, // 두 번째 값은 캐릭터 이미지
          nickname: nickname // 세 번째 값은 nickname
        };
      });

      setPlayers(newPlayers);

      const selectedChars = newPlayers.map(player => player.characterSrc).filter(src => src !== null && src !== undefined);
      setSelectedCharacters(selectedChars);
    } else if (message.type === 'READY') {
      setReadyStates(prevStates => ({
        ...prevStates,
        [message.sender]: message.ready
      }));
      setPlayers(prevPlayers => prevPlayers.map(p => p.user_id === message.sender ? {...p, ready: message.ready} : p));
    } else if (message.type === 'SELECT') {
      setPlayers(prevPlayers => prevPlayers.map(p => p.user_id === message.sender ? {
        ...p,
        characterSrc: message.content
      } : p));
      setSelectedCharacters(prevSelected => [...prevSelected, message.content]);
    } else if (message.type === 'DESELECT') {
      setPlayers(prevPlayers => prevPlayers.map(p => p.user_id === message.sender ? {
        ...p,
        characterSrc: message.content
      } : p));
      setSelectedCharacters(prevSelected => prevSelected.filter(src => src !== message.content));
    } else if (message.type === 'ERROR' && message.content === 'Character already selected') {
      alert('The character has already been selected by another player.');
    } else if (message.type === 'CHAT') {
      setMessages(prevMessages => [...prevMessages, {
        sender: message.sender,
        content: message.content,
        nickname: message.nickname
      }]);

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
      setMessages(prevMessages => [...prevMessages, {content: message.content}]);
      setPlayers(prevPlayers => prevPlayers.filter(p => p.user_id !== message.sender));
      setSelectedCharacters(prevSelected => prevSelected.filter(src => src !== message.content));
    } else if (message.type === 'CHANGE_MAP') {
      setSelectedMap(message.content);
    } else if (message.type === 'START') {
      const gameInfo = message.content.split("\n");
      const playersData = [];

      gameInfo.forEach(line => {
        const match = line.match(/^(.+?):\s(.+?),\sSpeed:\s(\d+)$/);
        if (match) {
          const playerName = match[1].trim();
          const characterSrc = match[2].trim();
          const speed = parseInt(match[3], 10);

          playersData.push({user_id: playerName, characterSrc: characterSrc, speed: speed});
        }
      });

      // 순서를 유지한 채로 playersData를 사용
      setOrder(playersData); // 순서대로 저장된 정보를 그대로 사용
      setShowGameResult(true); // 결과 화면 표시
    }
  };


  useEffect(() => {
    if (showGameResult) {
      console.log('Order updated:', order); // 디버깅용

      let delay = 1000; // 각 순위가 나타나는 시간 간격 (밀리초)

      // 순번을 순차적으로 추가
      const tempOrder = [];
      order.forEach((player, index) => {
        setTimeout(() => {
          tempOrder.push(player);
          setOrder([...tempOrder]); // 새로운 배열로 설정하여 재렌더링
        }, delay * (index + 1));
      });
    }
  }, [showGameResult]); // order가 아니라 showGameResult가 변경될 때만 실행되도록 수정


  return (
    <div className="backStyle">
      {showYutPan ? (
        <YutPan roomId={roomId}/>
      ) : showGameResult ? (
        <RankAnimation players={order} userData={userData}/>
      ) : (
        <>
          <Modal open={isModalOpen} onClose={handleCloseModal}/>
          <InviteModal
            open={isInviteModalOpen}
            onClose={handleCloseInviteModal}
            userId={selectedUserId}
            client={client}  // client 객체를 전달
            roomId={roomId}
          />


          <InforModal
            open={isInforModalOpen}
            onClose={handleCloseInforModal}
            userId={selectedUserId}  // userId만 전달
          />

          {/* 친구 추가 요청 모달 (보낸 사람) */}
          <FriendFrom
            open={isFriendFromModalOpen}
            onClose={() => setIsFriendFromModalOpen(false)}
            onSendRequest={() => handleSendFriendRequest(selectedUserId)}
            senderNickname={senderNickname}
          />

          {/* 친구 추가 요청 모달 (받은 사람) */}
          <FriendTo
            open={isFriendToModalOpen} // 상태에 따라 모달이 열림
            onClose={() => setIsFriendToModalOpen(false)}
            senderNickname={senderNickname}
            userId={receiver} // 수신자의 ID
            friendId={sender} // 친구 요청을 보낸 사람의 ID
          />





          <div className="titleStyle">
            <h1>{roomName} {players.length}/4</h1>
            <button type="button" onClick={() => {
              leaveUser();
              window.close();
            }}>
              <b>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                     className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                  <path
                    d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                  <path
                    d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                </svg>
              </b>
            </button>
          </div>

          <div className="formStyle">
            {[...Array(4)].map((_, index) => {
              const player = players[index];
              return (
                <div className="cardStyle" key={index}>
                  {player ? (
                    <>
                      <div className="player-info">
                        <h3>{player.nickname}</h3>
                        <div className="options-container">
                          <Button
                            onClick={() => handleButtonClick(player.user_id)}
                            className="show-options-button"
                            style={{ backgroundColor: '#e1b389', display: player.user_id === userData.user_id ? 'none' : 'block' }}  // 자신에게는 보이지 않도록 설정
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 className="bi bi-three-dots" viewBox="0 0 16 16">
                              <path
                                d="M3 9.5a1.5.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5.5 0 1 1 0-3 1.5.5 0 0 1 0 3m5 0a.5.5 0 1 1 0-3 1.5.5 0 0 1 0 3"/>
                            </svg>
                          </Button>
                          {visibleOptions[player.user_id] && (
                            <div className="options-menu">
                              <Button
                                onClick={() => handleInforClick(player.user_id)}
                                style={{ backgroundColor: '#f1e7e0' }}
                              >
                                정보
                              </Button>
                              {player.user_id != userData.user_id && (  // 친구 추가 버튼은 자신에게 보이지 않게 설정
                                <Button
                                  onClick={() => handleSendFriendRequest(player.user_id)} // 친구 추가 버튼 클릭 시 모달 열기
                                  style={{ backgroundColor: '#f1e7e0' }}
                                >
                                  친추
                                </Button>
                              )}
                            </div>
                          )}

                        </div>
                      </div>

                      <div className="player-container" style={{position: 'relative'}}>
                        <img src={player.characterSrc} alt={player.user_id}/>
                        {balloons[player.user_id] && (
                          <div className={`balloon ${balloons[player.user_id] ? 'show' : ''}`}>
                            {balloons[player.user_id]}
                          </div>
                        )}
                      </div>
                      {index !== 0 && (
                        <div style={{padding: 10, width: "100%"}}>
                          <Button
                            type="button"
                            onClick={() => handleReadyClick(player)}
                            className={!showOptions ? '' : 'hidden'}
                          >
                            {player.ready ? '준비완료' : '준비'}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => handleInviteClick(userData.user_id)}
                      className="invite-button"
                      style={{backgroundColor: '#e1b389', marginTop: '100px'}}
                    >
                      초대하기
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="chatContainer">
            <div className="chatMessages" ref={chatMessagesRef}>
              {messages.map((msg, index) => (
                <div key={index}>
                  <b>{msg.nickname}: </b> {msg.content}
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

              {/*<button*/}
              {/*  onClick={() => setShowEmojiPicker(!showEmojiPicker)}*/}
              {/*  style={{ backgroundColor: "white", border: 'none', cursor: 'pointer' }}*/}
              {/*>*/}
              {/*  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"*/}
              {/*       className="bi bi-emoji-neutral" viewBox="0 0 16 16">*/}
              {/*    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />*/}
              {/*    <path*/}
              {/*      d="M4 10.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5m3-4C7 5.672 6.552 5 6 5s-1 .672-1 1.5S5.448 8 6 8s1-.672 1-1.5m4 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5S9.448 8 10 8s1-.672 1-1.5" />*/}
              {/*  </svg>*/}
              {/*</button>*/}
              <button onClick={sendMessage} className="chatSendButton">
                Send
              </button>
            </div>
          </div>
          {showEmojiPicker && (
            <>
              <div className="modalOverlay" onClick={() => setShowEmojiPicker(false)}></div>
              <div className="modalContainer">
                <Picker onEmojiClick={(event) => {
                  handleEmojiClick(event);
                  setShowEmojiPicker(false);
                }}/>


              </div>
            </>
          )}
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
            {players[0]?.user_id == userData?.user_id ? (
              <button className="map-select-button" onClick={handleMapSelect}>맵 변경</button>
            ) : null}
          </div>
          {players[0]?.user_id == userData?.user_id ? (
            <div className="start-button-section">
              <button className="start-button" onClick={handleStartGame} disabled={!allReady}>
                시작
              </button>
            </div>
          ) : null}


        </>
      )}

      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.22)",
        display: loading,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Lobby;
