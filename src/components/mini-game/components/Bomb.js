import React, { useState, useEffect } from 'react';
import Wire from './Wire'; // Assumed to be a component that renders wires for cutting

const Bomb = ({ socket }) => {
    const [status, setStatus] = useState('active');

    useEffect(() => {
        if(socket) {
            sockt.on('setBombStatus', (stat) => {
                setStatus(stat);
            });
        }else {
            console.log('Socket not connected');
        }
    }, [socket]);

    const handleCutWire = (color) => {
        socket.emit('wireCut', color)
    };

    return (
        <div className="bomb-container">
            <h1>Bomb Status: {status}</h1>
            <div className="bomb">
                {status === 'exploded' ? (
                    <img src={process.env.PUBLIC_URL + '/mg/explosion.png'} alt="Explosion" className="explosion-image" />
                ) : (
                    <img src={process.env.PUBLIC_URL + '/mg/bomb.png'} alt="Bomb" className="bomb-image" />
                )}
                {status === 'active' && (
                    <div className="wires">
                        <Wire color="blue" onCut={handleCutWire} />
                        <Wire color="red" onCut={handleCutWire} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bomb;
