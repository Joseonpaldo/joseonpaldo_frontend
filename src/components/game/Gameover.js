import React, { useEffect, useState } from 'react';
import './Gameover.css';
import apiAxiosInstance from "@/hooks/apiAxiosInstance";

const Gameover = ({ players }) => {
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);

  let playersOb = Object.values(players)

  // 모든 플레이어의 userId를 기반으로 데이터를 불러오는 함수
  useEffect(() => {
    let userData = [];
    playersOb.forEach((player) => {
      apiAxiosInstance.get(`/userinfor/${player.userId}`).then((response) => {
        userData.push({
          nickname : response.da.nickname,
          win2p : response.da.win2p,
          winRate2p : response.da.winRate2p,
          tot2p : response.da.tot2p,
        });
        console.log(response.data)
      })
    })

    console.log("userData " + userData);

    if (userData.length === 4) {
      setUserStats(userData)
      setLoading(false)
    }

  }, [players]);


  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!players || players.length === 0) {
    return <h2>게임 정보가 없습니다</h2>;
  }

  return (
    <div className="gameover-container">

      <div className="rank-section">
        <h2>Game Over</h2>
        <table className="rank-table">
          <thead>
          <tr>
            <th>순위</th>
            <th>이름</th>
            <th>승리</th>
            <th>패배</th>
            <th>승률</th>
            <th>총 플레이</th>
          </tr>
          </thead>
          <tbody>
          {players.map((player, index) => {
            // 정확한 userId로 데이터 찾기
            const userStat = userStats.find(stat => stat.userId === player.userId);

            return (
              <tr key={index}>
                <td>{index + 1}</td> {/* 순위 */}
                <td>{userStat ? userStat.nickname : 'N/a'}</td> {/* 이름 */}
                <td>{userStat ? userStat.win2p : 'N/A'}</td>
                <td>{userStat ? userStat.tot2p - userStat.win2p : 'N/A'}</td>
                <td>{userStat ? userStat.winRate2p : 'N/A'}%</td>
                <td>{userStat ? userStat.tot2p : 'N/A'}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>

      <div className="reward-section">
        {players[0].win ? (
          <h3>{players[0].name}님이 승리했습니다!</h3>
        ) : (
          <h3>{players[0].name}님이 패배했습니다.</h3>
        )}
      </div>
    </div>
  );
};

export default Gameover;

