import React from 'react';
import '../minigame-card/Card.css';

const CardGame = ({ card, onClick, isFlipped }) => (
    <div className={`card ${isFlipped ? 'flipped' : 'back'}`} onClick={() => onClick(card)}>
        {isFlipped ? card.content : ''}
    </div>
);

export default CardGame;
