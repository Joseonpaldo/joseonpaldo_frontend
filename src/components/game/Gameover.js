"use client";
import React, { useEffect, useState } from 'react';
import './Gameover.css';

const Gameover = () => {
  // 임의의 플레이어 데이터를 정의
  const players = [
    { name: 'Seehyun Choi', score: 1490, win:"20", lose: "4", rate: "83%" },  // 1등
    { name: '민석', score: -20, win:"5", lose: "7", rate: "42%" },           // 2등
    { name: '배동우', score: -140, win:"11", lose: "9", rate: "55%" },        // 3등
    { name: 'Hyunsung Lee', score: -40, win:"3", lose: "4", rate: "43%" }    // 4등
  ];


  return (
    <div className="gameover-container">
      <div className="rank-section">
        <h2>Game Over</h2>
        <table className="rank-table">
          <thead>
          <tr>
            <th>순위</th>
            <th>이름</th>
            <th>점수</th>
            <th>승리</th>
            <th>패배</th>
            <th>승률</th>
          </tr>
          </thead>
          <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{index + 1}등</td> {/* 순위 */}
              <td>{player.name}</td> {/* 이름 */}
              <td>{player.score}냥</td> {/* 점수 */}
              <td>{player.win}</td> {/* 점수 */}
              <td>{player.lose}</td> {/* 점수 */}
              <td>{player.rate}</td> {/* 점수 */}
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <div className="reward-section">
        <h3>Seehyun Choi님이 승리했습니다!</h3>
      </div>
    </div>
  );
};

export default Gameover;
