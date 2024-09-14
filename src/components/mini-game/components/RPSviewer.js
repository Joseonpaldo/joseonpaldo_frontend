import React, { useState, useEffect } from 'react';
import './css/RockPaperScissorsViewer.css'; // Add custom styles here

const RPSviewer = ({ socket }) => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [animateResult, setAnimateResult] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3); // Timer starts at 3 seconds
  const [msg, setMsg] = useState('');

  const [gameState, setGameState] = useState();

  const choices = ['바위', '보', '가위']; // Rock, Paper, Scissors in Korean

  useEffect(() => {
    if(socket) {
      socket.on('rpsState', (pchoice, cchoice, state) => {
        console.log('received game state');
        console.log(JSON.stringify(state));
        setPlayerChoice(pchoice);
        setComputerChoice(cchoice);
        setGameState(state);

        if(state.isGameOver) {
          setIsGameOver(true);
        }
      });

      socket.on('rpsTimeLeft', (time) => {
        setTimeLeft(time);
      });
    }
  }, [socket]);

  // Utility function to get image based on the choice
  const getImage = (choice) => {
    switch (choice) {
      case '바위':
        return '/mg/rock.png'; // Ensure images are in the public folder
      case '보':
        return '/mg/paper.png';
      case '가위':
        return '/mg/scissor.png';
      default:
        return '';
    }
  };

  return (
    (gameState === undefined) ? <div>Loading...</div> :
    <div className="game-wrapper">
      <h2>Rock Paper Scissors - Viewer - Round {gameState.round}</h2>
      <div className="scoreboard">
        Player Score: {gameState.playerScore} | Computer Score: {gameState.computerScore}
      </div>

      {/* Timer Box for Viewer */}
      <div className="timer-box">
        <div
          className="timer-fill"
          style={{ width: `${(timeLeft / 3) * 100}%` }} // Shrinking towards center
        />
      </div>

      {/* Adding choices-container for consistent layout */}
      <div className="choices-container">
        <div className={`hand ${gameState.win === 'You Win' ? 'jump' : ''}`}>
          <p>Player's choice:</p>
          <img src={getImage(playerChoice)} alt={playerChoice} />
        </div>
        <div className={`hand ${gameState.win === 'You Lose' ? 'jump' : ''}`}>
          <p>Computer's choice:</p>
          <img src={getImage(computerChoice)} alt={computerChoice} />
        </div>
      </div>

      <h3 className={`result ${animateResult ? 'fadeIn' : ''}`}>{gameState.win}</h3>
      <h3 className={`result ${animateResult ? 'fadeIn' : ''}`}>
              {  
                gameState.win === 1 ? "win" : 
                gameState.win === 2 ? "lose" :
                gameState.win === 0 ? "draw" : ""
              }
            </h3>
            {isGameOver && (
              <h3>
                { msg }
              </h3>
            )}
    </div>
  );
};

export default RPSviewer;
