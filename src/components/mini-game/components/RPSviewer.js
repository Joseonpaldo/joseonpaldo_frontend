import React, { useState, useEffect } from 'react';
import './css/RockPaperScissorsViewer.css'; // Add custom styles here

const RPSviewer = ({ socket }) => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [round, setRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3); // Timer starts at 3 seconds

  useEffect(() => {
    // Listen for player choice from the server
    socket.on('rpsPlayerChoice', (choice) => {
      setPlayerChoice(choice);
    });

    // Listen for computer choice from the server
    socket.on('rpsComputerChoice', (choice) => {
      setComputerChoice(choice);
    });

    // Listen for game result from the server
    socket.on('rpsResult', (outcome) => {
      setResult(outcome);
      setAnimateResult(true);
      setTimeout(() => setAnimateResult(false), 1000);
    });

    // Listen for updated scores from the server
    socket.on('rpsScore', ({ playerScore, computerScore }) => {
      setPlayerScore(playerScore);
      setComputerScore(computerScore);
    });

    // Listen for the current round number from the server
    socket.on('rpsRound', (round) => {
      setRound(round);
      if (round > 3) {
        setGameOver(true);
      }
    });

    // Listen for time updates from the server
    socket.on('rpsTimeLeft', (time) => {
      setTimeLeft(time); // Sync timer with host
    });

    // Clean up the event listeners when the component unmounts
    return () => {
      socket.off('rpsPlayerChoice');
      socket.off('rpsComputerChoice');
      socket.off('rpsResult');
      socket.off('rpsScore');
      socket.off('rpsRound');
      socket.off('rpsTimeLeft');
    };
  }, [socket]);

  // Utility function to get image based on the choice
  const getImage = (choice) => {
    switch (choice) {
      case '바위':
        return process.env.PUBLIC_URL + '/mg/rock.png'; // Ensure images are in the public folder
      case '보':
        return process.env.PUBLIC_URL + '/mg/paper.png';
      case '가위':
        return process.env.PUBLIC_URL + '/mg/scissor.png';
      default:
        return '';
    }
  };

  return (
    <div className="game-wrapper">
      <h2>Rock Paper Scissors - Viewer - Round {round}</h2>
      <div className="scoreboard">
        Player Score: {playerScore} | Computer Score: {computerScore}
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
        <div className={`hand ${result === 'You Win' ? 'jump' : ''}`}>
          <p>Player's choice:</p>
          <img src={getImage(playerChoice)} alt={playerChoice} />
        </div>
        <div className={`hand ${result === 'You Lose' ? 'jump' : ''}`}>
          <p>Computer's choice:</p>
          <img src={getImage(computerChoice)} alt={computerChoice} />
        </div>
      </div>

      <h3 className={`result ${animateResult ? 'fadeIn' : ''}`}>{result}</h3>
      {gameOver && (
        <h3>
          {playerScore > computerScore
            ? 'Player Wins the Game!'
            : playerScore < computerScore
            ? 'Computer Wins the Game!'
            : 'The Game is a Draw!'}
        </h3>
      )}
    </div>
  );
};

export default RPSviewer;
