"use client"
// noinspection BadExpressionStatementJS


import {forwardRef, useEffect, useRef, useState} from "react";
import useWindowSizeCustom from "../../hooks/useWindowSizeCustom.js";
import {yutStates} from "./YutStates.js"
import {useParams} from "next/navigation";


function YutPan() {

  const [myPlayer, setMyPlayer] = useState("player1");

  const [yutThrowImageSrc, setYutThrowImageSrc] = useState("/image/yut1.gif");
  const [yutThrowImageDisplay, setYutThrowImageDisplay] = useState("none");
  const [yutThrowAble, setYutThrowAble] = useState(false);
  const windowSizeCustom = useWindowSizeCustom();


  const [resultArr, setResultArr] = useState([]);
  const [resultDelIndex, setResultDelIndex] = useState(null);


  const [players, setPlayers] = useState({
    player1: {
      top: 356.11,
      left: 356.31,
      index: 0,
      direction: "scaleX(1)",
      name: "player1",
      money: 500,
      color: "#ff8686",
      rank: "1st",
      avatar: "/image/character/bear.png",
      profile: "/assets/avatar-1.png",
      estate: [
      ]
    },
    player2: {
      top: 356.11,
      left: 356.31,
      index: 0,
      direction: "scaleX(1)",
      name: "player2",
      money: 500,
      color: "#fff493",
      rank: "1st",
      avatar: "/image/character/dragon.png",
      profile: "/assets/avatar-2.png",
      estate: [
      ]
    },
    player3: {
      top: 356.11,
      left: 356.31,
      index: 0,
      direction: "scaleX(1)",
      name: "player3",
      money: 500,
      color: "#8eff9c",
      rank: "1st",
      avatar: "/image/character/monkey.png",
      profile: "/assets/avatar-3.png",
      estate: [
      ]
    },
    player4: {
      top: 356.11,
      left: 356.31,
      index: 0,
      direction: "scaleX(1)",
      name: "player4",
      money: 500,
      color: "#8091ff",
      rank: "1st",
      avatar: "/image/character/rabbit.png",
      profile: "/assets/avatar-4.png",
      estate: [
      ]
    },
  });


  const updatePlayer = (playerKey, newValues) => {
    setPlayers((prevPlayers) => ({
      ...prevPlayers,
      [playerKey]: {
        ...prevPlayers[playerKey],
        ...newValues,
      },
    }));
  };

  const playerKeys = Object.keys(players);


  useEffect(() => {
    const index = players[myPlayer].index;
    const YutData = yutStates.find(states => states.YutIndex === parseInt(index));

    if (YutData) {
      updatePlayer(myPlayer, {top: parseInt(YutData.top, 10)});
      updatePlayer(myPlayer, {left: parseInt(YutData.left, 10)});

      if ((index >= 0 && index <= 9) || index === "22" || index === "23") {
        updatePlayer(myPlayer, {direction: "scaleX(1)"});
      } else {
        updatePlayer(myPlayer, {direction: "scaleX(-1)"});
      }

      arrowDisplayNone();
      if (resultDelIndex != null) {
        resultArrDelete(resultDelIndex);
      }
    } else {
      console.warn(`YutData not found for index: ${index}`);
    }
  }, [players[myPlayer].index]);


  useEffect(() => {
    Object.values(players).forEach((player) => {
      player.estate.forEach((estate) => {
        const index = estate.location;
        const ele = yutIndexRefs.current.find(s => s.classList[0] === "YutState" + index);
        ele.style.borderColor = player.color ? player.color : "#fff";
        ele.classList.add(player.name);

        const stateDiv = document.createElement('div');
        Object.assign(stateDiv.style, StateBuildStyle); // 스타일 적용
        stateDiv.style.backgroundImage = `url(/image/level${estate.landmark}.png)`; // 필요한 경우 배경 이미지 설정

        // ele에 추가
        ele.appendChild(stateDiv);
      })
    });

    return () => {
    };
  }, [players, myPlayer,
    yutThrowImageSrc,
    yutThrowImageDisplay,
    yutThrowAble,
    resultArr,
    resultDelIndex
  ]);


  // YutState에 ref를 할당
  const yutRefs = useRef([]);
  const yutIndexRefs = useRef([]);

  useEffect(() => {
    yutRefs.current = yutRefs.current.slice(0, yutStates.length);
  }, []);

  useEffect(() => {
    yutIndexRefs.current = yutIndexRefs.current.slice(0, yutStates.length);
  }, []);


  const {roomId} = useParams();


  // useEffect(() => {
  //   const socket = new SockJS('http://localhost:8080/socket');
  //   const stompClient = Stomp.over(socket);
  //   stompClient.connect({}, () => {
  //     console.log('Connected to WebSocket');
  //     stompClient.subscribe('/topic/public', (message) => {
  //       console.log(message);
  //     });
  //     stompClient.subscribe(`/user/queue/players`, (message) => {
  //       console.log(message);
  //     });
  //     stompClient.send('/app/chat.addUser', {}, JSON.stringify({
  //       sender: `플레이어-${Math.random().toString(36).substring(7)}`,
  //       type: 'JOIN'
  //     }));
  //   });
  // }, [])

  const stateMouseOver = (e) => {
    const element = e.target;
    element.querySelector(".yutName").style.scale = "1.5";
  }

  const stateMouseOut = (e) => {
    const element = e.target;
    element.querySelector(".yutName").style.scale = "0.7";
  }

  const YutThrowBtnOver = (e) => {
    const element = e.target;
    if (element.style.backgroundImage === `url("/image/Btthrow.normal.0.png")`) {
      element.style.backgroundImage = `url("/image/Btthrow.mouseOver.0.png")`;
    }
  }

  const YutThrowBtnOut = (e) => {
    const element = e.target;
    if (element.style.backgroundImage === `url("/image/Btthrow.mouseOver.0.png")`) {
      element.style.backgroundImage = `url("/image/Btthrow.normal.0.png")`;
    }
  }

  const YutThrowBtnDown = (e) => {
    const element = e.target;
    if (element.style.backgroundImage === `url("/image/Btthrow.mouseOver.0.png")`) {
      element.style.backgroundImage = `url("/image/Btthrow.pressed.0.png")`;
    }
  }
  const YutThrowBtnUp = (e) => {
    const element = e.target;
    if (element.style.backgroundImage === `url("/image/Btthrow.pressed.0.png")`) {
      element.style.backgroundImage = `url("/image/Btthrow.disabled.0.png")`;
    }
  }

  const YutThrowBtnClick = () => {
    if (yutThrowAble) {
      setYutThrowImageDisplay("flex")
      const randomNum = Math.floor(Math.random() * 5 + 1);
      setYutThrowImageSrc(`/image/yut${randomNum}.gif`)

      setTimeout(() => {
        setYutThrowImageDisplay("none")
        setYutThrowImageSrc("1")
        setResultArr((arr) => [...arr, randomNum])
        if (randomNum === 4 || randomNum === 5) {
          oneMore();
        }
      }, 2000)
      setYutThrowAble(false)
    }
  }

  const oneMore = () => {
    console.log("one more");
    setYutThrowAble(true)
    document.getElementsByClassName("YutThrowBtn")[0].style.backgroundImage = `url("/image/Btthrow.normal.0.png")`;

  }

  const arrowMouseOver = (e) => {
    e.currentTarget.querySelector("img").style.filter = "drop-shadow(0px 0px 7px #ff0)";
  }
  const arrowMouseOut = (e) => {
    e.currentTarget.querySelector("img").style.filter = "drop-shadow(0px 0px 0px #ff0)";
  }

  const arrowDisplayNone = () => {
    yutRefs.current.forEach(arrow => {
      if (arrow) {
        arrow.style.display = "none";
      }
    });
  }

  const arrowDisplayFlex = () => {
    yutRefs.current.forEach(arrow => {
      if (arrow) {
        arrow.style.display = "flex";
      }
    });
  }

  const arrowClick = (index) => {
    updatePlayer(myPlayer, {index: parseInt(index, 10)})
  };


  const resultArrDelete = (index) => {
    setResultArr((current) => {
      const newArray = [...current];
      newArray.splice(index, 1);

      // 상태 업데이트 후 조건 검사
      if (newArray.length === 0 && !yutThrowAble) {
        stepOnEvent()
      }

      return newArray;
    });
  }


  const stepOnEvent = () => {
    const index = players[myPlayer].index;
    console.log("last step index " + index);
    // const ele = yutIndexRefs.current.find(s => s.classList[0] === "YutState" + index);
    // console.log(ele)
    switch (index) {
      case 3:
      case 9:
      case 15:
      case 21:
      case 31:
      case 35:
      case 41:
      case 45:
        console.log("미니게임~");
        break;

      case 0:
        arrowDisplayFlex();
        break;

      case 6:
      case 100:
        console.log("뭐함");
        break;

      case 12:
        console.log("KTX");
        break;

      case 18:
        console.log("탐라국 ㅋㅋ");
        break;

      default:
        defaultStateEvent(index);
        break;
    }
  }

  const resultUseClick = (item, index) => {
    arrowDisplayNone();
    setResultDelIndex(index);

    // 상태 업데이트 후 화살표 표시를 위한 setTimeout 사용
    setTimeout(() => {

      let moveIndex = players[myPlayer].index + item;
      if (players[myPlayer].index === 100) {
        let go1 = (33 + item);
        if (go1 > 36) go1 = go1 - 36 + 17;

        const arrow1 = yutRefs.current.find(s => s.classList[0] === "arrowIndex" + go1);
        arrow1.style.display = "block";

        let go2 = (43 + item);
        if (go2 > 46) go2 = go2 - 47;
        const arrow2 = yutRefs.current.find(s => s.classList[0] === "arrowIndex" + go2);
        arrow2.style.display = "block";
        return;
      }

      // 크게 한바퀴 돌았을때
      if (moveIndex >= 24 && players[myPlayer].index <= 23) {
        moveIndex -= 24;
      }

      if (players[myPlayer].index >= 30 && players[myPlayer].index <= 36 && moveIndex > 36) {
        moveIndex = moveIndex - 37 + 18;
      }

      if (players[myPlayer].index >= 40 && players[myPlayer].index <= 46 && moveIndex > 46) {
        moveIndex = moveIndex - 47;
      }

      // 중앙
      if (moveIndex === 33 || moveIndex === 43) {
        moveIndex = 100;
      }
      // console.log(moveIndex);
      const arrow1 = yutRefs.current.find(s => s.classList[0] === "arrowIndex" + moveIndex);
      arrow1.style.display = "block";

      if (players[myPlayer].index === 6) {
        let go = (item + 29);
        if (go === 33) go = 100;
        const arrow2 = yutRefs.current.find(s => s.classList[0] === "arrowIndex" + go);
        arrow2.style.display = "block";
      }
      if (players[myPlayer].index === 12) {
        let go = (item + 39);
        if (go === 43) go = 100;
        const arrow2 = yutRefs.current.find(s => s.classList[0] === "arrowIndex" + go);
        arrow2.style.display = "block";
      }
    }, 0); // 상태가 업데이트된 후 바로 실행
  }

  const defaultStateEvent = (index) => {
    const ele = yutIndexRefs.current.find(s => s.classList[0] === "YutState" + index);
    if (ele?.classList[2] === undefined) {
      if (confirm("살거임?")) {
        updatePlayer(myPlayer, {money: players[myPlayer].money - yutStates.find(states => states.YutIndex === parseInt(index)).price});

        updatePlayer(myPlayer, {
          estate: [
            ...players[myPlayer].estate,
            {
              location: index,
              landmark: 1,
            }]
        });

      }
    } else {
      const owner = ele?.classList[2]
      if (myPlayer === owner) {
        if (confirm("업글 할거임?")) {
          const updateEstate = players[myPlayer].estate.map((item) => {
            if (item.location === index) {
              console.log("item.landmark : " + item.landmark);
              return {...item, landmark: item.landmark + 1};
            }
            return item;
          })
          updatePlayer(myPlayer, {estate: updateEstate});
        }
      } else {
        //통행료 내기
        console.log((players[myPlayer].money - yutStates.find(states => states.YutIndex === parseInt(index)).price * 1.5));
        updatePlayer(myPlayer, {money: (players[myPlayer].money - yutStates.find(states => states.YutIndex === parseInt(index)).price * 1.5)});
        updatePlayer(owner, {money: (players[owner].money + yutStates.find(states => states.YutIndex === parseInt(index)).price * 1.5)});
      }

    }
  }

  const YutName = {
    position: "absolute",
    top: "-32px",
    opacity: 1,
    left: "-25px",
    fontSize: "10px",
    textAlign: "center",
    width: "50px",
    transition: "all 0.3s ease-in-out",
    zIndex: 5,
    pointerEvents: "none",
    textShadow: "black 0px 0px 3px",
    fontWeight: "bold",
    color: "white",
    scale: "0.7"
  }

  const YutStateStyle = {
    position: "absolute",
    borderRadius: "13px",
    boxShadow: "1px 1px 6px black",

  }

  const StateBuildStyle = {
    position: "absolute",
    top: "-1px",
    left: 0,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: "80px",
    height: "43px",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  }

  const YutFanBackGroundStyle = {
    position: "absolute",
    top: -20,
    left: -20,
    width: "500px",
    height: "500px",
    background: "lightgray",
    borderRadius: "5%",
    opacity: 0.8,
  }

  const YutThrowImageStyle = {
    position: "absolute",
    top: -20 + 250,
    left: -20 + 250,
    transform: "translate(-50%, -50%)",
    width: 300,
    height: 300,
    display: yutThrowImageDisplay,
    justifyContent: "center",
    backgroundColor: "rgb(255,255,255,0.5)",
    borderRadius: "50%",
    zIndex: 50,
    paddingBottom: "30px",
  }

  const YutPanStyle = {
    position: "absolute",
    width: 500,
    height: 500,
    top: `${windowSizeCustom.height / 2 + 30}px`,
    left: `${windowSizeCustom.width / 2 + 30}px`,
    transform: "translate(-50%, -50%)",
    scale: "1.5",
    transformOrigin: "0px 0px",
  }

  const YutThrowBtnStyle = {
    left: 149,
    top: 325.05,
    width: 161,
    height: 45,
    scale: '0.7',
    position: 'absolute',
    backgroundImage: `url("/image/Btthrow.disabled.0.png")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }

  const YetResultBtnStyle = {
    left: 124,
    top: 65,
    width: 210,
    height: 30,
    scale: "0.8",
    position: 'absolute',
    display: "flex",
    justifyContent: "space-evenly",
  }


  const playerStyles = Object.keys(players).map((key) => {
    return {
      position: "absolute",
      width: 40,
      zIndex: 4,
      pointerEvents: "none",
      top: players[key].top - 5,
      left: players[key].left,
      display: "block",
    };
  });


  const playerNameStyle = {
    fontSize: "14px",
    fontWeight: "bolder",
    display: "inline-block",
    width: "auto",
    textAlign: "center",
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
  }

  const arrowStyle = {
    position: "absolute",
    width: 20,
    height: 30,
    display: "none",
  }

  const backStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url("/image/background.jpg")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    overflow: "hidden",
  };


  const YutState = forwardRef(({index, name, left, top, border, onMouseOver, onMouseOut}, ref) => {
    return (
      <div
        ref={ref}
        className={`YutState${index} YutState`}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        style={{
          ...YutStateStyle,
          left: `${left}px`,
          top: `${top}px`,
          border: border,
        }}
      >
        <div style={YutName} className="yutName">{name}</div>
      </div>
    );
  });


  const Arrow = forwardRef(({index, left, top, onMouseOver, onMouseOut, onClick}, ref) => {
    return (
      <div
        ref={ref}
        className={`arrowIndex${index} arrowIndex`}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
        style={{
          ...arrowStyle,

          left: `${left + 10}px`,
          top: `${top - 35}px`,
        }}
      >
        <img src="/image/underArrow.png" alt="" style={{width: "100%"}}/>
      </div>
    );
  });


  const containerStyle = {
    position: "absolute",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    pointerEvents: "none",
  };


  const cardStyle = {
    position: "absolute",
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    gap: '24px',
    pointerEvents: "auto"
  };

  const playerNumberStyle = (color) => ({
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '24px',
    border: '7px solid ' + color,
  });

  const rankStyle = {
    textAlign: 'right',
    fontSize: '32px',
    fontWeight: 'bold',
  };


  return <div style={backStyle}>

    <div style={YutPanStyle}>
      <div style={{
        position: "absolute",
        width: 500,
        height: 500,
      }}>
        <div style={YutFanBackGroundStyle}></div>
        <div style={YutThrowImageStyle}>
          <img src={yutThrowImageSrc} alt="윷 이미지" id="yutThrowImage"/>
        </div>

        <div className="YutThrowBtn"
             onMouseOver={YutThrowBtnOver}
             onMouseDown={YutThrowBtnDown}
             onMouseUp={YutThrowBtnUp}
             onMouseOut={YutThrowBtnOut}
             onClick={YutThrowBtnClick}
             style={YutThrowBtnStyle}>
        </div>

        <div className="YutResultBtn"
             style={YetResultBtnStyle}>
          {resultArr.map((item, index) => (
            <div
              key={`resultArr-${index}`} // 다른 접두사를 사용합니다.
              style={{width: 30, height: 30}}
              onClick={() => resultUseClick(item, index)}
            >
              <img src={`/image/yutResult.${item}.0.png`} alt="결과" width="30"/>
            </div>
          ))}
        </div>

        <div style={{fontSize: "20px", position: "absolute"}} onClick={oneMore}>한번더</div>


        {Object.keys(players).map((key, index) => {
          const player = players[key];

          return (
            <div key={key} className={`player ${key}`} style={playerStyles[index]}>
              <img
                src={player.avatar}
                alt={player.name}
                style={{transform: player.direction}}
                width="100%"
              />
              <span style={playerNameStyle}>{player.name}</span>
            </div>
          );
        })}

        {
          yutStates.map((state, index) => (
            <YutState
              key={`yutState-${state.YutIndex}`}
              ref={(el) => (yutIndexRefs.current[index] = el)} // ref 할당
              index={state.YutIndex}
              name={state.name}
              left={state.left}
              top={state.top}
              border={state.border}
              onMouseOver={stateMouseOver}
              onMouseOut={stateMouseOut}
            />
          ))
        }


        {
          yutStates.map((state, index) => (
            <Arrow
              key={`arrow-${state.YutIndex}`}
              ref={(el) => (yutRefs.current[index] = el)} // ref 할당
              index={state.YutIndex}
              left={state.left}
              top={state.top}
              onMouseOver={arrowMouseOver}
              onMouseOut={arrowMouseOut}
              onClick={() => arrowClick(state.YutIndex)}
            />
          ))
        }


      </div>

    </div>


    <div style={containerStyle}>


      <div>
        {playerKeys.map((key, index) => {
          const player = players[key];
          const positionStyle = {
            ...cardStyle,
            ...(index === 0 ? {left: 0, top: 0} : {}),
            ...(index === 1 ? {right: 0, top: 0, flexDirection: "row-reverse"} : {}),
            ...(index === 2 ? {right: 0, bottom: 0, flexDirection: "row-reverse"} : {}),
            ...(index === 3 ? {left: 0, bottom: 0} : {}),
          };

          return (
            <div key={key} style={positionStyle} onClick={() => {
              setResultDelIndex(null);
              setMyPlayer(player.name);
              console.log(myPlayer);
              // joinRoom();
            }}>
              <img src={player.profile} alt={player.name} style={playerNumberStyle(player.color)}/>
              <div>
                <h3 style={{fontSize: '28px', fontWeight: '600', margin: 0}}>{player.name}</h3>
                <p style={{color: '#6b7280', margin: 0}}>{player.money.toLocaleString()}냥</p>
              </div>
              <div style={rankStyle}>
                <span>{player.rank}</span>
              </div>
            </div>
          );
        })}
      </div>


    </div>


    {/*<TransitionsModal />*/}
  </div>
}

export default YutPan;
