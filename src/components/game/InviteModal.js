"use client";
import React, {useEffect, useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from "@mui/material";
import Button from "@mui/material/Button";
import apiAxiosInstance from "@/hooks/apiAxiosInstance";

const InviteModal = ({open, onClose, userId, client, roomId}) => {
  const [jwt, setJwt] = useState(null);
  useEffect(() => {
    setJwt(localStorage.getItem('custom-auth-token'));
  }, [jwt]);
  const [userData, setUserData] = useState(null);
  const [friendList, setFriendList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getUserData(jwt) {
    try {
      const response = await apiAxiosInstance.get(`/user/${jwt}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function getFriendList(jwt) {
    if (jwt) {
      setLoading(true);  // 로딩 시작
      try {
        const response = await apiAxiosInstance.get(`/friend/list/${jwt}`);
        setFriendList(response.data);
      } catch (e) {
        console.error('친구 목록을 불러오는 데 실패했습니다:', e);
      } finally {
        setLoading(false);  // 로딩 종료
      }
    }
  }

  useEffect(() => {
    if (jwt) {
      getUserData(jwt)
        .then(data => setUserData(data))
        .catch(error => console.error('사용자 데이터 로드 실패:', error));

      getFriendList(jwt); // 친구 목록 불러오기
    }
  }, [jwt]);

  // 초대하기 버튼 클릭 시 실행할 함수
  const handleInviteClick = (friendId) => {
    console.log(`초대된 사용자 ID: ${friendId}`);

    if (client && client.connected) {
      // 초대 메시지를 서버로 전송
      client.send(`/app/chat.inviteUser/${friendId}`, {}, JSON.stringify({
        sender: userData.user_id,   // 초대한 사용자 ID
        type: 'INVITE',             // 메시지 타입은 초대
        roomId: roomId,             // 방 ID
        invitedUserId: friendId,    // 초대받는 사용자 ID (여기서 friendId가 null이 아니어야 함)
      }));

    }
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          borderRadius: '15px',
          padding: '20px',
          backgroundColor: '#f7f9fc',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          textAlign: 'center',
          color: '#ff6f61',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          borderBottom: '1px solid #ececec',
          paddingBottom: '10px',
        }}
      >
        {"친구목록"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{
            textAlign: 'center',
            color: '#333',
            fontSize: '1.2rem',
            margin: '20px 0',
          }}
        >
          {/* 로딩 중일 때 */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            friendList && friendList.length > 0 ? (
              <Grid container spacing={2}> {/* Grid 컨테이너 추가 */}
                {friendList.map((friend, index) => (
                  <Grid item xs={12} key={index} container alignItems="center" justifyContent="center">
                    <Grid item xs={6} style={{textAlign: 'center'}}> {/* 이름 영역 */}
                      <span>{friend.nickname}</span>
                    </Grid>
                    <Grid item xs={6} style={{textAlign: 'center'}}> {/* 버튼 영역 */}
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: '#ff8a65',
                        }}
                        onClick={() => handleInviteClick(friend.userId)} // friend.userId를 전달
                      >
                        초대
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <div>No friends found</div>
            )
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{justifyContent: 'center'}}>
        <Button
          color="primary"
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#ff6f61',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#ff8a65',
            },
            padding: '8px 20px',
            borderRadius: '25px',
            fontWeight: 'bold',
          }}
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteModal;
