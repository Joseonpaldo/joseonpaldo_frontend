// noinspection BadExpressionStatementJS

import {useEffect, useRef, useState} from "react";
import useWindowSizeCustom from "../../hooks/useWindowSizeCustom.js";
import {yutStates} from "./YutStates.js"
import {useParams} from "react-router";

function YutPan() {
    console.log("YutPan render");
    document.querySelector("body").style.backgroundImage = `url("https://trello.com/1/cards/668e1ac952d3e586a8e1e1c4/attachments/668f29b92b3b2af3e4a6568e/previews/668f29ba2b3b2af3e4a658b7/download/%E2%80%94Slidesdocs%E2%80%94%E1%84%92%E1%85%A1%E1%86%AB%E1%84%80%E1%85%AE%E1%86%A8_%E1%84%89%E1%85%A5%E1%86%AF%E1%84%82%E1%85%A1%E1%86%AF_%E1%84%92%E1%85%AA%E1%86%BC%E1%84%80%E1%85%B3%E1%86%B7_%E1%84%89%E1%85%A2%E1%84%92%E1%85%A2_%E1%84%8E%E1%85%A1%E1%86%BC%E1%84%8B%E1%85%B4_de170aa169.jpg")`;
    document.querySelector("body").style.backgroundRepeat = 'no-repeat';
    document.querySelector("body").style.backgroundSize = 'cover';
    document.querySelector("html").style.overflow = 'hidden';

    const [yutThrowImageSrc, setYutThrowImageSrc] = useState("/image/yut1.gif");
    const [yutThrowImageDisplay, setYutThrowImageDisplay] = useState("none");
    const [yutThrowAble, setYutThrowAble] = useState(true);
    const windowSizeCustom = useWindowSizeCustom();


    const [player1Top, setPlayer1Top] = useState(356.11);
    const [player1Left, setPlayer1Left] = useState(356.31);
    const [player1Index, setPlayer1Index] = useState(0);
    const [player1Direction, setPlayer1Direction] = useState("scaleX(1)");


    const [resultArr, setResultArr] = useState([]);
    const [resultDelIndex, setResultDelIndex] = useState(null);


    const yutRefs = useRef([]);

    // YutState에 ref를 할당
    useEffect(() => {
        yutRefs.current = yutRefs.current.slice(0, yutStates.length);
    }, []);

    const {roomId} = useParams();

    const [socket, setSocket] = useState(null);
    useEffect(() => {

        const ws = new WebSocket("ws://localhost:8080/commend/" + roomId);

        ws.onopen = (data) => {
            console.log('commend connected');
        };

        ws.onmessage = (data) => {
            console.log(data);
            const onMessage = JSON.parse(data.data);
            if (onMessage.type === "message") {
                console.log(onMessage.msg)
            }
        }

        ws.onclose = () => {
            console.log('commend disconnected');
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [roomId]);


    const sendCommand = (command) => {
        if (socket && socket.readyState === WebSocket.OPEN) { // WebSocket이 열려 있는지 확인
            let option = {
                type: "command",
                roomNumber: roomId,
                command: command
            };
            socket.send(JSON.stringify(option))
        }
    };


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

            sendCommand("ThrowYut")

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
        const arrows = document.getElementsByClassName("arrowIndex")
        for (let i = 0; i < arrows.length; i++) {
            arrows[i].style.display = "none"
        }
    }

    const arrowClick = (index) => {
        const YutData = yutStates.find(states => states.YutIndex === parseInt(index))
        console.log(YutData)
        setPlayer1Top(parseInt(YutData?.top, 10))
        setPlayer1Left(parseInt(YutData?.left, 10))
        setPlayer1Index(parseInt(index, 10));
        if ((index >= 0 && index <= 9) || index === "22" || index === "23") {
            setPlayer1Direction("scaleX(1)")
        } else {
            setPlayer1Direction("scaleX(-1)")
        }
        arrowDisplayNone()
        resultArrDelete(resultDelIndex)
    }

    if (resultArr.length > 0) {
    }

    const resultArrDelete = (index) => {
        setResultArr((current) => {
            const newArray = [...current];
            newArray.splice(index, 1);
            return newArray;
        });
    }

    const resultUseClick = (item, index) => {
        arrowDisplayNone()
        setResultDelIndex(index)
        let moveIndex = player1Index + item;
        if (player1Index === 100) {
            let go1 = (33 + item);
            if (go1 > 36) go1 = go1 - 36 + 17;
            const arrow1 = document.getElementsByClassName("arrowIndex" + go1)[0];
            arrow1.style.display = "block";

            let go2 = (43 + item);
            if (go2 > 46) go2 = go2 - 47;
            const arrow2 = document.getElementsByClassName("arrowIndex" + go2)[0];
            arrow2.style.display = "block";
            return;
        }


        // 크게 한바퀴 돌았을때
        if (moveIndex >= 24 && player1Index <= 23) {
            moveIndex -= 24
        }

        if (player1Index >= 30 && player1Index <= 36 && moveIndex > 36) {
            moveIndex = moveIndex - 37 + 18;
        }

        if (player1Index >= 40 && player1Index <= 46 && moveIndex > 46) {
            moveIndex = moveIndex - 47;
        }

        // 중앙
        if (moveIndex === 33 || moveIndex === 43) {
            moveIndex = 100;
        }
        console.log(moveIndex);

        const arrow1 = document.getElementsByClassName("arrowIndex" + moveIndex)[0];
        arrow1.style.display = "block";

        if (player1Index === 6) {
            let go = (item + 29);
            if (go === 33) go = 100;
            const arrow2 = document.getElementsByClassName("arrowIndex" + go)[0];
            arrow2.style.display = "block";
        }
        if (player1Index === 12) {
            let go = (item + 39);
            if (go === 43) go = 100;
            const arrow2 = document.getElementsByClassName("arrowIndex" + go)[0];
            arrow2.style.display = "block";
        }


    }


    const YutName = {
        position: "absolute",
        top: "-32px",
        opacity: 1,
        left: "-25px",
        fontSize: "1px",
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

    // const StateBuildStyle = {
    //     position: "absolute",
    //     top: 0,
    //     left: 0,
    //     backgroundRepeat: 'no-repeat',
    //     backgroundSize: 'cover',
    //     width: 40,
    //     height: 23,
    //     transform: "translate(-40%, -40%)",
    //     pointerEvents: "none",
    //     scale: "1.5",
    // }

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
        top: windowSizeCustom.height / 2 + 30,
        left: windowSizeCustom.width / 2 + 30,
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
        backgroundImage: `url("/image/Btthrow.normal.0.png")`,
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

    const player1Style = {
        position: "absolute",
        width: 40,
        zIndex: 4,
        pointerEvents: "none",
        top: player1Top - 10,
        left: player1Left + 2,
        display: "block",
    }

    const arrowStyle = {
        position: "absolute",
        width: 20,
        height: 30,
        display: "none",
    }


    const YutState = ({name, left, top, border, onMouseOver, onMouseOut}) => {
        return (
            <div
                className="YutState"
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                style={{
                    ...YutStateStyle,
                    left: left,
                    top: top,
                    border: border,
                }}
            >
                <div style={YutName} className="yutName">{name}</div>
            </div>
        );
    };


    const Arrow = ({index, left, top, onMouseOver, onMouseOut, onClick}) => {
        return (
            <div
                className={`arrowIndex${index} arrowIndex`}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
                style={{
                    ...arrowStyle,
                    left: left + 10,
                    top: top - 35,
                }}
            >
                <img src="/image/underArrow.png" alt=""/>
            </div>
        );
    };


    return <div style={YutPanStyle}>
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


            <div className="player player1"
                 style={player1Style}
            >
                <img src="/image/pinkbin.png" alt="핑크빈" width="92" height="88" style={{transform: player1Direction,}}/>
                <span>민석이</span>
            </div>

            {
                yutStates.map((state) => (
                    <YutState
                        key={`yutState-${state.YutIndex}`}
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
}

export default YutPan;