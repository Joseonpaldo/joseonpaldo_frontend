import './Friend.css';
import apiAxiosInstance from '@/hooks/apiAxiosInstance';
import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from "@stomp/stompjs";
import Accept from "@/components/game/Accept"; // 초대 모달 컴포넌트 추가

export default function FriendList() {
  const jwt = localStorage.getItem('custom-auth-token');
  const [userData, setUserData] = useState(null);
  const [friendList, setFriendList] = useState([]);
  const [oneFriend, setOneFriend] = useState(null);
  const [isChatRoom, setIsChatRoom] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const chatMessagesRef = useRef(null);  // 채팅 메시지 div에 대한 ref
  const [showFriendList, setShowFriendList] = useState(false); // 친구 목록 표시 여부 상태 추가

  // 초대 모달 관련 상태
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviter, setInviter] = useState('');
  const [inviteRoomId, setInviteRoomId] = useState('');

  // 유저 데이터 가져오기
  async function getUserData(jwt) {
    try {
      const response = await apiAxiosInstance.get(`/user/${jwt}`);
      return response.data;
    } catch (error) {
      console.error("유저 데이터 로드 실패", error);
      throw error;
    }
  }

  // 친구 목록 가져오기
  async function getFriendList() {
    if (jwt != null) {
      await apiAxiosInstance.get(`/friend/list/${jwt}`)
        .then(res => {
          if (Array.isArray(res.data)) {
            setFriendList([...res.data]);
          }
        })
        .catch(e => console.error("친구 목록 가져오기 실패", e));
    }
  }

  useEffect(() => {
    const jwt = localStorage.getItem('custom-auth-token');
    if (jwt) {
      getUserData(jwt)
        .then(data => {
          setUserData(data);
        })
        .catch(error => console.error('사용자 데이터 로드 실패:', error));

      getFriendList();
    }
  }, []);

  // 웹소켓 연결 및 메시지 처리
  useEffect(() => {
    if (userData) {
      const socket = new SockJS('/ws/');
      const stompClient = Stomp.over(socket);

      setStompClient(stompClient);

      stompClient.connect({}, (frame) => {
        const subscribeUrl = `/topic/${userData.user_id}`;  // 클라이언트는 이 경로를 구독해야 함

        stompClient.subscribe(subscribeUrl, (message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            receivedMessage(parsedMessage);  // 메시지 수신 처리
          } catch (error) {
            console.error('Failed to parse message:', message.body, error);
          }
        });
      }, (error) => {
        console.error('WebSocket connection error:', error);
      });

      return () => {
        if (stompClient) {
          stompClient.disconnect();
        }
      };
    }
  }, [userData]);

  // 메시지 수신 처리 함수
  const receivedMessage = (message) => {
    if (message.type === 'INVITE') {
      console.log(message);
      setInviteRoomId(message.roomId);
      setInviter(message.nickname);  // 초대한 사람의 ID나 이름 설정
      setIsInviteModalOpen(true);
    } else if (message.type === 'MESSAGE') {
      // 채팅 메시지 수신 시 처리
      setMessages(prevMessages => [
        ...prevMessages,
        {
          senderId: message.senderId,
          content: message.messageContent,
          timestamp: message.timestamp
        }
      ]);
    }
  };

  // 채팅창 열기 함수
  function friendButton(friend) {
    setOneFriend(friend);
    setIsChatRoom(true);
    if (!friend.chatRoomId) {
      apiAxiosInstance.post('/chat/createOrGetChatRoom', {
        userId1: userData.user_id,
        userId2: friend.userId
      })
        .then(res => {
          const chatRoomId = res.data.roomId;
          setOneFriend({
            ...friend,
            chatRoomId: chatRoomId
          });
          loadMessages(chatRoomId);
        })
        .catch(error => console.error('채팅방 생성 또는 조회 실패:', error));
    } else {
      loadMessages(friend.chatRoomId);
    }
  }

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight; // 맨 아래로 스크롤
    }
  }, [messages]); // messages 상태가 변경될 때마다 실행

  // 메시지 로드 함수
  function loadMessages(chatRoomId) {
    apiAxiosInstance.get(`/chat/history`, {
      params: { roomId: chatRoomId }  // 방 ID를 쿼리 파라미터로 보냄
    })
      .then(res => {
        if (Array.isArray(res.data)) {
          const loadedMessages = res.data.map(msg => ({
            senderId: msg.senderId,
            senderNickname: msg.senderNickname,
            content: msg.messageContent,
            timestamp: msg.timestamp,
          }));
          setMessages(loadedMessages);
        }
      })
      .catch(error => console.error('메시지 내역 불러오기 실패:', error));
  }

  // 메시지 전송 함수
  function sendMessage(messageContent) {
    if (stompClient && stompClient.connected && messageContent.trim() !== '') {
      const chatMessage = {
        senderId: userData.user_id,
        receiverId: oneFriend.userId,
        userId1: userData.user_id,
        userId2: oneFriend.userId,
        messageContent: messageContent,
        timestamp: new Date().toISOString(),
      };
      stompClient.send("/app/chat/sendMessage", {}, JSON.stringify(chatMessage));
      setMessages(prevMessages => [
        ...prevMessages,
        { senderId: userData.user_id, content: messageContent, timestamp: new Date().toISOString() }
      ]);
    }
  }

  // 초대 수락 핸들러
  const handleAcceptInvite = () => {
    window.location.href = `/lobby/${inviteRoomId}`;
  };

  // 초대 모달 닫기 핸들러
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  // 친구 목록 토글 핸들러
  const toggleFriendList = () => {
    setShowFriendList(prevState => !prevState);
  };

  return (
    <div style={{position:'absolute', bottom:'0'}}>
      <>
        {!isChatRoom ? (
          <div className="friend-list-container">
            <button onClick={toggleFriendList} className="button">친구 목록</button>

            {showFriendList && ( // 친구 목록을 토글하여 표시
              <ul className="friend-list">
                {friendList.map((item, idx) => (
                  <li key={idx} className="friend-list-item">
                    <button onClick={() => friendButton(item)} className="friend-button">
                      {item.userId} : {item.nickname}
                    </button>
                  </li>
                ))}
              </ul>
            )}

          </div>
        ) : (
          <div className="chat-room">
            {/* X 버튼 추가 */}
            <button onClick={() => setIsChatRoom(false)} className="close-button" style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer'
            }}>✕</button>

            <h3>{oneFriend.nickname}님과의 채팅</h3>
            <div className="chat-messages" ref={chatMessagesRef} style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {messages.map((msg, idx) => {
                const isSender = msg.senderId === userData.user_id;
                const friend = friendList.find(f => f.userId === (isSender ? msg.receiverId : msg.senderId));
                const displayName = isSender ? '나' : (friend ? friend.nickname : '알 수 없음');

                return (
                  <div key={idx} style={{textAlign: isSender ? 'right' : 'left'}}>
                    <p style={{color: 'black'}}>
                      <strong>{displayName} :</strong> {msg.content}
                      <span style={{fontSize: '10px', color: 'gray', marginLeft: '10px'}}>
                       {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </span>
                    </p>
                  </div>

                );
              })}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(e.target.value);
                    e.target.value = ''; // 입력란 비우기
                  }
                }}
                className="input"
              />
              <button onClick={() => sendMessage(document.querySelector('.chat-input input').value)} className="send-button">
                전송
              </button>
            </div>
          </div>
        )}

        {/* 초대 모달 */}
        <Accept
          open={isInviteModalOpen}
          onClose={handleCloseInviteModal}
          inviter={inviter}
          onAccept={handleAcceptInvite}
          roomId={inviteRoomId}
        />
      </>
    </div>
  );

}
