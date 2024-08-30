"use client"


import * as React from "react";
import apiAxiosInstance from "@/hooks/apiAxiosInstance";

export default function Winner() {


  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    margin: '0 10px',
    textAlign: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    flex: '1',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const avatarStyle = {
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    marginBottom: '10px',
  };

  const rankStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '10px',
  };
  const players = [
    {
      id: 'USR-010',
      name: 'Alcides Antonio',
      avatar: '/assets/avatar-10.png',
      fourPlay: 60,
      fourPlayWin: 12

    },
    {
      id: 'USR-009',
      name: 'Marcus Finn',
      avatar: '/assets/avatar-9.png',
      fourPlay: 60,
      fourPlayWin: 12
    },
    {
      id: 'USR-008',
      name: 'Jie Yan',
      avatar: '/assets/avatar-8.png',
      fourPlay: 60,
      fourPlayWin: 12
    },
  ];


  async function getTop3User() {
    try {
      // const response = await apiAxiosInstance.get(`/rank/top3`);
      return response.data; // 응답 데이터 반환
    } catch (error) {
      console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
      throw error; // 오류를 다시 던져서 호출자에게 알림
    }
  }


  return <div style={containerStyle}>
    <div style={{...cardStyle}}>
      <img
        src={`${players[1].avatar}`}
        alt={"win2"}
        style={{...avatarStyle, border: '10px solid #C0C0C0',}}
      />
      <h3>{`${players[1].name}`}</h3>
      <div style={rankStyle}>{2}</div>
    </div>

    <div style={{...cardStyle}}>
      <img
        src={`${players[0].avatar}`}
        alt={"win1"}
        style={{...avatarStyle, border: '10px solid #FFD700',}}
      />
      <h3>{`${players[0].name}`}</h3>
      <div style={rankStyle}>{1}</div>
    </div>

    <div style={{...cardStyle}}>
      <img
        src={`${players[2].avatar}`}
        alt={"win3"}
        style={{...avatarStyle, border: '10px solid #cd7f32',}}
      />
      <h3>{`${players[2].name}`}</h3>
      <div style={rankStyle}>{3}</div>
    </div>
  </div>
}
