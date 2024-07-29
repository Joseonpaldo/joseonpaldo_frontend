import React from 'react';
import './LadderResult.css';

const LadderResult = ({ results }) => {
    return (
        <div className="result-container">
            <h1 className="result-title">사다리 결과</h1>
            <ul className="result-list">
                {results.map((result, index) => (
                    <li key={index} className="result-item">{result}</li>
                ))}
            </ul>
            <button className="result-button" onClick={() => window.location.reload()}>다시하기</button>
        </div>
    );
};

export default LadderResult;
