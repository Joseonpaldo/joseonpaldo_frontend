"use client";
import React, { useState, useEffect } from 'react';
import CardGame from './CardGame';
import { cards as initialCards } from './CardData';
import { useParams } from "react-router";

const CardComponent = () => {
  const { roomId } = useParams();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 초기 카드 설정
    const shuffledCards = [...initialCards, ...initialCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, key: index }));
    setCards(shuffledCards);
    console.log('Shuffled cards:', shuffledCards);
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/commend/" + roomId);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      console.log('Received:', event.data);
      const onMessage = JSON.parse(event.data);

      if (onMessage.type === "message") {
        console.log(onMessage.msg);
      } else if (onMessage.type === "gameState") {
        // 서버로부터 받은 게임 상태 업데이트
        setCards(onMessage.cards);
        setFlippedCards(onMessage.flippedCards);
        setMatchedCards(onMessage.matchedCards);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [roomId]);

  const handleCardClick = (clickedCard) => {
    if (flippedCards.length === 2 || matchedCards.includes(clickedCard) || flippedCards.includes(clickedCard)) return;

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstCard, secondCard] = newFlippedCards;
      const match = firstCard.content === secondCard.content;

      setTimeout(() => {
        let newMatchedCards = matchedCards;
        if (match) {
          newMatchedCards = [...matchedCards, firstCard, secondCard];
          setMatchedCards(newMatchedCards);
        }
        setFlippedCards([]);
        if (socket) {
          socket.send(JSON.stringify({
            type: 'gameState',
            cards: cards,
            flippedCards: [],
            matchedCards: newMatchedCards,
            result: match ? "O" : "X"
          }));
        }
      }, 1000);
    }
  };

  return (
    <div className="game-board">
      {cards.map((card) => (
        <CardGame
          key={card.key}
          card={card}
          onClick={() => handleCardClick(card)}
          isFlipped={flippedCards.includes(card) || matchedCards.includes(card)}
        />
      ))}
    </div>
  );
};

export default CardComponent;
