import {Button, Input} from "@mui/material";
import useWindowSizeCustom from "../../hooks/useWindowSizeCustom.js";
import {useParams} from "react-router";
import {useEffect, useRef, useState} from "react";

export default function ChatComponent() {

    const {roomId} = useParams();
    const inputRef = useRef(null);

    const [socket, setSocket] = useState(null);


    const [myJWT, setMyJWT] = useState("");
    useEffect(() => {
        const getJWT = window.localStorage.getItem("accessToken").toString();
        setMyJWT(getJWT);
    }, []);


    useEffect(() => {

            const ws = new WebSocket("ws://localhost:8080/chat/" + roomId);

            ws.onopen = (data) => {
                console.log('chat connected');
            };

            ws.onmessage = (data) => {
                console.log(data);
                const onMessage = JSON.parse(data.data);
                if (onMessage.type === "message") {
                    console.log(onMessage.msg)
                }
            }

            ws.onclose = () => {
                console.log('chat disconnected');
            };

            setSocket(ws);

            return () => {
                ws.close();
            };
        }, [roomId]);


    const inputSend2 = () => {
        const inputElement = inputRef.current?.querySelector("input");
        const value = inputElement.value;
        if (value.length > 0) {
            let option = {
                type: "message",
                roomNumber: roomId,
                msg: value,
                jwt: myJWT,
            };
            socket.send(JSON.stringify(option))
            inputElement.value = ""; // 입력 필드의 값을 직접 변경
        }
    };


    const windowSize = useWindowSizeCustom();

    const chatStyle = {
        position: "absolute",
        right: 20,
        bottom: windowSize.height / 2,
        transform: "translateY(50%)",
        width: 300,
        height: 300,
        overflow: "hidden",
        borderRadius: "5%",
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

    return (
        <div style={chatStyle}>
            <div className="flex flex-col h-full bg-white">
                <div className="flex-1 overflow-y-auto p-4" style={InnerChat}>
                    <div className="space-y-4">
                        {/*<div className="flex items-start gap-3">*/}
                        {/*    <Box*/}
                        {/*        className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">*/}
                        {/*    </Box>*/}
                        {/*    <div className="bg-green-500 text-white px-4 py-2 rounded-lg max-w-[75%]">*/}
                        {/*        <p className="font-medium">John Doe</p>*/}
                        {/*        <p>Hey, I have a used laptop for sale. Interested?</p>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className="flex items-start gap-3 justify-end">*/}
                        {/*    <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg max-w-[75%]">*/}
                        {/*        <p className="font-medium">Jane Smith</p>*/}
                        {/*        <p>Sure, what are the specs and how much are you asking for it?</p>*/}
                        {/*    </div>*/}
                        {/*    <Box*/}
                        {/*        className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">*/}
                        {/*    </Box>*/}
                        {/*</div>*/}
                        {/*<div className="flex items-start gap-3">*/}
                        {/*    <Box*/}
                        {/*        className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">*/}
                        {/*    </Box>*/}
                        {/*    <div className="bg-green-500 text-white px-4 py-2 rounded-lg max-w-[75%]">*/}
                        {/*        <p className="font-medium">John Doe</p>*/}
                        {/*        <p>It's a 2-year-old Dell laptop with an i5 processor, 8GB RAM, and a 256GB SSD. I'm*/}
                        {/*            asking for $400.</p>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className="flex items-start gap-3 justify-end">*/}
                        {/*    <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg max-w-[75%]">*/}
                        {/*        <p className="font-medium">Jane Smith</p>*/}
                        {/*        <p>Sounds good, I'll take it. When and where can we meet?</p>*/}
                        {/*    </div>*/}
                        {/*    <Box*/}
                        {/*        className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">*/}
                        {/*    </Box>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="bg-white border-t border-gray-200 p-4 flex items-center" style={InputForm}>
                    <Input
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-000 border-none focus:ring-0 focus:outline-none"
                        ref={inputRef}
                    />
                    <Button variant="solid" className="bg-green-500 hover:bg-green-600 text-white ml-2"
                            onClick={inputSend2}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    )

}
