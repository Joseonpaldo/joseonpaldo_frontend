import React, { useEffect } from 'react';
import './RankAnimation.css';
import RankAnimation from "@/components/game/RankAnimation";

const Race = ({ players }) => {
  useEffect(() => {
    players.forEach((player, index) => {
      const raceDuration = 10 / player.speed; // 애니메이션 시간을 줄여서 더 빨리 완료되도록 설정
      const runnerElement = document.querySelector(`#runner-${index}`);

      if (runnerElement) {
        console.log(`Player ${player.name} is running with speed ${player.speed}. Duration: ${raceDuration}s`);
        runnerElement.style.animationDuration = `${raceDuration}s`;
        runnerElement.style.top = `${index * 110}px`;
        runnerElement.style.animationPlayState = 'running';
      } else {
        console.error(`Runner element for player ${player.name} not found.`);
      }
    });
  }, [players]);

  return (
    <div className="raceTrack">
      <div className="finishLine"></div>
      {players.map((player, index) => (
        <div key={index} id={`runner-${index}`} className="runner">
          <img src={player.characterSrc} alt={player.name} />
          <span>{player.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Race;
