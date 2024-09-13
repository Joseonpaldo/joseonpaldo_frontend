
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";

const DeleteRoomModal = ({ open, onClose, confirm }) => {
    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose(event, reason);
        }
      };
  
    return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        로비 삭제
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
          성공적으로 삭제했습니다
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>

        <Button
          color="primary"
          onClick={confirm}
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
            브라우저 종료
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default DeleteRoomModal;