"use client"

import {Button, colors, Input} from "@mui/material";
import useWindowSizeCustom from "../../hooks/useWindowSizeCustom.js";
import {useRef, useState} from "react";
import {useParams} from "next/navigation";
import {Box} from "@mui/system";
import {ChatCircleDots, X} from "@phosphor-icons/react";

export default function ChatComponent() {

  const {roomId} = useParams();
  const inputRef = useRef(null);

  const [socket, setSocket] = useState(null);

  const chattingBaseRef = useRef(null);
  const chattingIconRef = useRef(null);

  const chatAreaRef = useRef(null);


  const inputSend2 = () => {
    const inputElement = inputRef.current?.querySelector("input");
    const value = inputElement.value;
    inputElement.value = ""; // 입력 필드의 값을 직접 변경
  };

  const chattingClose = () => {
    chattingBaseRef.current.style.right = "-300px";
    chattingIconRef.current.style.right = "20px";
  }

  const chattingOpen = () => {
    chattingBaseRef.current.style.right = "20px";
    chattingIconRef.current.style.right = "-200px";
  }


  const windowSize = useWindowSizeCustom();

  const chatStyle = {
    position: "absolute",
    right: -300,
    bottom: `${windowSize.height / 2}px`,
    transform: "translateY(50%)",
    width: 300,
    height: 300,
    overflow: "hidden",
    borderRadius: "5%",
    transition: "0.3s ease-out",
  }

  const InputForm = {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "20%",
  }

  const InnerChat = {
    position: "absolute",
    width: "100%",
    height: "80%",
  }

  const chattingIcon = {
    position: "absolute",
    width: 55,
    height: 55,
    right: 20,
    bottom: `${windowSize.height / 2}px`,
    transition: "0.3s ease-out",
    textShadow: "1px 1px black",
    backgroundColor: colors.brown["300"],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "20%",
  }

  const OpponentChatLog = ({profile, nickname, chat, index}) => {
    return (
      <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}} key={`opponentChatLog${index}`}>
        <Box
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: colors.brown["300"],
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          <img src={profile} alt={nickname} width="100%"/>
        </Box>
        <div style={{
          backgroundColor: colors.brown["400"],
          color: 'white',
          padding: '8px 14px', // px-4 py-2
          borderRadius: '8px', // rounded-lg
          maxWidth: '75%',
        }}>
          <p style={{fontWeight: '700', margin: 0,}}>{nickname}</p>
          <p style={{margin: 0,}}>{chat}</p>
        </div>
      </div>
    );
  };


  const MyChatLog = ({profile, nickname, chat, index}) => {
    return (
      <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px', justifyContent: 'flex-end'}}
           key={`myChatLog${index}`}>
        <div style={{
          backgroundColor: colors.brown["100"],
          color: '#1a202c', // text-gray-900
          padding: '8px 14px', // px-4 py-2
          borderRadius: '8px', // rounded-lg
          maxWidth: '75%',
        }}>
          <p style={{fontWeight: '700', margin: 0,}}>{nickname}</p>
          <p style={{margin: 0,}}>{chat}</p>
        </div>
        <Box
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: colors.brown["300"],
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: "hidden"
          }}>
          <img src={profile} alt={nickname} width="100%"/>
        </Box>
      </div>
    );
  };


  return (
    <div>
      <div style={chatStyle} ref={chattingBaseRef}>
        <X size={24}
           color="#ff0000"
           onClick={chattingClose}
           style={{
             position: "absolute",
             right: 10,
             top: 5,
             zIndex: 1,
           }}/>
        <div style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
        }}>
          <div style={{
            ...InnerChat,
            flex: 1,
            overflowY: "auto",
            padding: "1rem", // p-4는 1rem에 해당
          }}>
            <div style={{
              display: "flex",
              gap: "12px",
              flexDirection: "column",
              fontSize: "14px"
            }}
                 ref={chatAreaRef}
            >


            </div>
          </div>
          <div style={{
            ...InputForm,
            backgroundColor: "white",         // bg-white
            borderTop: "1px solid #e5e7eb",   // border-t (gray-200)
            padding: "1rem",                  // p-4
            display: "flex",                  // flex
            alignItems: "center",
          }}>
            <Input
              placeholder="채팅 입력하기..."
              style={{
                flex: 1,                          // flex-1
                // backgroundColor: "#000000",       // bg-gray-000 (색상 코드)
                border: "none",                   // border-none
                outline: "none",                  // focus:outline-none
                boxShadow: "none",                // focus:ring-0 (테두리 그림자 없음)
              }}
              ref={inputRef}
            />
            <Button variant="solid"
                    style={{
                      backgroundColor: colors.brown["500"],
                      color: "white",
                      marginLeft: "0.5rem",
                    }}
                    onClick={inputSend2}>
              Send
            </Button>
          </div>
        </div>
      </div>
      <div style={chattingIcon} ref={chattingIconRef} onClick={chattingOpen}><ChatCircleDots size={45} color="white"
                                                                                             weight="fill"/></div>
    </div>
  )

}
