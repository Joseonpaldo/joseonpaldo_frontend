import React, { useState, useEffect } from 'react';
import './css/AlienShooter.css';

const AlienViewer = ({ socket }) => {
  const [aliens, setAliens] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [spaceshipPosition, setSpaceshipPosition] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100);
  const [shotsLeft, setShotsLeft] = useState(10);
  const [reloading, setReloading] = useState(false);
  const [specialEntities, setSpecialEntities] = useState([]);

  useEffect(() => {
    console.log('Viewer connecting to WebSocket server...');

    // Request the initial game state
    socket.emit('requestInitialGameState');

    // Listen for the initial game state from the server
    socket.on('initialGameState', (initialState) => {
      console.log('Received initial game state:', initialState);
      setAliens(initialState.aliens);
      setBullets(initialState.bullets);
      setSpaceshipPosition(initialState.spaceshipPosition);
      setGameOver(initialState.gameOver);
      setTimeLeft(initialState.timeLeft);
      setShotsLeft(initialState.shotsLeft);
      setReloading(initialState.reloading);
      setSpecialEntities(initialState.specialEntities);
    });

    // Listen for partial game state updates
    socket.on('updateGameState', (partialState) => {
      console.log('Received partial game state:', partialState);
      setGameOver(partialState.gameOver);
      setTimeLeft(partialState.timeLeft);
      setShotsLeft(partialState.shotsLeft);
      setReloading(partialState.reloading);
      // We deliberately do not update spaceshipPosition here to avoid overwriting
    });

    // Listen for spaceship position updates separately
    socket.on('spaceshipPosition', (newPosition) => {
      console.log('Received spaceship position:', newPosition);
      setSpaceshipPosition(newPosition);
    });

    // Listen for new aliens being spawned
    socket.on('newAlien', (newAlien) => {
      console.log('Received new alien:', newAlien);
      setAliens((prevState) => [...prevState, newAlien]);
    });

    // Listen for new bullets being fired
    socket.on('newBullet', (newBullet) => {
      console.log('Received new bullet:', newBullet);
      setBullets((prevState) => [...prevState, newBullet]);
    });

    // Listen for new special entities being spawned
    socket.on('newSpecialEntity', (newSpecialEntity) => {
      console.log('Received new special entity:', newSpecialEntity);
      setSpecialEntities((prevState) => [...prevState, newSpecialEntity]);
    });

    // Listen for timer updates
    socket.on('updateTimer', (newTime) => {
      console.log('Received timer update:', newTime);
      setTimeLeft(newTime);
    });

    // Listen for position updates of aliens and special entities
    socket.on('updatePositions', ({ aliens, specialEntities }) => {
      console.log('Received positions update');
      setAliens(aliens);
      setSpecialEntities(specialEntities);
    });

    // Listen for bullets updates
    socket.on('updateBullets', (bullets) => {
      console.log('Received bullets update');
      setBullets(bullets);
    });

    return () => {
      console.log('Viewer disconnecting from WebSocket server...');
      socket.off('initialGameState');
      socket.off('updateGameState');
      socket.off('spaceshipPosition');
      socket.off('newAlien');
      socket.off('newBullet');
      socket.off('newSpecialEntity');
      socket.off('updateTimer');
      socket.off('updatePositions');
      socket.off('updateBullets');
    };
  }, [socket]);

  // Run game logic on the viewer side
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setAliens((prevAliens) =>
        prevAliens.map((alien) => ({
          ...alien,
          top: alien.top + alien.speed,
        }))
      );
      setBullets((prevBullets) =>
        prevBullets.map((bullet) => ({
          ...bullet,
          top: bullet.top - 5,
        }))
      );
      setSpecialEntities((prevEntities) =>
        prevEntities.map((entity) => ({
          ...entity,
          top: entity.top + entity.speed,
        }))
      );

      // Collision detection
      setAliens((prevAliens) => {
        return prevAliens.filter((alien) => {
          let hit = false;
          bullets.forEach((bullet) => {
            if (
              Math.abs(alien.top - bullet.top) < 20 &&
              Math.abs(alien.left - bullet.left) < 20
            ) {
              hit = true;
              setBullets((prevBullets) => prevBullets.filter((b) => b.id !== bullet.id));
            }
          });
          return !hit;
        });
      });

      setSpecialEntities((prevEntities) => {
        return prevEntities.filter((entity) => {
          let hit = false;
          bullets.forEach((bullet) => {
            if (
              Math.abs(entity.top - bullet.top) < 20 &&
              Math.abs(entity.left - bullet.left) < 20
            ) {
              hit = true;
              setBullets((prevBullets) => prevBullets.filter((b) => b.id !== bullet.id));
            }
          });
          return !hit;
        });
      });

      // Check if the game is over
      aliens.forEach((alien) => {
        if (alien.top >= 90) {
          setGameOver(true);
        }
      });

    }, 100);

    return () => clearInterval(interval);
  }, [gameOver, bullets, aliens]);

  // Timer effect
  useEffect(() => {
    if (gameOver) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          setGameOver(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, gameOver]);

  return (
    <div className="alien-shooter">
      <div className="ammo">Shots Left: {shotsLeft}</div>
      <div className="timer">Time Left: {timeLeft}</div>
      <div className="game-area">
        {aliens.map((alien) => (
          <div
            key={alien.id}
            className={`${alien.type === 'strong' ? 'strong-alien' : 'normal-alien'} ${alien.flash ? 'flash' : ''}`}
            style={{ left: `${alien.left}%`, top: `${alien.top}%`, opacity: alien.flash ? 0.5 : 1 }}
          >
            <img src={alien.type === 'strong' ? '/mg/strong-alien.png' : '/mg/normal-alien.png'} alt="Alien" />
          </div>
        ))}
        {specialEntities.map((entity) => (
          <div
            key={entity.id}
            className="special-entity"
            style={{ left: `${entity.left}%`, top: `${entity.top}%` }}
          >
            <img src="/mg/barrel.png" alt="Special Entity" />
          </div>
        ))}
        {bullets.map((bullet) => (
          <div key={bullet.id} className="bullet" style={{ left: `${bullet.left}%`, top: `${bullet.top}%` }} />
        ))}
        <div className="spaceship" style={{ left: `${spaceshipPosition}%` }}>
          <img src="/mg/turtle.png" alt="Spaceship" />
        </div>
        {reloading && <div className="reloading">Reloading...</div>}
      </div>
      {gameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default AlienViewer;
