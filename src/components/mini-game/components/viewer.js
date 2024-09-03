import React, { useState, useEffect, useMemo } from 'react';
import './Game.css';

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;
const BALL_SIZE = 50;
const ZOOM_LEVEL = 2;
const BALL_MOVE_AMOUNT = 100; // Updated to 100 pixels


const Viewer = ({ socket }) => {
    const [player, setPlayer] = useState({
        x: 0,
        y: 600,
        direction: 0,
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
    const [timeLeft, setTimeLeft] = useState(null);
    const [isGameOver, setIsGameOver] = useState(false);
    

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

    useEffect(() => {
        console.log('Viewer connecting to WebSocket server...');

        socket.emit('joinGame', 'platformer');

       
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

        socket.on('updateRockets', () => {
            setRockets([
                { x: GAME_WIDTH, y: 230, direction: 'left' },
                { x: 0, y: 260, direction: 'right' },
                { x: 0, y: 390, direction: 'right' },
                { x: GAME_WIDTH, y: 450, direction: 'left' },
                { x: GAME_WIDTH, y: 680, direction: 'left' },
                { x: 0, y: 600, direction: 'right' }
            ]);
        });

        socket.on('playerPosition', (newPlayerState) => {
            console.log('Received player position:', newPlayerState);
            setPlayer(newPlayerState);
        });

        return () => {
            console.log('Viewer disconnecting from WebSocket server...');
            socket.off('initialGameState');
            socket.off('updateTimer');
            socket.off('updateRockets');
            socket.off('playerPosition');
        };
    }, [socket]);


    useEffect(() => {
        const gameInterval = setInterval(() => {
            // Update rocket positions
            setRockets((prevRockets) =>
                prevRockets.map((rocket) => ({
                    ...rocket,
                    x: rocket.direction === 'left' ? rocket.x - 2.3 : rocket.x + 2.3,
                })).filter(rocket => rocket.x > 0 && rocket.x < GAME_WIDTH)
            );


            

            // Check if player reached the portal
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

        }, 1000 / 144); // Run at 144 FPS

        return () => clearInterval(gameInterval);
    }, [ rockets, platforms, portal, ladders, balls, player]);

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
                <div className="game" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
                    <div className="timer">Viewer Time Left: {timeLeft}</div>
                    <div className="viewport" style={gameContainerStyle}>
                        <div
                            className={`player ${player?.isFlashing ? 'flashing' : ''} ${player?.isWalking ? 'moving' : 'still'} ${player?.direction === -1 ? 'left' : 'right'}`}
                            style={{ left: player?.x, top: player?.y }}
                        />
                        {(rockets || []).map((rocket, index) => (
                            <div key={index} className="rocket" style={{ left: rocket.x, top: rocket.y }} />
                        ))}
                        {platforms.map((platform, index) => (
                            <div key={index} className="platform" style={{ left: platform.x, top: platform.y, width: platform.width, height: platform.height }} />
                        ))}
                        {ladders.map((ladder, index) => (
                            <div key={index} className="ladder" style={{ left: ladder.x, top: ladder.y, height: ladder.height }} />
                        ))}
                        <div className="portal" style={{ left: portal.x, top: portal.y, width: portal.width, height: portal.height }} />
                        {(balls || []).map((ball, index) => (
                            <div key={index} className="ball" style={{ left: ball.x, top: ball.y, width: BALL_SIZE, height: BALL_SIZE }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Viewer;
