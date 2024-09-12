import React from 'react';
import './Gameover.css';

const Gameover = ({ players }) => {
  return (
    <div className="gameover-container">
      {/* Rank Section */}
      <div className="rank-section">
        <h2>Game Over</h2>
        <table className="rank-table">
          <thead>
          <tr>
            <th>순위</th>
            <th>이름</th>
            <th>승리</th>
            <th>패배</th>
            <th>승률</th>
          </tr>
          </thead>
          <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.win}</td>
              <td>{player.lose}</td>
              <td>{player.winRate}%</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* 승리자와 패배자에 따른 문구 표시 */}
      <div className="reward-section">
        {players[0].win ? <h3>굳잡! {players[0].name}님이 승리했습니다!</h3> : <h3>분발하세요! {players[0].name}님이 패배했습니다.</h3>}
      </div>
    </div>
  );
};

export default Gameover;
