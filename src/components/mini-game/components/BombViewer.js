import React, { useState, useEffect } from 'react';

const BombViewer = ({ socket }) => {
    const [status, setStatus] = useState('active');

    useEffect(() => {
        if (socket) {
            sockt.on('setBombStatus', (stat) => {
                setStatus(stat);
            });
        }
    }, [socket]);

    return (
        <div className="bomb-viewer-container">
            <h1>Bomb Status: {status}</h1>
            {status !== 'active' && <p>The defuse wire was: {defuseWire}</p>}
            <div className="bomb">
                {status === 'exploded' ? (
                    <img src={'/mg/explosion.png'} alt="Explosion" className="explosion-image" />
                ) : (
                    <img src={'/mg/bomb.png'} alt="Bomb" className="bomb-image" />
                )}
            </div>
        </div>
    );
};

export default BombViewer;
