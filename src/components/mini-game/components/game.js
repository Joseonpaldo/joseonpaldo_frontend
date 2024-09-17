import React, { useState, useEffect } from 'react';
import './css/Game.css'; // Ensure your CSS file is set up

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;
const BALL_SIZE = 50;  // Define BALL_SIZE here
const ZOOM_LEVEL = 2;  // Adjust zoom level (based on your original requirement)

const Game = ({ socket, image }) => {
    const [player, setPlayer] = useState({});
    const [platforms, setPlatforms] = useState([]);
    const [ladders, setLadders] = useState([]);
    const [rockets, setRockets] = useState([]);
    const [balls, setBalls] = useState([]);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isGameOver, setIsGameOver] = useState(false);
    const [win, setWin] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [portal, setPortal] = useState({}); // Ensure portal is initialized correctly
    const [winMessage, setWinMessage] = useState(''); // Store win/loss messages

    // Listen to socket events for initial game state and updates
    useEffect(() => {
        socket.on('initialGameState', (initialState) => {
            setPlayer(initialState.player);
            setPlatforms(initialState.platforms);  // Set platforms from server
            setLadders(initialState.ladders);      // Set ladders from server
            setRockets(initialState.rockets);      // Set rockets from server
            setBalls(initialState.balls);     
            setPortal(initialState.portal);         // Set portal from server
            setTimeLeft(initialState.timeLeft);
            setIsGameOver(initialState.isGameOver);
        });

        socket.on('requestImageForViewer', () => {
            socket.emit('playerImage', image);
        });

        socket.on('gameStateUpdate', (updatedState) => {
            setPlayer(updatedState.player);
            setPlatforms(updatedState.platforms);  // Update platforms
            setLadders(updatedState.ladders);      // Update ladders
            setRockets(updatedState.rockets);      // Update rockets
            setBalls(updatedState.balls);
            setPortal(updatedState.portal);           // Update portal
            setTimeLeft(updatedState.timeLeft);
            setIsGameOver(updatedState.isGameOver);
        });

        // Listen for game win and game over events
        socket.on('gameWin', (data) => {
            setWinMessage(data.message);
            setWin(true);
            setIsGameOver(true);
        });

        socket.on('gameOver', (data) => {
            setWinMessage(data.message || 'Game Over!'); // Default message if none is provided
            setWin(false);
            setIsGameOver(true);
        });

        return () => {
            socket.off('initialGameState');
            socket.off('gameStateUpdate');
            socket.off('gameWin');
            socket.off('gameOver');
        }
    }, [socket]);

    useEffect(() => {
        if(gameStarted) {
            socket.emit('platformerStart'); // Notify server that the game has started
        }
    }, [socket, gameStarted]);

    // Handle keyboard input for player movements
    const handleKeyDown = (e) => {
        if(gameStarted) {
        const key = e.key;
            socket.emit('playerInput', key);  // Send key input to server
            console.log('playerInput', key);  // Log key input for debugging
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameStarted]);

    // If the game is over, display the game over message
    if (isGameOver) {
        return <div className="game-over">{winMessage}</div>;
    }

    // Zoom based on the player's position
    const gameContainerStyle = {
        transform: `scale(${ZOOM_LEVEL})`,
        transformOrigin: `${player.x + PLAYER_WIDTH / 2}px ${player.y + PLAYER_HEIGHT / 2}px`,
        transition: 'transform 0.1s ease-out',
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={() => setGameStarted(false)}>X</button>
                <div className="game" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
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
                                className={`player ${player?.isFlashing ? 'flashing' : ''} ${player?.direction === -1 ? 'left' : 'right'}`}
                                style={{ 
                                    left: player?.x, 
                                    top: player?.y,
                                    backgroundImage: `url(${image ? image : '/mg/Mokoko.png'})`,
                                }}
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
                            {portal && (
                                <div className="portal" style={{ left: portal.x, top: portal.y, width: portal.width, height: portal.height }} />
                            )}
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
