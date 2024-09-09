import './Friend.css';  // CSS 파일을 불러옵니다
import apiAxiosInstance from '@/hooks/apiAxiosInstance';
import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from "@stomp/stompjs";

export default function FriendList() {
  const jwt = localStorage.getItem('custom-auth-token');

  const [userData, setUserData] = useState(null);
  const [friendList, setFriendList] = useState([]);
  const [oneFriend, setOneFriend] = useState(null);
  const [isChatRoom, setIsChatRoom] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);

  async function getUserData(jwt) {
    try {
      const response = await apiAxiosInstance.get(`/user/${jwt}`);
      return response.data;
    } catch (error) {
      console.error("유저 데이터 로드 실패", error);
      throw error;
    }
  }

  async function getFriendList() {
    if (jwt != null) {
      await apiAxiosInstance.get(`/friend/list/${jwt}`)
        .then(res => {
          console.log('친구 목록 데이터:', res.data);
          if (Array.isArray(res.data)) {
            setFriendList([...res.data]);
          } else {
            console.error("친구 목록 데이터가 배열이 아닙니다.", res.data);
          }
        })
        .catch(e => console.error("친구 목록 가져오기 실패", e));
    }
  }

  function friendButton(friend) {
    console.log("선택한 친구 데이터:", friend);
    if (!friend.chatRoomId) {
      apiAxiosInstance.post('/chat/createOrGetChatRoom', {
        userId1: userData.user_id,
        userId2: friend.userId
      })
        .then(res => {
          const chatRoomId = res.data.roomId;
          console.log('채팅방 생성 또는 조회 성공:', chatRoomId);

          setOneFriend({
            ...friend,
            chatRoomId: chatRoomId
          });

          setIsChatRoom(true);

          apiAxiosInstance.get(`/room/${chatRoomId}/messages`)
            .then(res => {
              if (res.headers['content-type'].includes('application/json')) {
                if (Array.isArray(res.data)) {
                  const loadedMessages = res.data.map(msg => ({
                    senderId: msg.sender.userId,
                    senderNickname: msg.sender.nickname,
                    content: msg.messageContent,
                    timestamp: msg.sentAt,
                  }));
                  setMessages(loadedMessages);
                } else {
                  console.error("메시지 데이터가 배열이 아닙니다.", res.data);
                }
              } else {
                console.error("메시지 조회 실패: 인증이 필요합니다.");
              }
            })
            .catch(error => {
              console.error('메시지 조회 실패:', error);
            });
        })
        .catch(error => console.error('채팅방 생성 또는 조회 실패:', error));
    } else {
      setOneFriend(friend);
      setIsChatRoom(true);
      apiAxiosInstance.get(`/room/${friend.chatRoomId}/messages`)
        .then(res => {
          if (Array.isArray(res.data)) {
            const loadedMessages = res.data.map(msg => ({
              senderId: msg.sender.userId,
              senderNickname: msg.sender.nickname,
              content: msg.messageContent,
              timestamp: msg.sentAt,
            }));
            setMessages(loadedMessages);
          } else {
            console.error("메시지 데이터가 배열이 아닙니다.", res.data);
          }
        })
        .catch(error => console.error('메시지 내역 불러오기 실패:', error));
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
    }
  }, []);

  useEffect(() => {
    if (userData) {
      const socket = new SockJS('/ws/');
      const stompClient = Stomp.over(socket);

      stompClient.connect({}, (frame) => {
        console.log('WebSocket 연결 성공: ' + frame);

        const subscribeUrl = `/user/${userData.user_id}/queue/messages`;
        console.log('WebSocket 구독 경로:', subscribeUrl);

        stompClient.subscribe(subscribeUrl, (message) => {
          const newMessage = JSON.parse(message.body);
          console.log("새 메시지 수신:", newMessage);

          setMessages(prevMessages => [
            ...prevMessages,
            {
              senderId: newMessage.senderId,
              content: newMessage.messageContent,
              timestamp: newMessage.timestamp
            }
          ]);
        });
      }, (error) => {
        console.error('WebSocket 연결 실패:', error);
        setTimeout(() => {
          console.log("WebSocket 재연결 시도 중...");
          stompClient.connect();
        }, 5000);
      });

      setStompClient(stompClient);

      return () => {
        if (stompClient) {
          stompClient.disconnect(() => {
            console.log('WebSocket 연결 해제');
          });
        }
      };
    }
  }, [userData]);

  function sendMessage(messageContent) {
    if (stompClient && stompClient.connected && messageContent.trim() !== '') {
      // 데이터 로그 확인
      console.log("senderId:", userData.user_id); // senderId 확인
      console.log("receiverId:", oneFriend.userId); // receiverId 확인
      console.log("userId1:", userData.user_id); // userId1 확인
      console.log("userId2:", oneFriend.userId); // userId2 확인

      if (!userData.user_id || !oneFriend.userId) {
        console.error('필수 값이 누락되었습니다. senderId, receiverId, 또는 userId1, userId2가 null입니다.');
        return;
      }

      const chatMessage = {
        senderId: userData.user_id,
        receiverId: oneFriend.userId,
        userId1: userData.user_id, // userId1을 sender로 설정
        userId2: oneFriend.userId, // userId2를 receiver로 설정
        messageContent: messageContent,
        timestamp: new Date().toISOString(),
      };

      stompClient.send("/app/chat/sendMessage", {}, JSON.stringify(chatMessage));

      // 내가 보낸 메시지를 화면에 추가
      setMessages(prevMessages => [
        ...prevMessages,
        { senderId: userData.user_id, content: messageContent, timestamp: new Date().toISOString() }
      ]);
    }
  }

  function closeChatRoom() {
    setIsChatRoom(false);
    setOneFriend(null);
    setMessages([]);
  }

  return (
    <>
      {!isChatRoom ? (
        <div className="friend-list-container">
          <button onClick={getFriendList} className="button">친구 목록 보기</button>
          <ul className="friend-list">
            {
              friendList.map((item, idx) => (
                <li key={idx} className="friend-list-item">
                  <button onClick={() => friendButton(item)} className="friend-button">
                    {item.userId} : {item.nickname}
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
      ) : (
        <div className="chat-room">
          <button onClick={closeChatRoom} className="button">친구 목록으로 돌아가기</button>
          <h3>{oneFriend.nickname}님과의 채팅</h3>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} style={{ textAlign: msg.senderId === userData.user_id ? 'right' : 'left' }}>
                <p style={{ color: 'black' }}>
                  <strong>{msg.senderId === userData.user_id ? '나' : msg.senderNickname}:</strong> {msg.content}
                </p>
                <p style={{ fontSize: '12px', color: 'gray' }}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="메시지를 입력하세요"
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
    </>
  );
}
