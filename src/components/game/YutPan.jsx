"use client"
// noinspection BadExpressionStatementJS


import {useEffect, useRef, useState} from "react";
import useWindowSizeCustom from "../../hooks/useWindowSizeCustom.js";
import {yutStates} from "./YutStates.js"
import {useParams} from "next/navigation";
import {
  backStyle,
  cardStyle,
  containerStyle,
  rankStyle,
  YetResultBtnStyle,
  YutFanBackGroundStyle,
  YutThrowBtnStyle,
} from "./YutPanStyle"
import {
  Arrow,
  arrowMouseOut,
  arrowMouseOver,
  BuyEstateConfirmDialog,
  playerNumberStyle,
  stateMouseOut,
  stateMouseOver,
  UpgradeEstateConfirmDialog,
  YutState,
  YutThrowBtnDown,
  YutThrowBtnOut,
  YutThrowBtnOver,
  YutThrowBtnUp,
} from "./yutPanFunction"
import {Stomp} from "@stomp/stompjs";
import SockJS from 'sockjs-client';


function YutPan() {

  const [myPlayer, setMyPlayer] = useState(null);
  const [myTurn, setMyTurn] = useState(false);

  const [yutThrowImageSrc, setYutThrowImageSrc] = useState("/image/yut1.gif");
  const [yutThrowImageDisplay, setYutThrowImageDisplay] = useState("none");
  const [yutThrowAble, setYutThrowAble] = useState(false);
  const windowSizeCustom = useWindowSizeCustom();

  const [BuyEstateOpen, setBuyEstateOpen] = useState(false);
  const [UpgradeEstateOpen, setUpgradeEstateOpen] = useState(false);
  const [UpgradeLevel, setUpgradeLevel] = useState(0);

  const [resultArr, setResultArr] = useState([]);
  const [resultDelIndex, setResultDelIndex] = useState(null);

  const [client, setClient] = useState(null);


  const [players, setPlayers] = useState({
    player1: {
      player: "player1",
      top: 356.11,
      left: 356.31,
      index: 0,
      direction: "scaleX(1)",
      name: "player1",
      money: 500,
      color: "#b59282",
      rank: "1st",
      avatar: "/image/character/bear.png",
      profile: "/assets/avatar-1.png",
      estate: []
    },
    player2: {
      player: "player2",
      top: 356.11,
      left: 356.31,
      index: 0,
      direction: "scaleX(1)",
      name: "player2",
      money: 500,
      color: "#A4D8C2",
      rank: "1st",
      avatar: "/image/character/dragon.png",
      profile: "/assets/avatar-2.png",
      estate: []
    },
    player3: {
      player: "player3",
      top: 356.11,
      left: 356.31,
      index: 0,
      direction: "scaleX(1)",
      name: "player3",
      money: 500,
      color: "#633630",
      rank: "1st",
      avatar: "/image/character/monkey.png",
      profile: "/assets/avatar-3.png",
      estate: []
    },
    player4: {
      player: "player4",
      top: 356.11,
      left: 356.31,
      index: 0,
      direction: "scaleX(1)",
      name: "player4",
      money: 500,
      color: "#FBD8E2",
      rank: "1st",
      avatar: "/image/character/rabbit.png",
      profile: "/assets/avatar-4.png",
      estate: []
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
    Object.values(players).forEach((player, index) => {


      const location = player.index;
      const YutData = yutStates.find(states => states.YutIndex === parseInt(location));

      if (YutData) {
        updatePlayer("player" + (index + 1), {top: parseInt(YutData.top, 10)});
        updatePlayer("player" + (index + 1), {left: parseInt(YutData.left, 10)});

        if ((location >= 0 && location <= 9) || location === "22" || location === "23") {
          updatePlayer("player" + (index + 1), {direction: "scaleX(1)"});
        } else {
          updatePlayer("player" + (index + 1), {direction: "scaleX(-1)"});
        }
      }


    });

  }, [
    players.player1.index,
    players.player2.index,
    players.player3.index,
    players.player4.index
  ]);


  useEffect(() => {
    Object.values(players).forEach((player) => {
      if (player.estate !== undefined) {
        player.estate.forEach((estate) => {
          const index = estate.location;
          const ele = yutIndexRefs.current.find(s => s.classList[0] === "YutState" + index);
          ele.style.borderColor = player.color ? player.color : "#fff";
          ele.classList.add(player.player);

          ele.children[1].style.backgroundImage = `url(/image/level${estate.landmark}.png)`; // 필요한 경우 배경 이미지 설정

          let name = yutStates.find(states => states.YutIndex === parseInt(index)).name;

          switch (estate.landmark) {
            case 1 :
              name = name + "시";
              break;
            case 2 :
              name = name + "광역시";
              break;
            case 3 :
              name = name + "특별시";
              break;
          }
          ele.children[0].innerText = name;
        })
      }
    });
  }, [
    players.player1.estate,
    players.player2.estate,
    players.player3.estate,
    players.player4.estate
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


  useEffect(() => {
    if (myPlayer === null){
      return;
    }
    const socket = new SockJS('http://localhost:8080/socket'); // WebSocket 서버 URL
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
      setClient(stompClient);
      stompClient.send(
        `/app/main/join/${roomId}`,
        {
          name: myPlayer,
          // sessionId :
        },
        JSON.stringify({message: "join"})
      );

      // 플레이어 정보 가져오기
      stompClient.subscribe(`/topic/main-game/${roomId}`, (msg) => {
        const message = JSON.parse(msg.body)
        if (message.type === "getPlayer") {
          let getPlayers = JSON.parse(message.message);
          setResultDelIndex(null);
          arrowDisplayNone();
          const playerObjects = {
            player1: JSON.parse(getPlayers.player1),
            player2: JSON.parse(getPlayers.player2),
            player3: JSON.parse(getPlayers.player3),
            player4: JSON.parse(getPlayers.player4)
          };

          Object.values(playerObjects).forEach((player, index) => {
            updatePlayer("player" + (index + 1), {
              name: player.name,
              avatar: `/image/character/${player.avatar}.png`,
              index: player.location,
              profile: player.profile,
              money: player.money,
              rank: "1st",
              estate: player.estate,
              player: player.player
            });
            switch (player.avatar) {
              case "bear":
                updatePlayer("player" + (index + 1), {color: "#b59282"});
                break;
              case "cow":
                updatePlayer("player" + (index + 1), {color: "#ffb6cc"});
                break;
              case "dragon":
                updatePlayer("player" + (index + 1), {color: "#A4D8C2"});
                break;
              case "duck":
                updatePlayer("player" + (index + 1), {color: "#ffe53b"});
                break;
              case "fox":
                updatePlayer("player" + (index + 1), {color: "#ff631b"});
                break;
              case "monkey":
                updatePlayer("player" + (index + 1), {color: "#633630"});
                break;
              case "panda":
                updatePlayer("player" + (index + 1), {color: "#757575"});
                break;
              case "rabbit":
                updatePlayer("player" + (index + 1), {color: "#ffe4e4"});
                break;
              case "tiger":
                updatePlayer("player" + (index + 1), {color: "#b85b00"});
                break;
            }
            if (player.myTurn) {
              if (myPlayer === ("player" + (index + 1))) {
                setMyTurn(true);
              }
            }else {
              setMyTurn(false);
            }
          });
        } else if (message.type === "getResult") {
          let resultNum = JSON.parse(message.message);
          setYutThrowImageDisplay("flex")
          setYutThrowImageSrc(`/image/yut${resultNum}.gif`)
          setYutThrowAble(false)
          setTimeout(() => {
            setYutThrowImageDisplay("none")
            setYutThrowImageSrc("1")
          }, 2000)
        } else if (message.type === "commend") {
          let commend = message.message;
          if (commend === "oneMore") {
            setTimeout(() => oneMore(), 2000)
          }
        } else if (message.type === "resultArr") {
          setTimeout(() => setResultArr(JSON.parse(message.message)), 0)
        } else if (message.type === "displayArrow") {
          arrowDisplayNone();
          JSON.parse(message.message).forEach((item) => {
            if (item !== -1){
                  const arrow1 = yutRefs.current.find(s => s.classList[0] === "arrowIndex" + item);
                  arrow1.style.display = "block";
            }
          })
        } else if (message.type === "isThrow") {
          if (JSON.parse(message.message)){
            oneMore();
          }
        } else {
          console.log("error : " + JSON.parse(message.message).toString());
        }

      });


    });
  }, [myPlayer]);

  useEffect(() => {
    if (resultArr.length === 0 && !yutThrowAble && myTurn) {
      stepOnEvent(parseInt(players[myPlayer].index , 10))
    }
  }, [resultArr]);



  const YutThrowBtnClick = () => {
    if (yutThrowAble) {
      client.send(
        `/app/main/throwYut/${roomId}`,
        {name: myPlayer}, // 헤더 설정
        JSON.stringify({message: "throw"})
      );
    }
  }

  const oneMore = () => {
    setYutThrowAble(true)
    document.getElementsByClassName("YutThrowBtn")[0].style.backgroundImage = `url("/image/Btthrow.normal.0.png")`;
  }

  const passTurn = () => {
    client.send(
      `/app/main/passTurn/${roomId}`,
      {name: myPlayer}, // 헤더 설정
      JSON.stringify({message: "pass"})
    );
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

    arrowDisplayNone();

    client.send(
      `/app/main/arrowClick/${roomId}`,
      {name: myPlayer, location: index, resultDelIndex: resultDelIndex}, // 헤더 설정
      JSON.stringify({message: "move this"})
    );

    // //사용한 결과 지우기
    // if (resultDelIndex != null) {
    //   setResultArr((current) => {
    //     const newArray = [...current];
    //     newArray.splice(resultDelIndex, 1);
    //
    //     // 결과 배열이 0이면 밟은 위치 확정하기
    //     if (newArray.length === 0 && !yutThrowAble) {
    //       stepOnEvent(parseInt(index, 10))
    //     }
    //
    //     return newArray;
    //   });
    // }
  };

  const stepOnEvent = (index) => {
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
        // arrowDisplayFlex();
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

    client.send(
      `/app/main/useResult/${roomId}`,
      {name: myPlayer, item: item}, // 헤더 설정
      JSON.stringify({message: "use result"})
    );
    // 상태 업데이트 후 화살표 표시를 위한 setTimeout 사용
    // setTimeout(() => {
    //
    //   let moveIndex = players[myPlayer].index + item;
    //   if (players[myPlayer].index === 100) {
    //     let go1 = (33 + item);
    //     if (go1 > 36) go1 = go1 - 36 + 17;
    //
    //     const arrow1 = yutRefs.current.find(s => s.classList[0] === "arrowIndex" + go1);
    //     arrow1.style.display = "block";
    //
    //     let go2 = (43 + item);
    //     if (go2 > 46) go2 = go2 - 47;
    //     const arrow2 = yutRefs.current.find(s => s.classList[0] === "arrowIndex" + go2);
    //     arrow2.style.display = "block";
    //     return;
    //   }
    //
    //   // 크게 한바퀴 돌았을때
    //   if (moveIndex >= 24 && players[myPlayer].index <= 23) {
    //     moveIndex -= 24;
    //   }
    //
    //   if (players[myPlayer].index >= 30 && players[myPlayer].index <= 36 && moveIndex > 36) {
    //     moveIndex = moveIndex - 37 + 18;
    //   }
    //
    //   if (players[myPlayer].index >= 40 && players[myPlayer].index <= 46 && moveIndex > 46) {
    //     moveIndex = moveIndex - 47;
    //   }
    //
    //   // 중앙
    //   if (moveIndex === 33 || moveIndex === 43) {
    //     moveIndex = 100;
    //   }
    //   // console.log(moveIndex);
    //   const arrow1 = yutRefs.current.find(s => s.classList[0] === "arrowIndex" + moveIndex);
    //   arrow1.style.display = "block";
    //
    //   if (players[myPlayer].index === 6) {
    //     let go = (item + 29);
    //     if (go === 33) go = 100;
    //     const arrow2 = yutRefs.current.find(s => s.classList[0] === "arrowIndex" + go);
    //     arrow2.style.display = "block";
    //   }
    //   if (players[myPlayer].index === 12) {
    //     let go = (item + 39);
    //     if (go === 43) go = 100;
    //     const arrow2 = yutRefs.current.find(s => s.classList[0] === "arrowIndex" + go);
    //     arrow2.style.display = "block";
    //   }
    // }, 0); // 상태가 업데이트된 후 바로 실행
  }


  //기본 땅 밟을 시 이벤트
  const defaultStateEvent = (index) => {
    const ele = yutIndexRefs.current.find(s => s.classList[0] === "YutState" + index);
    if (ele?.classList[2] === undefined) {
      //땅 주인 없을 떄
      // 모달 창 띄우기
      BuyEstateHandleClickOpen()

    } else {
      //땅 주인 있을떄
      const owner = ele?.classList[2]
      //땅 주인이 나라면
      if (myPlayer === owner) {
        players[myPlayer].estate.map((item) => {
          if (item.location === players[myPlayer].index) {
            setUpgradeLevel(item.landmark);
          }
        });

        UpgradeEstateHandleClickOpen()

        //땅 주인이 내가 아니면
      } else {
        //통행료 내기
        console.log((players[myPlayer].money - yutStates.find(states => states.YutIndex === parseInt(index)).price * 1.5));
        updatePlayer(myPlayer, {money: (players[myPlayer].money - yutStates.find(states => states.YutIndex === parseInt(index)).price * 1.5)});
        updatePlayer(owner, {money: (players[owner].money + yutStates.find(states => states.YutIndex === parseInt(index)).price * 1.5)});
      }

    }
  }

  const BuyEstateHandleClickOpen = () => {
    setBuyEstateOpen(true);
  };

  const BuyEstateHandleClose = (result) => {
    setBuyEstateOpen(false);

    if (result) {
      client.send(
        `/app/main/buyEstate/${roomId}`,
        {
          name: myPlayer,
          location: players[myPlayer].index,
          price : yutStates.find(states => states.YutIndex === parseInt(players[myPlayer].index)).price,
        }, // 헤더 설정
        JSON.stringify({message: "buy this"})
      );

      // updatePlayer(myPlayer, {money: players[myPlayer].money - yutStates.find(states => states.YutIndex === parseInt(players[myPlayer].index)).price});
      // if (players[myPlayer].estate) {
      //   updatePlayer(myPlayer, {
      //     estate: [
      //       ...players[myPlayer].estate,
      //       {
      //         location: players[myPlayer].index,
      //         landmark: 1,
      //       }]
      //   });
      // } else {
      //   updatePlayer(myPlayer, {
      //     estate: [
      //       {
      //         location: players[myPlayer].index,
      //         landmark: 1,
      //       }]
      //   });
      // }
    }
  };

  const UpgradeEstateHandleClickOpen = () => {
    setUpgradeEstateOpen(true);
  };

  const UpgradeEstateHandleClose = (result) => {
    setUpgradeEstateOpen(false);

    if (result) {
      client.send(
        `/app/main/upgradeEstate/${roomId}`,
        {
          name: myPlayer,
          location: players[myPlayer].index,
          price : yutStates.find(states => states.YutIndex === parseInt(players[myPlayer].index)).price,
        }, // 헤더 설정
        JSON.stringify({message: "upgrade this"})
      );

      // const updateEstate = players[myPlayer].estate.map((item) => {
      //   if (item.location === players[myPlayer].index) {
      //     if (item.landmark === 3) {
      //       alert("toast 더 이상 업글 못함")
      //       return item;
      //     }
      //     console.log("item.landmark : " + item.landmark);
      //     return {...item, landmark: item.landmark + 1};
      //   }
      //   return item;
      // })
      // updatePlayer(myPlayer, {estate: updateEstate});
    }
  };


  const playerStyles = Object.keys(players).map((key) => {
    return {
      position: "absolute",
      width: 40,
      zIndex: 4,
      pointerEvents: "none",
      top: players[key].top - 5,
      left: players[key].left,
      display: "block",
      scale: "0.8",
      filter: `drop-shadow(0px 0px 3px ${players[key].color})`
    };
  });


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
        <div style={{fontSize: "20px", position: "absolute", top: "10%"}} onClick={passTurn}>pass turn</div>


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
              {/*<span style={playerNameStyle}>{player.name}</span>*/}
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
              setMyPlayer(player.player);
            }}>
              <img src={player.avatar} alt={player.name} width={50}/>
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

    <BuyEstateConfirmDialog open={BuyEstateOpen} onClose={BuyEstateHandleClose}/>

    <UpgradeEstateConfirmDialog open={UpgradeEstateOpen} onClose={UpgradeEstateHandleClose} level={UpgradeLevel}/>

  </div>
}


export default YutPan;
