import './Friend.css';  // CSS 파일을 불러옵니다
import apiAxiosInstance from '@/hooks/apiAxiosInstance';
import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from "@stomp/stompjs";
import InviteModal from '../game/InviteModal';
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

  // 초대 모달 관련 상태
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviter, setInviter] = useState('');
  const [inviteRoomId, setInviteRoomId] = useState('');

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
    }
  }, []);

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
    }
  };


  const handleAcceptInvite = () => {
    // 초대 수락 시 해당 방으로 이동
    window.location.href = `/lobby/${inviteRoomId}`;
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false); // 초대 모달 닫기
  };

  // friendButton 함수 정의
  const friendButton = (friend) => {
    setOneFriend(friend);
    setIsChatRoom(true); // 선택된 친구와의 채팅 화면으로 이동
  };

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
          <button onClick={() => setIsChatRoom(false)} className="button">친구 목록으로 돌아가기</button>
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

      {/* 초대 모달 */}
      <Accept
        open={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        inviter={inviter} // 초대한 사용자 정보 전달
        onAccept={handleAcceptInvite} // 초대 수락 핸들러 전달
        roomId={inviteRoomId}
      />
    </>
  );
}
