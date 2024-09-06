import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default function Chat({ friend, userData, stompClient }) {
    const [messages, setMessages] = useState([]);  // 채팅 메시지 리스트
    const [inputMessage, setInputMessage] = useState('');  // 현재 입력된 메시지
    const messageEndRef = useRef(null);  // 채팅창 하단으로 스크롤하기 위한 ref

    useEffect(() => {
        // 채팅 내역 불러오기
        async function fetchChatHistory() {
            try {
                const response = await apiAxiosInstance.get(`/chat/history/${friend.userId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch chat history', error);
            }
        }

        // 친구 선택 시, 이전 채팅 기록을 불러옴
        fetchChatHistory();

        // 친구와의 채팅 경로에 구독 설정
        const subscription = stompClient.subscribe(`/user/${userData.userId}/queue/private`, (msg) => {
            const receivedMessage = JSON.parse(msg.body);
            if (receivedMessage.senderId === friend.userId) {
                // 친구에게서 온 메시지일 때만 추가
                setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            }
        });

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [friend, stompClient, userData]);

    useEffect(() => {
        // 새로운 메시지가 추가되면 채팅창 하단으로 스크롤
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (inputMessage.trim() !== '') {
            const message = {
                senderId: userData.userId,  // 현재 사용자 ID
                recipientId: friend.userId,  // 친구의 사용자 ID
                message: inputMessage,      // 전송할 메시지 내용
                timestamp: new Date(),      // 전송 시각
            };

            // 메시지 WebSocket으로 전송
            stompClient.send(`/app/chat.private.${friend.userId}`, {}, JSON.stringify(message));

            // 로컬 메시지 목록에 전송한 메시지 추가
            setMessages((prevMessages) => [...prevMessages, message]);
            setInputMessage('');  // 입력창 비우기
        }
    };

    return (
        <div style={styles.chatContainer}>
            {/* 채팅 메시지 리스트 */}
            <div style={styles.messagesContainer}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={msg.senderId === userData.userId ? styles.myMessage : styles.friendMessage}
                    >
                        <span>{msg.message}</span>
                        <span style={styles.timestamp}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/* 메시지 입력창 */}
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}  // Enter 누르면 전송
                    placeholder="메시지를 입력하세요..."
                    style={styles.inputField}
                />
                <button onClick={sendMessage} style={styles.sendButton}>전송</button>
            </div>
        </div>
    );
}

const styles = {
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '400px',
        width: '300px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '10px',
    },
    messagesContainer: {
        flex: 1,
        overflowY: 'scroll',
        marginBottom: '10px',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#d1e7ff',
        borderRadius: '10px',
        padding: '5px 10px',
        marginBottom: '5px',
    },
    friendMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        padding: '5px 10px',
        marginBottom: '5px',
    },
    timestamp: {
        fontSize: '0.8em',
        color: '#999',
        marginLeft: '10px',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    inputField: {
        flex: 1,
        padding: '5px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    sendButton: {
        marginLeft: '10px',
        padding: '5px 10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};
