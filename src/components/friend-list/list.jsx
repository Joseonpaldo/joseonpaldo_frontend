'use client';

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
  const [chatMessages, setChatMessages] = useState([]); // 추가된 상태
  const [messageContent, setMessageContent] = useState('');

  // 유저 데이터 가져오기
  async function getUserData(jwt) {
    try {
      const response = await apiAxiosInstance.get(`/user/${jwt}`);
      return response.data;
    } catch (error) {
      console.error('사용자 데이터 로드 실패:', error);
    }
  }

  // 친구 목록 가져오기
  async function getFriendList() {
    if (jwt && userData) {
      try {
        const response = await apiAxiosInstance.get(`/friend?userId=${userData.user_id}`);
        setFriendList(response.data);
      } catch (error) {
        console.error('친구 목록 로드 실패:', error);
      }
    }
  }

  async function fetchChatHistory() {
    if (userData && oneFriend) {
      try {
        const response = await apiAxiosInstance.get('/chat/history', {
          params: {
            userId: userData.user_id,
            friendId: oneFriend.user_id
          }
        });
        setChatMessages(response.data);
      } catch (error) {
        console.error('채팅 내역 로드 실패:', error);
      }
    }
  }

  // 채팅창 열기
  function friendButton(friend) {
    if (friend !== oneFriend) {
      setIsChatRoom(true);
    } else {
      setIsChatRoom(prev => !prev);
    }
    setOneFriend(friend);
  }

  // 유저 데이터 로드
  useEffect(() => {
    if (jwt) {
      getUserData(jwt).then(data => setUserData(data));
    }
  }, [jwt]);

  // 웹소켓 연결 및 구독
  useEffect(() => {
    if (userData) {
      const socket = new SockJS('/ws/');
      const stompClient = Stomp.over(socket);

      stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        
          stompClient.subscribe(`/user/${userData.user_id}/queue/messages`, (message) => {
            try {
              const newMessage = JSON.parse(message.body);
              console.log("새 메시지:", newMessage);

              // 이전 메시지와 새로운 메시지를 합쳐 상태 업데이트
              setChatMessages(prevMessages => [...prevMessages, newMessage]);
            } catch (error) {
              console.error("메시지 처리 중 에러 발생:", error);
            }
        });
      }, (error) => {
        console.error("WebSocket 연결 오류:", error);
      });

      setStompClient(stompClient);

      // 컴포넌트 언마운트 시 연결 해제
      return () => {
        if (stompClient) {
          stompClient.disconnect(() => {
            console.log('Disconnected');
          });
        }
      };
    }
  }, [userData]);

  // 메시지 전송 함수
  function sendMessage() {
    if (stompClient && stompClient.connected && messageContent.trim() !== '') {
      const chatMessage = {
        sender_id: userData.user_id,
        recipient_id: oneFriend.user_id,  // 선택한 친구에게 전송
        chat_log: messageContent,
        msg_time: new Date(),
      };
      stompClient.send("/app/chat.sendOneToOneMsg", {}, JSON.stringify(chatMessage));
      setMessageContent(''); // 메시지 전송 후 입력란 비우기
    }
  }

  return (
    <>
      <button onClick={getFriendList}>친구 목록</button>
      <div>
        <ul>
          {friendList.map((item, idx) => (
            <li key={idx}>
              <button onClick={() => friendButton(item)}>
                {item.user_id} : {item.nickname}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isChatRoom && (
        <div className="chat-room">
          <h3>{oneFriend.nickname}님과의 채팅</h3>
          <div className="chat-messages">
            {chatMessages.map((message, idx) => (
              <div key={idx} className={`message ${message.sender_id === userData.user_id ? 'sent' : 'received'}`}>
                <p>{message.chat_log}</p>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="메시지를 입력하세요"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)} // 상태 업데이트
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            <button onClick={sendMessage}>전송</button>
          </div>
        </div>
      )}
    </>
  );
}
