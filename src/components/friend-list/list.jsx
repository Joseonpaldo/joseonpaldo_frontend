'use client';

import apiAxiosInstance from '@/hooks/apiAxiosInstance';
import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from '@stomp/stompjs';
// import OneToOneChat from './oneToOneChat';


export default function List() {
    const jwt = localStorage.getItem('custom-auth-token');

    const [userData, setUserData] = useState(null);
    
    //친구 리스트와 한마리
    const [friendList, setFriendList] = useState([]);
    const [oneFriend, setOneFriend] = useState(null);

    //채팅창
    const [isChatRoom, setIsChatRoom] = useState(false);

    //친구추가 검사
    const [checkFriend, setCheckFriend] = useState(false);

    const [unreadMessages, setUnreadMessages] = useState({});  // 친구별 미확인 메시지 수
    const [stompClient, setStompClient] = useState(null);      // STOMP 클라이언트

    async function getUserData(jwt){
        try{
            const response = await apiAxiosInstance.get(`/user/${jwt}`);
            return response.data;
        } catch(error){
            throw error;
        }
    }

    async function getFriendList(){
        
        if(jwt != null){
            await apiAxiosInstance.get(`/friend/list/${jwt}`)
            .then(res => {
                const list = [];
                res.data.map((e, idx) => {
                    list.push(e);
                })
                setFriendList([...list]);
            })
            .catch(e => console.error(e));
        }        
    }

    function friendButton(friend) {
        if(friend != oneFriend){
            setIsChatRoom((prev) => !prev);
        }
        setOneFriend(friend);
        console.log("일단 눌리긴함")
    }

    useEffect(() => {
        const jwt = localStorage.getItem('custom-auth-token');
        if (jwt) {
          getUserData(jwt)
            .then(data => setUserData(data))
            .catch(error => console.error('사용자 데이터 로드 실패:', error));
        }
      }, []);

    return (
        //깡통 없애면 클남 div하나로 묶어준거
        <>
        <button onClick={getFriendList}>친구창</button>
        <div >
            <ul>
                {
                    friendList.map((item, idx)=>{
                        return(<li key={idx}>
                                <button onClick={()=>friendButton(item)}>{item.userId} : {item.nickname}</button>
                                <button>삭제</button>
                            </li>)
                    })
                }
            </ul>
        </div>
        
        {
           isChatRoom && (
            <></>
           )
        }
        </>
    );
}