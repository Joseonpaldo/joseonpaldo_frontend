"use client";
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import apiAxiosInstance from "@/hooks/apiAxiosInstance";

const FriendTo = ({ open, onClose, userId, friendId, senderNickname }) => { // handleAcceptInvite 받아오기


  const acceptInvite = async () => {
    try {
      // 친구 요청 수락 API 호출
      const response = await apiAxiosInstance.put(`/friend/add/${userId}/${friendId}`);
      console.log('친구 추가 성공:', response.data);
      onClose(); // 모달 닫기
    } catch (error) {
      console.log("1" + userId + "2" + friendId);
      console.error('친구 추가 실패:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="invite-dialog-title"
      aria-describedby="invite-dialog-description"
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
        id="invite-dialog-title"
        sx={{
          textAlign: 'center',
          color: '#ff6f61',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          borderBottom: '1px solid #ececec',
          paddingBottom: '10px',
        }}
      >
        친구 수락
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="invite-dialog-description"
          sx={{
            textAlign: 'center',
            color: '#333',
            fontSize: '1.2rem',
            margin: '20px 0',
          }}
        >
          {senderNickname}님이 친구요청을 보냈습니다.
          <br />
          수락하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          color="primary"
          onClick={acceptInvite} // 수락 시 API 호출
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
          예
        </Button>
        <Button
          color="primary"
          onClick={onClose} // 모달 닫기
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
          아니요
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FriendTo;
