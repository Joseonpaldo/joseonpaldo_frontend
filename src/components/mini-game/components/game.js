import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Game.css';

const GRAVITY = 0.2;
const JUMP_STRENGTH = 6;
const KNOCKBACK = 50;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;
const BALL_SIZE = 50;
const BALL_MOVE_AMOUNT = 100; // Updated to 100 pixels
const ZOOM_LEVEL = 2;

const Game = ({ socket, gameType }) => {
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
        { x: 850, y: 650 },
        { x: 400, y: 450 },
        { x: 400, y: 250 },
        { x: 800, y: 250 },
        { x: 600, y: 250 },
    ]);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [role, setRole] = useState(null);

    const [platforms] = useState([
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
    ]);

    const [ladders] = useState([
        { x: 1000, y: 500, height: 200 },
        { x: 0, y: 300, height: 200 },
    ]);

    const [portal] = useState({ x: 1110, y: 200, width: 10, height: 60 });

    const gameRef = useRef(null);

    const handleKeyDown = useCallback((e) => {
        e.preventDefault();
        setPlayer((prev) => {
            if (!prev || prev.isImmune) return prev;

            let isWalking = false;

            switch (e.key) {
                case 'ArrowUp':
                case 'ArrowDown':
                    return prev;
                case 'ArrowLeft':
                    isWalking = true;
                    const newPosLeft = { ...prev, x: prev.x - 10, direction: -1, isWalking };
                    socket.emit('playerPosition', newPosLeft);
                    return newPosLeft;
                case 'ArrowRight':
                    isWalking = true;
                    const newPosRight = { ...prev, x: prev.x + 10, direction: 1, isWalking };
                    socket.emit('playerPosition', newPosRight);
                    return newPosRight;
                case ' ':
                    if (!prev.isJumping) {
                        const jumpPos = { ...prev, velY: -JUMP_STRENGTH, isJumping: true, isWalking };
                        socket.emit('playerPosition', jumpPos);
                        return jumpPos;
                    }
                    break;
                case 'g':
                    if (prev.onLadder) {
                        let targetY;
                        ladders.forEach((ladder) => {
                            if (
                                prev.x + PLAYER_WIDTH > ladder.x &&
                                prev.x < ladder.x + 20 &&
                                prev.y + PLAYER_HEIGHT > ladder.y &&
                                prev.y < ladder.y + ladder.height
                            ) {
                                targetY = ladder.y - PLAYER_HEIGHT;
                            }
                        });
                        if (targetY !== undefined) {
                            const ladderPos = { ...prev, y: targetY, velY: 0, onLadder: false };
                            socket.emit('playerPosition', ladderPos);
                            return ladderPos;
                        }
                    }
                    break;
                default:
                    return prev;
            }
            return { ...prev, isWalking };
        });
    }, [ladders, socket]);

    const handleKeyUp = useCallback((e) => {
        e.preventDefault();
        setPlayer((prev) => {
            if (!prev) return prev;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const stopWalkingPos = { ...prev, isWalking: false };
                socket.emit('playerPosition', stopWalkingPos);
                return stopWalkingPos;
            }
            return prev;
        });
    }, [socket]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    useEffect(() => {
        socket.emit('joinGame', gameType);

        socket.on('role', (assignedRole) => {
            setRole(assignedRole);
            if (assignedRole === 'host') {
                socket.emit('setInitialGameState', {
                    player,
                    rockets,
                    balls,
                    timeLeft,
                    isGameOver
                });
            }
        });

        socket.on('initialGameState', (initialState) => {
            setPlayer(initialState.player || {});
            setRockets(initialState.rockets || []);
            setBalls(initialState.balls || []);
            setTimeLeft(initialState.timeLeft || 60);
            setIsGameOver(initialState.isGameOver || false);
        });

        // Update timer and ball positions based on server-sent time
        socket.on('updateTimer', (newTime) => {
            setTimeLeft(newTime);

            // Update ball positions based on the time left being even or odd
            setBalls((prevBalls) =>
                prevBalls.map((ball) => {
                    const shouldMoveUp = newTime % 2 === 0;
                    return {
                        ...ball,
                        y: shouldMoveUp
                            ? ball.y + BALL_MOVE_AMOUNT
                            : ball.y - BALL_MOVE_AMOUNT,
                    };
                })
            );
        });

        socket.on('playerPosition', (newPlayerState) => {
            setPlayer(newPlayerState);
        });

    }, [role, gameType, socket]);

    useEffect(() => {
        if (!gameStarted) return;

        const handleUpdateRockets = () => {
            setRockets((prev) => [
                ...prev,
                { x: GAME_WIDTH, y: 230, direction: 'left' },
                { x: 0, y: 260, direction: 'right' },
                { x: 0, y: 390, direction: 'right' },
                { x: GAME_WIDTH, y: 450, direction: 'left' },
                { x: GAME_WIDTH, y: 680, direction: 'left' },
                { x: 0, y: 600, direction: 'right' }
            ]);
        };

        socket.on('updateRockets', handleUpdateRockets);

        return () => {
            socket.off('updateRockets', handleUpdateRockets);
        };
    }, [gameStarted, socket]);

    useEffect(() => {
        const gameInterval = setInterval(() => {
            // Update rocket positions
            setRockets((prevRockets) =>
                prevRockets.map((rocket) => ({
                    ...rocket,
                    x: rocket.direction === 'left' ? rocket.x - 2.3 : rocket.x + 2.3,
                })).filter(rocket => rocket.x > 0 && rocket.x < GAME_WIDTH)
            );

            // Update player, platform, and other game logic here as needed...
            setPlayer((prev) => {
                if (!prev) return prev;

                let newY = prev.y + prev.velY;
                let newVelY = prev.velY + GRAVITY;
                let isJumping = prev.isJumping;

                let newX = prev.x;
                if (prev.isJumping) {
                    newX = prev.x + 2 * prev.direction;
                }

                // Collision with platforms
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

                // Collision with ladders
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

                const updatedPlayer = { 
                    ...prev, 
                    x: newX, 
                    y: newY, 
                    velY: newVelY, 
                    isJumping, 
                    onLadder, 
                    isOnPlatform, 
                    isWalking: false 
                };

                socket.emit('playerPosition', updatedPlayer);

                return updatedPlayer;
            });

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
    }, [gameStarted, rockets, platforms, portal, ladders, balls, player, socket]);

    useEffect(() => {
        if (timeLeft === 0) {
            setIsGameOver(true);
            alert('Game Over!');
        }
    }, [timeLeft]);

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
                <button className="close-button" onClick={() => setGameStarted(false)}>X</button>
                <div className="game" ref={gameRef} style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
                    <div className="timer">Time Left: {timeLeft}</div>
                    {!gameStarted && (
                        <button 
                            onClick={() => setGameStarted(true)}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100vh",
                                width: "100%",
                                border: "white",
                                background: "none",
                                cursor: "pointer",
                                color: "red"
                            }}
                        >
                            Start Game
                        </button>
                    )}
                    {gameStarted && (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game;
