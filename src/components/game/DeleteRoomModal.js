import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";

const DeleteRoomModal = ({ open, onClose, confirm }) => {
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
        로비를 삭제하시겠습니까?
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
          예를 누를 시 즉시 로비가 삭제됩니다
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
          예
        </Button>
        <Button 
            color='secondary'
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
            }}>
          아니오
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRoomModal;