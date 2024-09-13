import React, { useState, useEffect } from 'react';
import './css/AlienShooter.css';

const AlienShooter = ({ socket }) => {
  const [aliens, setAliens] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [spaceshipPosition, setSpaceshipPosition] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100); // Set game duration to 100 seconds
  const [shotsLeft, setShotsLeft] = useState(10);
  const [reloading, setReloading] = useState(false);
  const [specialEntities, setSpecialEntities] = useState([]);

  const restartGame = () => {
    setAliens([]);
    setBullets([]);
    setSpaceshipPosition(50);
    setGameOver(false);
    setTimeLeft(100);
    setShotsLeft(5);
    setReloading(false);
    setSpecialEntities([]);
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          socket.emit('updateTimer', newTime);
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver, socket]);

  // Send initial game state when a new viewer connects
  useEffect(() => {
    const sendInitialGameState = () => {
      const gameState = {
        aliens,
        bullets,
        spaceshipPosition,
        gameOver,
        timeLeft,
        shotsLeft,
        reloading,
        specialEntities,
      };
      socket.emit('initialGameState', gameState);
    };

    socket.on('requestInitialGameState', sendInitialGameState);

    return () => {
      socket.off('requestInitialGameState', sendInitialGameState);
    };
  }, [socket, aliens, bullets, spaceshipPosition, gameOver, timeLeft, shotsLeft, reloading, specialEntities]);

  // Send incremental game state updates
  useEffect(() => {
    if (gameOver) return; // Stop sending game state after game over

    const interval = setInterval(() => {
      const gameState = {
        spaceshipPosition,
        gameOver,
        timeLeft,
        shotsLeft,
        reloading,
      };
      socket.emit('updateGameState', gameState);
    }, 100); // Send updates every 100ms

    return () => clearInterval(interval);
  }, [socket, spaceshipPosition, gameOver, timeLeft, shotsLeft, reloading]);

  // Aliens generation effect
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      if (aliens.length < 15) { // Limit number of aliens to 15
        const isStrongAlien = Math.random() < 0.2; // 20% chance to spawn a strong alien
        const isSpecialEntity = Math.random() < 0.05; // 5% chance to spawn a special entity
        if (isSpecialEntity) {
          const newEntity = {
            id: Date.now(),
            left: Math.random() * 90,
            top: 0,
            speed: 0.02,
          };
          setSpecialEntities((prevEntities) => [...prevEntities, newEntity]);
          socket.emit('newSpecialEntity', newEntity);
        } else {
          const newAlien = {
            id: Date.now(),
            left: Math.random() * 90,
            top: 0,
            speed: isStrongAlien ? 0.01 : 0.05, // Strong alien is slower
            type: isStrongAlien ? 'strong' : 'normal',
            hits: isStrongAlien ? 3 : 1, // Strong alien takes 3 hits, normal takes 1 hit
            flash: false, // Flash effect
          };
          setAliens((prevAliens) => [...prevAliens, newAlien]);
          socket.emit('newAlien', newAlien);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, socket, aliens.length]);

  // Aliens and special entities movement effect
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setAliens((prevAliens) =>
        prevAliens.map((alien) => ({
          ...alien,
          top: alien.top + alien.speed,
        }))
      );
      setSpecialEntities((prevEntities) =>
        prevEntities.map((entity) => ({
          ...entity,
          top: entity.top + entity.speed,
        }))
      );
      socket.emit('updatePositions', { aliens, specialEntities });
    }, 1);

    return () => clearInterval(interval);
  }, [gameOver, socket, aliens, specialEntities]);

  // Bullets movement effect
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setBullets((prevBullets) =>
        prevBullets.map((bullet) => ({
          ...bullet,
          top: bullet.top - 1,
        }))
      );
      socket.emit('updateBullets', bullets);
    }, 3.5);

    return () => clearInterval(interval);
  }, [gameOver, bullets, socket]);

  // Keyboard controls effect
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!gameOver) {
        if (event.key === 'ArrowLeft' || event.key === 'a') {
          setSpaceshipPosition((prev) => {
            const newPos = Math.max(prev - 3, 0);
            socket.emit('spaceshipPosition', newPos); // Emit spaceship position update
            console.log('Emitting spaceship position:', newPos); // Debug log
            return newPos;
          });
        }
        if (event.key === 'ArrowRight' || event.key === 'd') {
          setSpaceshipPosition((prev) => {
            const newPos = Math.min(prev + 3, 90);
            socket.emit('spaceshipPosition', newPos); // Emit spaceship position update
            console.log('Emitting spaceship position:', newPos); // Debug log
            return newPos;
          });
        }
        if (event.key === ' ' && !reloading) {
          if (shotsLeft > 0) {
            const newBullet = { id: Date.now(), left: spaceshipPosition + 0.5, top: 80 }; // Align bullet with spaceship
            setBullets((prevBullets) => [...prevBullets, newBullet]);
            socket.emit('newBullet', newBullet);
            setShotsLeft((prevShots) => prevShots - 1);
          } else {
            setReloading(true);
            setTimeout(() => {
              setShotsLeft(10);
              setReloading(false);
            }, 1000);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, spaceshipPosition, shotsLeft, reloading, socket]);

  // Collision detection effect
  useEffect(() => {
    const updateAliens = () => {
      setAliens((prevAliens) => prevAliens.filter((alien) => alien.top < 100));
      setBullets((prevBullets) => prevBullets.filter((bullet) => bullet.top > 0));
      setSpecialEntities((prevEntities) => prevEntities.filter((entity) => entity.top < 100));

      const newAliens = [...aliens];
      const newBullets = [...bullets];
      const newSpecialEntities = [...specialEntities];

      for (let alien of aliens) {
        for (let bullet of bullets) {
          if (
            (alien.top - bullet.top < 0 && alien.top - bullet.top > -10 )&& // Increased hitbox size
            (alien.left - bullet.left < 0 && alien.left - bullet.left > -15 )// Increased hitbox size
          ) {
            alien.flash = true; // Trigger flash effect

            setTimeout(() => {
              alien.flash = false;
            }, 100);

            if (alien.hits === 1) {
              newAliens.splice(newAliens.findIndex(a => a.id === alien.id), 1);
            } else {
              alien.hits -= 1;
            }
            newBullets.splice(newBullets.findIndex(b => b.id === bullet.id), 1);
            socket.emit('alienHit', alien);
          }
        }

        if (alien.top >= 90) {
          setGameOver(true);
          socket.emit('gameOver');
        }
      }

      for (let entity of specialEntities) {
        for (let bullet of bullets) {
          if (
            Math.abs(entity.top - bullet.top) < 20 && // Increased hitbox size
            Math.abs(entity.left - bullet.left) < 20 // Increased hitbox size
          ) {
            newSpecialEntities.splice(newSpecialEntities.findIndex(e => e.id === entity.id), 1);
            newBullets.splice(newBullets.findIndex(b => b.id === bullet.id), 1);
            socket.emit('specialEntityHit', entity);
          }
        }

        if (entity.top >= 90) {
          newSpecialEntities.splice(newSpecialEntities.findIndex(e => e.id === entity.id), 1);
        }
      }

      setAliens(newAliens);
      setBullets(newBullets);
      setSpecialEntities(newSpecialEntities);
    };

    const interval = setInterval(updateAliens, 2);
    return () => clearInterval(interval);
  }, [aliens, bullets, specialEntities, socket]);

  return (
    <div className="alien-shooter">
      
      <div className="timer" >Time Left: {timeLeft}s</div>
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
          <img src="/mg/player.gif" alt="Spaceship" />
        </div>
        {reloading && <div className="reloading">Reloading...</div>}
        <div className="ammo">Shots Left: {shotsLeft}</div>
      </div>
      {gameOver && (
        <div>
          <div className="game-over">Game Over</div>
          <button onClick={restartGame} className="restart-button">Restart</button>
        </div>
      )}
    </div>
  );
};

export default AlienShooter;