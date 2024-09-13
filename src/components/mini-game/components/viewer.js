import React, { useState, useEffect } from 'react';
import './css/Game.css'; // Ensure your CSS file is set up

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;
const BALL_SIZE = 50;
const ZOOM_LEVEL = 2;  // Adjust zoom level

const Viewer = ({ socket }) => {
    const [player, setPlayer] = useState({});
    const [platforms, setPlatforms] = useState([]);
    const [ladders, setLadders] = useState([]);
    const [rockets, setRockets] = useState([]);
    const [balls, setBalls] = useState([]);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isGameOver, setIsGameOver] = useState(false);
    const [portal, setPortal] = useState({});  // Portal state
    const [winMessage, setWinMessage] = useState(''); // Store win/loss messages

    // Receive initial game state and updates
    useEffect(() => {
        socket.on('initialGameState', (initialState) => {
            setPlayer(initialState.player);
            setPlatforms(initialState.platforms || []);
            setLadders(initialState.ladders || []);
            setRockets(initialState.rockets || []);
            setBalls(initialState.balls || []);
            setPortal(initialState.portal || {});
            setTimeLeft(initialState.timeLeft || 60);
            setIsGameOver(initialState.isGameOver || false);
        });

        socket.on('gameStateUpdate', (updatedState) => {
            setPlayer(updatedState.player);
            setPlatforms(updatedState.platforms || []);
            setLadders(updatedState.ladders || []);
            setRockets(updatedState.rockets || []);
            setBalls(updatedState.balls || []);
            setPortal(updatedState.portal || {});
            setTimeLeft(updatedState.timeLeft || 60);
            setIsGameOver(updatedState.isGameOver || false);
        });

        // Listen for game win and game over events
        socket.on('gameWin', (data) => {
            setWinMessage(data.message);
            setIsGameOver(true);
        });

        socket.on('gameOver', (data) => {
            setWinMessage(data.message || 'Game Over!'); // Default message if none is provided
            setIsGameOver(true);
        });
    }, [socket]);

    useEffect(() => {
        if (isGameOver) {
            // Game Over Logic Here(If needed)
        }
    }, [isGameOver]);

    const gameContainerStyle = {
        transform: `scale(${ZOOM_LEVEL})`,
        transformOrigin: `${player.x + PLAYER_WIDTH / 2}px ${player.y + PLAYER_HEIGHT / 2}px`,
        transition: 'transform 0.1s ease-out',
    };

    if (isGameOver) {
        return <div className="game-over">{winMessage}</div>; // Display win or game over message
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="game" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
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
