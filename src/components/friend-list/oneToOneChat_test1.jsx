import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from '@stomp/stompjs';

export default function OneTonOneChat(friend, userId, stompClient) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [friendId, setFriendId] = useState(null);

    useEffect(() => {
        // const socket = new SockJS('https://joseonpaldo.site/ws');
        const socket = new SockJS("/http://localhost:8081/ws")
        const stompClient = Stomp.over(socket);
        setStompClient(stompClient);

        stompClient.connect({}, () => {
            stompClient.subscribe(`/user/queue/private`, (msg) => {
                if (msg.body) {
                    setMessages((prev) => [...prev, JSON.parse(msg.body)]);
                }
            });
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    const sendMessage = () => {
        if (stompClient && message && friendId) {
            stompClient.send(`/app/oneChat/chat.private.${friendId}`, {}, JSON.stringify({
                senderId: userId,
                recipientId: friendId,
                message: message
            }));
            setMessage('');
        }
    };

    //요놈 시작하자마자 chat log 한번 싹 불러오기

    return (
        <div>
            <div>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.senderId}: {msg.message}</div>
                ))}
            </div>
        </div>
    );
}
