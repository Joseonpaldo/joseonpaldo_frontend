import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";

const Modal = ({ open, onClose }) => {
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
        {"입장불가"}
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
          방이 이미 가득 찼습니다.
          <br />
          다른 방을 선택해 주세요.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
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

export default Modal;
