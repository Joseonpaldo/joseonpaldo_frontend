"use client";

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
        console.log('친구 목록 데이터:', res.data);  // 응답 데이터 로그로 확인
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
    console.log("선택한 친구 데이터:", friend);  // 선택한 친구 데이터 확인

    if (friend !== oneFriend) {
      setIsChatRoom((prev) => !prev);
      setMessages([]);  // 새로운 친구를 선택할 때 메시지 초기화
    }

    // friendRelationId 대신 userId 사용
    setOneFriend({
      ...friend,
      friendRelationId: friend.userId // friendRelationId가 아니라 userId를 사용
    });

    console.log("friendRelationId:", friend.userId);  // userId 확인
  }


  // 유저 데이터 로드
  useEffect(() => {
    const jwt = localStorage.getItem('custom-auth-token');
    if (jwt) {
      getUserData(jwt)
        .then(data => {
          setUserData(data);  // userData가 로드된 후에만 WebSocket 설정
        })
        .catch(error => console.error('사용자 데이터 로드 실패:', error));
    }
  }, []);

  // 웹소켓 연결 및 구독
  useEffect(() => {
    if (userData) {
      const socket = new SockJS('/ws/');
      const stompClient = Stomp.over(socket);

      stompClient.connect({}, (frame) => {
        console.log('WebSocket 연결 성공: ' + frame);

        const subscribeUrl = `/user/${userData.userId}/queue/messages`; // undefined 대신 userId 사용
        console.log('WebSocket 구독 경로:', subscribeUrl);

        // 구독 설정
        stompClient.subscribe(subscribeUrl, (message) => {
          const newMessage = JSON.parse(message.body);
          console.log("새 메시지 수신:", newMessage);

          setMessages(prevMessages => [
            ...prevMessages,
            { senderId: newMessage.senderId, content: newMessage.messageContent, timestamp: newMessage.timestamp }
          ]);
        });
      }, (error) => {
        console.error('WebSocket 연결 실패:', error);
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


  // 메시지 전송 함수
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
          <div className="chat-room" style={{border:'3px solid black'}}>
            <h3>{oneFriend.nickname}님과의 채팅</h3>
            <div className="chat-messages" style={{ height: '300px', overflowY: 'scroll', padding: '10px', border: '1px solid gray' }}>
              {/* 메시지 로그 표시 부분 */}
              {messages.map((msg, idx) => (
                <div key={idx} style={{ textAlign: msg.senderId === userData.user_id ? 'right' : 'left' }}>
                  <p style={{color:'black'}}><strong>{msg.senderId === userData.user_id ? '나' : oneFriend.nickname}:</strong> {msg.content}</p>
                  <p style={{ fontSize: '12px', color: 'gray' }}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
            <div className="chat-input" style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="메시지를 입력하세요"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(e.target.value);
                    e.target.value = ''; // 입력란 비우기
                  }
                }}
                style={{ width: '80%', padding: '10px', marginRight: '10px' }}
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
