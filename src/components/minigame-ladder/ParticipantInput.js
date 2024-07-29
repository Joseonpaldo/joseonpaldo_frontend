import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../components/PartcipantInput.css';

const ParticipantInput = ({ onParticipantsSubmit }) => {
    const [participants, setParticipants] = useState(0);
    const [names, setNames] = useState([]);

    useEffect(() => {
        const socket = new SockJS('/ws');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/participants', (message) => {
                const participantData = JSON.parse(message.body);
                setParticipants(participantData.participantCount);
                setNames(participantData.participantNames);
                onParticipantsSubmit(participantData);
            });
        });
    }, [onParticipantsSubmit]);

    return (
        <div className="participant-container">
            <h1 className="participant-title">사다리게임</h1>
            <div className="participant-form">
                <p>참가자 수: {participants}</p>
                <ul>
                    {names.map((name, index) => (
                        <li key={index}>{name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ParticipantInput;
