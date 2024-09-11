import React, { useState, useEffect } from 'react';

const BombViewer = ({ socket }) => {
    const [status, setStatus] = useState('active');
    const [defuseWire, setDefuseWire] = useState('');

    useEffect(() => {
        // Adding a check to ensure the socket exists before setting up listeners
        if (socket) {
            console.log('Setting up socket listeners.');

            // Listen for bomb status updates
            socket.on('bombStatusUpdate', (newStatus) => {
                console.log('Received bombStatusUpdate:', newStatus);  // Log received status
                setStatus(newStatus);
            });

            // Listen for defuse wire information
            socket.on('defuseWire', (wire) => {
                console.log('Received defuseWire:', wire);  // Log the defuse wire received
                setDefuseWire(wire);
            });
        }

        // Clean up the listeners on unmount to prevent memory leaks
        return () => {
            if (socket) {
                socket.off('bombStatusUpdate');
                socket.off('defuseWire');
                console.log('Cleaned up socket listeners.');
            }
        };
    }, [socket]);

    useEffect(() => {
        console.log('Bomb status has changed:', status);  // Track when status changes
    }, [status]);

    return (
        <div className="bomb-viewer-container">
            <h1>Bomb Status: {status}</h1>
            {status !== 'active' && <p>The defuse wire was: {defuseWire}</p>}
            <div className="bomb">
                {status === 'exploded' ? (
                    <img src={process.env.PUBLIC_URL + '/mg/explosion.png'} alt="Explosion" className="explosion-image" />
                ) : (
                    <img src={process.env.PUBLIC_URL + '/mg/bomb.png'} alt="Bomb" className="bomb-image" />
                )}
            </div>
        </div>
    );
};

export default BombViewer;
