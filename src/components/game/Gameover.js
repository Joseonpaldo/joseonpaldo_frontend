import React from 'react';
import './Gameover.css';

const Gameover = () => {
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
          <tr>
            <td>1</td>
            <td>병현</td>
            <td>3(+1)</td>
            <td>1</td>
            <td>75%</td>
          </tr>
          <tr>
            <td>1</td>
            <td>병현</td>
            <td>3</td>
            <td>1(+1)</td>
            <td>75%</td>
          </tr>
          <tr>
            <td>1</td>
            <td>병현</td>
            <td>3</td>
            <td>1(+1)</td>
            <td>75%</td>
          </tr>
          <tr>
            <td>1</td>
            <td>병현</td>
            <td>3</td>
            <td>1(+1)</td>
            <td>75%</td>
          </tr>
          </tbody>
        </table>
      </div>

      {/* 참잘했어요 / 분발하세요 순위에 따라 문구 */}
      <div className="reward-section">

        <h3>굳잡!</h3>

      </div>
    </div>
  );
};

export default Gameover;
