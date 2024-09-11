"use client"

import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {useParams} from "next/navigation";

const RouletteContainer = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
`;

const RouletteBg = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 350px;
  border-radius: 350px;
  overflow: hidden;
`;

const RouletteWacu = styled.div`
  width: 100%;
  height: 100%;
  background: #ffff00 url("https://m.lifeplanet.co.kr:444/commons/slink/administrator/openInnovation/img/MO)%20360%ED%94%8C%EB%9E%98%EB%8B%9B_%EB%A3%B0%EB%A0%9B%ED%8C%90_476x476_201026.png") no-repeat;
  background-size: 100%;
  transform-origin: center;
  transition-timing-function: ease-in-out;
  transition: 2s;
`;

const RouletteArrow = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 1px;
  border-right: 10px solid transparent;
  border-left: 10px solid transparent;
  border-top: 40px solid red;
  border-bottom: 0 solid transparent;
`;

const RouletteButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 80px;
  background: #fff;
  border-image: linear-gradient(to right, #fbfcb9be, #ffcdf3aa, #65d3ffaa);
  border: 2px solid;
`;

const Roulette = ({client, myPlayer}) => {
  if (client === null) return;
  const rolLength = 6; // 룰렛 콘텐츠 갯수
  const [isSpinning, setIsSpinning] = useState(false);
  const [goSpin, setGoSpin] = useState(true);
  const [randomNumber, setRandomNumber] = useState(null);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const {roomId} = useParams();

  useEffect(() => {
    if (goSpin) return;
    if (isSpinning) return;

    setIsSpinning(true);
    const panel = panelRef.current;
    const btn = btnRef.current;
    const deg = Array.from({length: rolLength}, (_, i) => (360 / rolLength) * (i + 1));

    let num = 0;

    const ani = setInterval(() => {
      num++;
      panel.style.transform = `rotate(${360 * num}deg)`;
      btn.disabled = true;

      if (num === 50) {
        clearInterval(ani);
        panel.style.transform = `rotate(${deg[randomNumber]}deg)`;
        setIsSpinning(false);
        setTimeout(() => {
          alertMessage(randomNumber);
          btn.disabled = false;
        }, 2300);
      }
    }, 50);
  }, [randomNumber]);


  useEffect(() => {
    client.subscribe(`/topic/roulette/${roomId}`, (msg) => {
      const message = JSON.parse(msg.body)
      if (message.type === "rouletteStart") {
        setRandomNumber(parseInt(message.message));
      }
    });
  }, [client]);


  const alertMessage = (num) => {
    switch (num) {
      case 1:
        alert("당첨!! 스타벅스 아메리카노");
        break;
      case 3:
        alert("당첨!! 햄버거 세트 교환권");
        break;
      case 5:
        alert("당첨!! CU 3,000원 상품권");
        break;
      default:
        alert("꽝! 다음 기회에");
    }
    client.send(
      `/app/mini-game/result/${roomId}`,
      {
        name: myPlayer,
        number: num,
      },
      JSON.stringify({message: "result"})
    );
  };

  const rouletteStartClick = () => {
    setGoSpin(false);
    client.send(
      `/app/main/roulette/${roomId}`,
      {
        name: myPlayer,
      },
      JSON.stringify({message: "start"})
    );
  }

  return (
    <RouletteContainer>
      <RouletteBg>
        <RouletteWacu ref={panelRef}></RouletteWacu>
      </RouletteBg>
      <RouletteArrow></RouletteArrow>
      <RouletteButton ref={btnRef} onClick={rouletteStartClick}>
        Start
      </RouletteButton>
    </RouletteContainer>
  );
};

export default Roulette;
