import React, { useEffect, useCallback } from 'react';

const Player = ({ socket }) => {
    const handleKeyDown = useCallback((e) => {
        switch (e.key) {
            case 'ArrowLeft':
                socket.emit('moveLeft');
                break;
            case 'ArrowRight':
                socket.emit('moveRight');
                break;
            case ' ':
                socket.emit('jump');
                break;
            default:
                break;
        }
    }, [socket]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return null; // This component doesn't render anything, it just handles input
};

export default Player;
