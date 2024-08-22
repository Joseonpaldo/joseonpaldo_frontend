import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import RockPaperScissors from './RockPaperScissors';
import CardUpDown from './CardUpDown';
import Bomb from './Bomb';
import AlienShooter from './AlienShooter';
import Modal from './Modal';
import './GameSelector.css'; // Import the new CSS file for styling

const data = [
  { option: 'Rock Paper Scissors', style: { backgroundColor: 'green', textColor: 'black' } },
  { option: 'Card Up Down', style: { backgroundColor: 'white', textColor: 'black' } },
  { option: 'Bomb Defuse', style: { backgroundColor: 'blue', textColor: 'black' } },
  { option: 'Alien Shooter', style: { backgroundColor: 'purple', textColor: 'black' } }
];

const GameSelector = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedGame, setSelectedGame] = useState(null);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const closeModal = () => {
    setSelectedGame(null);
  };

  return (
    <div className="game-selector">
      <h1 className="title">Pick Your Game</h1>
      {!selectedGame && (
        <div className="wheel-container">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={() => {
              setMustSpin(false);
              setSelectedGame(data[prizeNumber].option);
            }}
          />
          <button className="spin-button" onClick={handleSpinClick}>SPIN</button>
          <button className="direct-button" onClick={() => setSelectedGame('Alien Shooter')}>배 싸움</button>
          <button className="direct-button" onClick={() => setSelectedGame('Bomb Defuse')}>폭탄 해제하기</button>
          <button className="direct-button" onClick={() => setSelectedGame('Card Up Down')}>업다운</button>
        </div>
      )}
      {selectedGame && (
        <Modal onClose={closeModal}>
          {selectedGame === 'Rock Paper Scissors' && <RockPaperScissors />}
          {selectedGame === 'Card Up Down' && <CardUpDown />}
          {selectedGame === 'Bomb Defuse' && <Bomb />}
          {selectedGame === 'Alien Shooter' && <AlienShooter />}
        </Modal>
      )}
    </div>
  );
};

export default GameSelector;
