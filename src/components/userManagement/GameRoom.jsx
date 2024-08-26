"use client";

import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, styled } from "@mui/material";
import FlexBox from "../FlexBox";
import UserCard from "./UserCard";
import { useState, useEffect } from "react";
import AddNewUser from "./AddNewUser";
import axios from "axios";

// styled component
const StyledFlexBox = styled(FlexBox)(({ theme }) => ({
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: 20,
  [theme.breakpoints.down(500)]: {
    width: "100%",
    "& .MuiInputBase-root": { maxWidth: "100%" },
    "& .MuiButton-root": {
      width: "100%",
      marginTop: 15,
    },
  },
}));

const GameRoom = () => {
  const [open, setOpen] = useState(false);
  const [userList, setUserList] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios.get('/api/game/room/ready')
      .then(response => {
        const data = response.data; // 응답 데이터 가져오기
        console.log('게임방 데이터:', data);

        const users = data.map(item => ({
          name: item.user.nickname,
          roomName: item.room_name,
          seedMoney: item.budget,
          fullMember: item.tot_player,
          currentMember: item.curr_player,
          roomCode: item.room_id,
          cover: item.user.profilePicture,
        }));

        setUserList(users);
      })
      .catch(error => {
        console.error('문제가 발생했습니다:', error);
      });
  }, []);

  return (
    <Box pb={4}>
      <StyledFlexBox>
        <Button fullWidth={true} variant="contained" onClick={handleClickOpen}>
          방 만들기
        </Button>
      </StyledFlexBox>

      <Grid container spacing={3}>
        {userList.map((user, index) => (
          <Grid item md={4} sm={6} xs={12} key={index}>
            <UserCard user={user} />
          </Grid>
        ))}
      </Grid>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle sx={{ fontSize: "21px", padding: "20px 30px 0" }}>방 만들기</DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <AddNewUser />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GameRoom;