"use client";
import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './LadderDrawing.css';

const LadderDrawing = () => {
  const [participants, setParticipants] = useState(4); // 플레이어 수를 4명으로 고정
  const [names, setNames] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [ladder, setLadder] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [drawStep, setDrawStep] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]); // 결과를 로컬 상태로 관리
  const [currentPosition, setCurrentPosition] = useState(-1);

  useEffect(() => {
    const socket = new SockJS('/ws');
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/participants', (message) => {
        const participantData = JSON.parse(message.body);
        if (participantData.participantCount === 4) { // 플레이어 수가 4명일 때만 업데이트
          setParticipants(participantData.participantCount);
          setNames(participantData.participantNames);
          setPrizes(generatePrizes(participantData.participantCount));
          setLadder(generateLadder(participantData.participantCount));
        }
      });
    });
  }, []);

  const handleStartDrawing = () => {
    setDrawing(true);
    setDrawStep(0);
    setCurrentPosition(-1);
    setShowResults(false);
  };

  const handleShowResults = () => {
    const results = calculateResults(names, prizes, ladder);
    setResults(results);
    setShowResults(true);
  };

  useEffect(() => {
    if (drawing) {
      const interval = setInterval(() => {
        setDrawStep((prev) => {
          const nextStep = prev + 1;
          if (nextStep < ladder.length) {
            return nextStep;
          } else {
            clearInterval(interval);
            return null;
          }
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [drawing, ladder.length]);

  useEffect(() => {
    if (drawStep !== null) {
      setLadder((prevLadder) => {
        const newLadder = [...prevLadder];
        if (newLadder[drawStep]) {
          newLadder[drawStep] = generateStep(participants, newLadder[drawStep - 1]);
        }
        return newLadder;
      });
    }
  }, [drawStep, participants]);

  return (
    <div className="container">
      <h1>사다리게임</h1>
      <div className="input-container">
        {names.map((name, index) => (
          <div key={index} className="input-row">
            <div className="name">{name}</div>
          </div>
        ))}
      </div>
      <div className="ladder-container">
        <div className="names-row">
          {names.map((name, index) => (
            <div key={index} className="name">{name}</div>
          ))}
        </div>
        <LadderDisplay ladder={ladder} participants={participants} currentPosition={currentPosition} />
        <div className="prizes-row">
          {prizes.map((prize, index) => (
            <div key={index} className="prize">{prize}</div>
          ))}
        </div>
      </div>
      <button onClick={handleStartDrawing}>사다리 시작</button>
      <button onClick={handleShowResults} disabled={drawing || drawStep !== null}>결과 보기</button>
      {showResults && (
        <div className="results-container">
          <h2>결과</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const generatePrizes = (participants) => {
  const prizes = Array.from({ length: participants }, (_, i) => `${i + 1}번`);
  return prizes;
};

const generateLadder = (participants) => {
  const ladder = Array.from({ length: participants * 2 }, () => Array(participants - 1).fill(false));
  return ladder;
};

const generateStep = (participants, previousStep) => {
  const step = Array(participants - 1).fill(false);
  for (let i = 0; i < participants - 1; i++) {
    if (Math.random() > 0.7 && (!previousStep || !previousStep[i])) {
      step[i] = true;
      if (i > 0) step[i - 1] = false;
    }
  }
  return step;
};

const calculateResults = (names, prizes, ladder) => {
  const results = Array(names.length).fill(null);
  for (let i = 0; i < names.length; i++) {
    let position = i;
    for (let j = 0; j < ladder.length; j++) {
      if (ladder[j][position]) {
        position += 1;
      } else if (position > 0 && ladder[j][position - 1]) {
        position -= 1;
      }
    }
    results[i] = `${names[i]} -> ${prizes[position] || '없음'}`;
  }
  return results;
};

const LadderDisplay = ({ ladder, participants, currentPosition }) => {
  return (
    <div className="ladder-grid" style={{ '--participants': participants }}>
      {Array.from({ length: participants - 1 }).map((_, colIndex) => (
        <div key={colIndex} className="ladder-column">
          {ladder.map((row, rowIndex) => (
            row[colIndex] && (
              <div
                key={rowIndex}
                className={`ladder-step ${currentPosition === colIndex && 'current-position'}`}
                style={{
                  top: `${(rowIndex + 0.5) * (100 / ladder.length)}%`,
                  left: '0',
                  width: '100%'
                }}
              />
            )
          ))}
        </div>
      ))}
    </div>
  );
};

export default LadderDrawing;
