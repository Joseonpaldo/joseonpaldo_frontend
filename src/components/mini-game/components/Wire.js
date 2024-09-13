import React from 'react';

const Wire = ({ color, onCut }) => {
    return (
        <button className={`wire ${color}`} onClick={() => onCut(color)}>
            Cut {color} wire
        </button>
    );
};

export default Wire;
