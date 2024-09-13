import React, { useState, useEffect } from 'react';
import './css/RockPaperScissors.css'; // Custom styles for the game

const RockPaperScissors = ({ socket }) => {
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
        setPlayerChoice(pchoice);
        setComputerChoice(cchoice);
        setGameState(state);
      });

      socket.on('rpsTimeLeft', (time) => {
        setTimeLeft(time);
      });
    }
  }, [socket]);

  useEffect(() => {
    if(isGameOver) {
      if(gameState.playerScore > gameState.computerScore) {
        setMsg('You Win the Game!');
      }else if(gameState.playerScore < gameState.computerScore) {
        setMsg('You Lose the Game!');
      }
    }
  }, [isGameOver]);

  const playGame = (choice) => {
    socket.emit('rpsPlayerChoice', choice);
  }

  // // Timer logic for each round
  // useEffect(() => {
  //   if (gameOver || timeLeft === 0) return;

  //   const timer = setInterval(() => {
  //     setTimeLeft((prevTimeLeft) => {
  //       if (prevTimeLeft > 0) {
  //         socket.emit('rpsTimeLeft', prevTimeLeft - 1); // Emit timeLeft to the server
  //         return prevTimeLeft - 1;
  //       } else {
  //         playGame(null); // Auto-play if the player doesn't choose
  //         clearInterval(timer);
  //         return 0;
  //       }
  //     });
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [timeLeft, gameOver, socket]);

  // const playGame = (choice) => {
  //   if (gameOver || round > 3) return;

  //   setPlayerChoice(choice);
  //   socket.emit('rpsPlayerChoice', choice);

  //   const computerChoice = choices[Math.floor(Math.random() * 3)];
  //   setComputerChoice(computerChoice);
  //   socket.emit('rpsComputerChoice', computerChoice);

  //   let outcome;
  //   if (choice === computerChoice) {
  //     outcome = 'Draw';
  //     setResult(outcome);
  //     socket.emit('rpsResult', outcome);

  //     // If it's a draw, reset the round without incrementing the round number
  //     setTimeLeft(3); // Reset the timer
  //     return; // Exit early since we don't want to change the round or scores
  //   } else if (
  //     (choice === '바위' && computerChoice === '가위') ||
  //     (choice === '보' && computerChoice === '바위') ||
  //     (choice === '가위' && computerChoice === '보')
  //   ) {
  //     outcome = 'You Win';
  //     setPlayerScore(playerScore + 1);
  //     socket.emit('rpsScore', { playerScore: playerScore + 1, computerScore });
  //   } else {
  //     outcome = 'You Lose';
  //     setComputerScore(computerScore + 1);
  //     socket.emit('rpsScore', { playerScore, computerScore: computerScore + 1 });
  //   }

  //   setResult(outcome);
  //   socket.emit('rpsResult', outcome);

  //   // Check if game is over (after 3 non-draw rounds)
  //   if (round === 3) {
  //     setGameOver(true);

  //     // Determine final result
  //     let finalOutcome;
  //     if (playerScore > computerScore) {
  //       finalOutcome = 'You Win the Game!';
  //     } else if (playerScore < computerScore) {
  //       finalOutcome = 'You Lose the Game!';
  //     } else {
  //       finalOutcome = 'The Game is a Draw!';
  //     }

  //     // Send final result to the server
  //     socket.emit('rpsFinalResult', finalOutcome);

  //     // Trigger alert with final result
  //     alert(finalOutcome);
  //   } else {
  //     setRound(round + 1);
  //     socket.emit('round', round);
  //     setTimeLeft(3); // Reset the timer for the next round
  //   }

  //   setAnimateResult(true);
  //   setTimeout(() => setAnimateResult(false), 1000);
  // };

  // Utility to get the correct image for the choices
  const getImage = (choice) => {
    switch (choice) {
      case '바위':
        return '/mg/rock.png';
      case '보':
        return '/mg/paper.png';
      case '가위':
        return '/mg/scissor.png';
      default:
        return '';
    }
  };

  return (
    <>
    {gameState && (
      <div className="game-wrapper">
        <h2>Rock Paper Scissors - Round {round}</h2>
        <div>Player Score: {gameState.playerScore} | Computer Score: {gameState.computerScore}</div>

        {/* Timer Box Animation */}
        <div className="timer-box">
          <div
            className="timer-fill"
            style={{ width: `${(timeLeft / 3) * 100}%` }} // Shrinking towards center
          />
        </div>
        <div className="choices-container">
          {choices.map((choice) => (
            <button
              key={choice}
              className={`choice ${playerChoice === choice ? 'selected' : ''}`}
              onClick={() => playGame(choice)}
            >
              {choice}
            </button>
          ))}
        </div>
        {playerChoice && (
          <div>
            <div className="hands">
              <div className={`hand ${result === 'You Win' ? 'jump' : ''}`}>
                <p>Your choice:</p>
                <img src={getImage(playerChoice)} alt={playerChoice} />
              </div>
              <div className={`hand ${result === 'You Lose' ? 'jump' : ''}`}>
                <p>Computer's choice:</p>
                <img src={getImage(computerChoice)} alt={computerChoice} />
              </div>
            </div>
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
        )}
      </div>
    )}
    </>
  );
};

export default RockPaperScissors;
