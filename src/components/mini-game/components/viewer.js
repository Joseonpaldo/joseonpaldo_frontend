import React, { useState, useEffect, useRef, useMemo } from 'react';
import './Game.css';

const GRAVITY = 0.2;
const KNOCKBACK = 30;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;
const BALL_SIZE = 50;
const BALL_JUMP_HEIGHT = 150;
const ZOOM_LEVEL = 2;

const Viewer = ({ socket }) => {
  const [player, setPlayer] = useState({
    x: 0,
    y: 600,
    velY: 0,
    isJumping: false,
    onLadder: false,
    direction: 0,
    isImmune: false,
    isFlashing: false,
    isWalking: false,
  });
  const [rockets, setRockets] = useState([]);
  const [balls, setBalls] = useState([
    { x: 850, y: 650, initialY: 650, velY: -1.5 },
    { x: 400, y: 450, initialY: 450, velY: -1.5 },
    { x: 400, y: 250, initialY: 250, velY: -1.5 },
    { x: 800, y: 250, initialY: 250, velY: -1 },
    { x: 600, y: 250, initialY: 250, velY: -0.5 },
  ]);
  const [timeLeft, setTimeLeft] = useState(null);  // Initially null, will be set on receiving initial game state
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Use useMemo to prevent re-initialization of static arrays and objects
  const platforms = useMemo(() => [
    { x: 0, y: 700, width: 300, height: 20 },
    { x: 400, y: 700, width: 300, height: 20 },
    { x: 800, y: 700, width: 300, height: 20 },
    { x: 0, y: 500, width: 100, height: 20 },
    { x: 150, y: 500, width: 70, height: 20 },
    { x: 300, y: 500, width: 200, height: 20 },
    { x: 400, y: 500, width: 100, height: 20 },
    { x: 600, y: 500, width: 100, height: 20 },
    { x: 800, y: 500, width: 100, height: 20 },
    { x: 1000, y: 500, width: 100, height: 20 },
    { x: 0, y: 300, width: 100, height: 20 },
    { x: 170, y: 300, width: 100, height: 20 },
    { x: 350, y: 300, width: 130, height: 20 },
    { x: 400, y: 300, width: 50, height: 20 },
    { x: 600, y: 300, width: 100, height: 20 },
    { x: 800, y: 300, width: 50, height: 20 },
    { x: 900, y: 280, width: 50, height: 20 },
    { x: 1000, y: 250, width: 100, height: 20 },
  ], []);

  const ladders = useMemo(() => [
    { x: 1000, y: 500, height: 200 },
    { x: 0, y: 300, height: 200 },
  ], []);

  const portal = useMemo(() => ({ x: 1110, y: 200, width: 10, height: 60 }), []);

  const gameRef = useRef(null);

  useEffect(() => {
    console.log('Viewer connecting to WebSocket server...');

    // Request the initial game state
    socket.emit('requestInitialGameState');

    socket.on('initialGameState', (initialState) => {
      console.log('Received initial game state:', initialState);
      setPlayer(initialState.player || {});
      setRockets(initialState.rockets || []);
      setBalls(initialState.balls || []);
      setTimeLeft(initialState.timeLeft || 60);
      setIsGameOver(initialState.isGameOver || false);
      setGameStarted(true);  // Start the game when initial state is received
    });

    socket.on('playerPosition', (newPlayerState) => {
      console.log('Received player position:', newPlayerState);
      setPlayer(newPlayerState);
    });

    return () => {
      console.log('Viewer disconnecting from WebSocket server...');
      socket.off('initialGameState');
      socket.off('playerPosition');
    };
  }, [socket]);

  useEffect(() => {
    if (!gameStarted || timeLeft === null) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameStarted, timeLeft]);

  useEffect(() => {
    if (!gameStarted) return;

    const rocketInterval = setInterval(() => {
      setRockets((prev) => [
        ...prev,
        { x: GAME_WIDTH, y: 230, direction: 'left' },
        { x: 0, y: 260, direction: 'right' },
        { x: 0, y: 390, direction: 'right' },
        { x: GAME_WIDTH, y: 450, direction: 'left' },
        { x: GAME_WIDTH, y: 680, direction: 'left' },
        { x: 0, y: 600, direction: 'right' }
      ]);
    }, 5000);

    return () => clearInterval(rocketInterval);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameInterval = setInterval(() => {
      setPlayer((prev) => {
        if (!prev) return prev;

        let newY = prev.y + prev.velY;
        let newVelY = prev.velY + GRAVITY;
        let isJumping = prev.isJumping;

        let newX = prev.x;
        if (prev.isJumping) {
          newX = prev.x + 1 * prev.direction;
        }

        let isOnPlatform = false;
        platforms.forEach((platform) => {
          if (
            newY + PLAYER_HEIGHT > platform.y &&
            prev.y + PLAYER_HEIGHT <= platform.y &&
            newX + PLAYER_WIDTH > platform.x &&
            newX < platform.x + platform.width
          ) {
            newY = platform.y - PLAYER_HEIGHT;
            newVelY = 0;
            isJumping = false;
            isOnPlatform = true;
          }
        });

        if (newY + PLAYER_HEIGHT > GAME_HEIGHT) {
          setIsGameOver(true);
        }

        let onLadder = false;
        ladders.forEach((ladder) => {
          if (
            prev.x + PLAYER_WIDTH > ladder.x &&
            prev.x < ladder.x + 20 &&
            prev.y + PLAYER_HEIGHT > ladder.y &&
            prev.y < ladder.y + ladder.height
          ) {
            onLadder = true;
          }
        });

        return { 
          ...prev, 
          x: newX, 
          y: newY, 
          velY: newVelY, 
          isJumping, 
          onLadder, 
          isOnPlatform, 
          isWalking: false 
        };
      });

      setRockets((prev) => prev.map((rocket) => ({
        ...rocket,
        x: rocket.x + (rocket.direction === 'left' ? -3 : 3),
      })).filter(rocket => rocket.x > 0 && rocket.x < GAME_WIDTH));

      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let newY = ball.y + ball.velY;
          if (newY <= ball.initialY - BALL_JUMP_HEIGHT || newY >= ball.initialY) {
            return { ...ball, y: newY, velY: -ball.velY };
          }
          return { ...ball, y: newY };
        })
      );

      setPlayer((prev) => {
        if (!prev || prev.isImmune) return prev;

        let newX = prev.x;
        let newY = prev.y;
        let knockedBack = false;

        rockets.forEach((rocket) => {
          if (
            prev.x < rocket.x + 20 &&
            prev.x + PLAYER_WIDTH > rocket.x &&
            prev.y < rocket.y + 20 &&
            prev.y + PLAYER_HEIGHT > rocket.y
          ) {
            newX += rocket.direction === 'left' ? -KNOCKBACK : KNOCKBACK;
            knockedBack = true;
          }
        });

        balls.forEach((ball) => {
          if (
            prev.x < ball.x + BALL_SIZE &&
            prev.x + PLAYER_WIDTH > ball.x &&
            prev.y < ball.y + BALL_SIZE &&
            prev.y + PLAYER_HEIGHT > ball.y
          ) {
            newX += ball.velY > 0 ? KNOCKBACK : -KNOCKBACK;
            knockedBack = true;
          }
        });

        if (knockedBack) {
          setPlayer(prev => ({
            ...prev,
            isImmune: true,
            isFlashing: true,
            velY: 0,
          }));

          setTimeout(() => {
            setPlayer(prev => ({
              ...prev,
              isImmune: false,
              isFlashing: false,
            }));
          }, 1000);
        }

        return { ...prev, x: newX, y: newY };
      });

      setPlayer((prev) => {
        if (!prev) return prev;
        if (
          prev.x < portal.x + portal.width &&
          prev.x + PLAYER_WIDTH > portal.x &&
          prev.y < portal.y + portal.height &&
          prev.y + PLAYER_HEIGHT > portal.y
        ) {
          setIsGameOver(true);
          alert('You Win!');
        }
        return prev;
      });

    }, 1000 / 144);

    return () => clearInterval(gameInterval);
  }, [gameStarted, rockets, platforms, portal, ladders, balls]);

  const gameContainerStyle = {
    transform: `scale(${ZOOM_LEVEL})`,
    transformOrigin: `${player.x + PLAYER_WIDTH / 2}px ${player.y + PLAYER_HEIGHT / 2}px`,
    transition: 'transform 0.1s ease-out',
  };

  if (isGameOver) {
    return <div className="game-over">Game Over</div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="game" ref={gameRef} style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
          <div className="timer">Time Left: {timeLeft}</div>
          <div className="viewport" style={gameContainerStyle}>
            <div
              className={`player ${player?.isFlashing ? 'flashing' : ''} ${player?.isWalking ? 'moving' : 'still'} ${player?.direction === -1 ? 'left' : 'right'}`}
              style={{ left: player?.x, top: player?.y }}
            />
            {rockets.map((rocket, index) => (
              <div key={index} className="rocket" style={{ left: rocket.x, top: rocket.y }} />
            ))}
            {platforms.map((platform, index) => (
              <div key={index} className="platform" style={{ left: platform.x, top: platform.y, width: platform.width, height: platform.height }} />
            ))}
            {ladders.map((ladder, index) => (
              <div key={index} className="ladder" style={{ left: ladder.x, top: ladder.y, height: ladder.height }} />
            ))}
            <div className="portal" style={{ left: portal.x, top: portal.y, width: portal.width, height: portal.height }} />
            {balls.map((ball, index) => (
              <div key={index} className="ball" style={{ left: ball.x, top: ball.y, width: BALL_SIZE, height: BALL_SIZE }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;