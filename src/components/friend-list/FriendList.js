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
  const [checkFriend, setCheckFriend] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [stompClient, setStompClient] = useState(null);

  // 유저 데이터 가져오기
  async function getUserData(jwt) {
    try {
      const response = await apiAxiosInstance.get(`/user/${jwt}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 친구 목록 가져오기
  async function getFriendList() {
    if (jwt != null) {
      await apiAxiosInstance.get(`/friend/list/${jwt}`)
        .then(res => {
          const list = [];
          res.data.map((e, idx) => {
            list.push(e);
          });
          setFriendList([...list]);
        })
        .catch(e => console.error(e));
    }
  }

  // 채팅창 열기
  function friendButton(friend) {
    if (friend !== oneFriend) {
      setIsChatRoom((prev) => !prev);
    }
    setOneFriend(friend);
    console.log("일단 눌리긴함");
  }

  // 유저 데이터 로드
  useEffect(() => {
    const jwt = localStorage.getItem('custom-auth-token');
    if (jwt) {
      getUserData(jwt)
        .then(data => setUserData(data))
        .catch(error => console.error('사용자 데이터 로드 실패:', error));
    }
  }, []);

  // 웹소켓 연결 및 구독
  useEffect(() => {
    if (userData) {  // userData가 로드된 후에 웹소켓 연결
      const socket = new SockJS('/ws/');
      const stompClient = Stomp.over(socket);

      stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);

        // 구독 경로 설정 (사용자 ID 기반)
        stompClient.subscribe(`/user/${userData.userId}/queue/messages`, (message) => {
          const newMessage = JSON.parse(message.body);
          // 수신한 메시지를 처리하는 로직
          console.log("새 메시지:", newMessage);

          // 여기에서 unreadMessages를 업데이트하는 로직 추가 가능
          setUnreadMessages(prev => ({
            ...prev,
            [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
          }));
        });
      });

      setStompClient(stompClient);

      // 컴포넌트가 언마운트될 때 연결 해제
      return () => {
        if (stompClient) {
          stompClient.disconnect();
        }
      };
    }
  }, [userData]);

  // 메시지 전송 함수
  function sendMessage(messageContent) {
    if (stompClient && stompClient.connected && messageContent.trim() !== '') {
      const chatMessage = {
        senderId: userData.userId,
        receiverId: oneFriend.userId,  // 선택한 친구에게 전송
        messageContent: messageContent,
        timestamp: new Date().toISOString(),
      };
      stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    }
  }

  return (
    <>
      <button onClick={getFriendList}>친구창</button>
      <div>
        <ul>
          {
            friendList.map((item, idx) => {
              return (
                <li key={idx}>
                  <button onClick={() => friendButton(item)}>{item.userId} : {item.nickname}</button>
                </li>
              );
            })
          }
        </ul>
      </div>

      {
        isChatRoom && (
          <div className="chat-room">
            <h3>{oneFriend.nickname}님과의 채팅</h3>
            <div className="chat-messages">
              {/* 메시지 로그 표시 부분 */}
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
              />
              <button onClick={() => sendMessage(document.querySelector('.chat-input input').value)}>
                전송
              </button>
            </div>
          </div>
        )
      }
    </>
  );
}
