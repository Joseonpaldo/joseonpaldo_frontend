import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import apiAxiosInstance from '@/hooks/apiAxiosInstance';
import "./InforModal.css";

const InforModal = ({ open, onClose, userId }) => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);  // 로딩 상태

  // userId로 정보 가져오기
  useEffect(() => {
    if (userId) {
      const fetchUserInfo = async () => {
        try {
          const response = await apiAxiosInstance.get(`/userinfor/${userId}`);
          if (response.data) {
            setUserStats(response.data);  // 유저 정보 설정
          } else {
            console.error('No data received from server');
          }
        } catch (err) {
          console.error('Error fetching user information:', err);
        } finally {
          setLoading(false);  // 로딩 완료
        }
      };

      fetchUserInfo();
    }
  }, [userId]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle><h3>{userStats ? `${userStats.nickname}님의 정보` : '유저 정보'}</h3></DialogTitle> {/* 조건부 렌더링 */}
      <DialogContent>
        {loading ? (
          <DialogContentText>데이터를 불러오는 중입니다...</DialogContentText>
        ) : userStats ? (
          <div className="informodal-content">
            <div className="informodal-stats-table">
              <h3>2인 플레이</h3>
              <table className="informodal-table">
                <tr>
                  <td className="informodal-td-label">승리: {userStats.win2p}</td>
                </tr>

                <tr>
                  <td className="informodal-td-label">패배: {userStats.tot2p - userStats.win2p}</td>
                </tr>
                <tr>
                  <td className="informodal-td-label">승률: {userStats.winRate2p}%</td>
                </tr>
                <tr>
                  <td className="informodal-td-label">총 플레이: {userStats.tot2p}</td>
                </tr>
              </table>
            </div>

            <div className="informodal-stats-table">
              <h3>4인 플레이</h3>
              <table className="informodal-table">
                <tr>
                  <td className="informodal-td-label">승리: {userStats.win4p}</td>
                </tr>
                <tr>
                  <td className="informodal-td-label">패배: {userStats.tot4p - userStats.win4p}</td>
                </tr>
                <tr>
                  <td className="informodal-td-label">승률: {userStats.winRate4p}%</td>
                </tr>
                <tr>
                  <td className="informodal-td-label">총 플레이: {userStats.tot4p}</td>
                </tr>
              </table>
            </div>
          </div>
        ) : (
          <DialogContentText>데이터를 가져오는데 실패했습니다.</DialogContentText>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}
        style={{backgroundColor: '#ff8a65', color: 'white'}}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InforModal;
