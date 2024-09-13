import './Friend.css';
import apiAxiosInstance from '@/hooks/apiAxiosInstance';
import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from "@stomp/stompjs";
import Accept from "@/components/game/Accept";
import DeleteFriend from "@/components/friend-list/DeleteFriend"; // 초대 모달 컴포넌트 추가

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState(null); // 삭제할 친구의 ID

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
      // 읽지 않은 메시지 카운트 업데이트
      if (oneFriend?.userId !== message.senderId) {  // 현재 채팅 중인 친구가 아니면
        setUnreadMessages(prev => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1
        }));
      }

      // 메시지 전송 후, loadMessages 함수 실행
      if (oneFriend && oneFriend.chatRoomId) {
        loadMessages(oneFriend.chatRoomId);
      }

    }
  };

  // 총 읽지 않은 메시지 수
  const getTotalUnreadCount = () => {
    return Object.values(unreadMessages).reduce((acc, count) => acc + count, 0);
  };


  // 채팅창 열기 함수
  function friendButton(friend) {
    setOneFriend(friend);
    setIsChatRoom(true);

    // 해당 친구의 읽지 않은 메시지 카운트 초기화
    setUnreadMessages(prev => ({
      ...prev,
      [friend.userId]: 0
    }));

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
    apiAxiosInstance.get('/chat/history', {
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
  function sendMessage() {
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
      setMessageContent(''); // 전송 후 입력값 비우기
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

  const [messageContent, setMessageContent] = useState(''); // 입력 상태 관리


// 친구 삭제 버튼을 누르면 모달을 열고 삭제할 친구 ID를 설정
  function handleDeleteFriend(friendId) {
    setFriendToDelete(friendId); // 삭제할 친구의 ID 설정
    setTimeout(() => {
      setIsDeleteModalOpen(true);  // 모달 열기 (상태 업데이트 딜레이로 보장)
    }, 0);
  }

// 친구 삭제 처리 함수
  function confirmDeleteFriend() {
    if (friendToDelete) {
      apiAxiosInstance.delete(`/friend/delete/${userData.user_id}/${friendToDelete}`)
        .then(() => {
          setFriendList(prevList => prevList.filter(friend => friend.userId !== friendToDelete));
          setIsDeleteModalOpen(false);  // 모달 닫기
        })
        .catch(error => console.error('친구 삭제 실패:', error));
    }
  }


  return (

    <div className={"friendd"}>
      <>
        {!isChatRoom ? (
          <div style={{position: 'absolute', bottom: '0'}}>
            <>
              {!isChatRoom ? (
                <div className="friend-list-container">
                  <button onClick={toggleFriendList} className="button">
                    친구 목록
                    {getTotalUnreadCount() > 0 && (
                      <span className="total-unread-count" style={{
                        marginLeft: '10px',
                        color: 'red',
                        fontWeight: 'bold',
                      }}>
                ({getTotalUnreadCount()})
              </span>
                    )}
                  </button>

                  {showFriendList && ( // 친구 목록을 토글하여 표시
                    <ul className="friend-list">
                      {friendList.map((item, idx) => (
                        <li key={idx} className="friend-list-item">
                          <button onClick={() => friendButton(item)} className="friend-button">
                            {item.nickname}
                            {unreadMessages[item.userId] > 0 && (
                              <span className="unread-count"
                                    style={{marginLeft: '10px', color: 'red', fontWeight: 'bold'}}>
                        {unreadMessages[item.userId]}
                      </span>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteFriend(item.userId)} // 친구 삭제 모달 열기
                            className="delete-button">
                            X
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="chat-room">
                  {/* 채팅 메시지 관련 UI */}
                </div>
              )}

              {/* 친구 삭제 모달 */}
              <DeleteFriend
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}  // 모달 닫기
                onConfirm={confirmDeleteFriend}  // "예" 버튼 클릭 시 실행될 함수
              />
            </>
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
            }}>✕
            </button>

            {/* 채팅 메시지 목록 */}
            <div style={{display: 'flex'}}>
              <img
                src={oneFriend.profilePicture}
                alt="profile"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  marginRight: '5px',
                  marginBottom: '10px'
                }}
              />
              <h3 style={{margin: '5px'}}>{oneFriend.nickname}님과의 채팅</h3>
            </div>
            <div className="chat-messages" ref={chatMessagesRef} style={{maxHeight: '400px', overflowY: 'auto'}}>
              {messages.map((msg, idx) => {
                const isSender = msg.senderId === userData.user_id;
                const friend = friendList.find(f => f.userId === (isSender ? msg.receiverId : msg.senderId));
                const displayName = isSender ? '나' : (friend ? friend.nickname : '알 수 없음');

                const profilePicture = isSender ? userData.profilePicture : friend ? oneFriend.profilePicture : null;

                const showTimestamp =
                  idx === messages.length - 1 ||
                  msg.senderId !== messages[idx + 1].senderId ||
                  new Date(messages[idx + 1].timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) !==
                  new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

                const showName =
                  idx === 0 ||
                  msg.senderId !== messages[idx - 1].senderId ||
                  new Date(messages[idx - 1].timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit' }) !==
                  new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: isSender ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      marginBottom: '20px',
                    }}
                  >
                    {/* 프로필 사진 */}
                    {showName && profilePicture && (
                      <img
                        src={profilePicture}
                        alt="profile"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          marginRight: isSender ? '0' : '10px',
                          marginLeft: isSender ? '10px' : '0',
                        }}
                      />
                    )}

                    {/* 메시지와 시간 */}
                    <div style={{ maxWidth: '70%', textAlign: isSender ? 'right' : 'left' }}>
                      {/* 본인 메시지일 경우 시간 먼저 출력 */}
                      {isSender ? (
                        <>
                          {showTimestamp && (
                            <span style={{ fontSize: '10px', color: 'gray', marginRight: '10px' }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
                          )}
                          <span
                            style={{
                              color: 'black',
                              backgroundColor: 'white',
                              padding: '8px',
                              borderRadius: '15px',
                            }}
                          >
              {msg.content}
            </span>
                        </>
                      ) : (
                        <>
            <span
              style={{
                color: 'black',
                backgroundColor: 'white',
                padding: '8px',
                borderRadius: '15px',
              }}
            >
              {msg.content}
            </span>
                          {showTimestamp && (
                            <span style={{ fontSize: '10px', color: 'gray', marginLeft: '10px' }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>

            {/* 채팅 입력 및 전송 버튼 */}
            <div className="chat-input">
              <input
                type="text"
                value={messageContent} // 입력값을 상태와 연결
                placeholder="메시지를 입력하세요..."
                onChange={(e) => setMessageContent(e.target.value)} // 입력값 업데이트
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                className="input"
              />
              <button onClick={sendMessage} className="send-button">전송</button>
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
