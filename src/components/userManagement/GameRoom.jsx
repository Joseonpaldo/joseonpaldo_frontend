"use client";

import {Box, Button, Dialog, DialogContent, DialogTitle, Grid, styled} from "@mui/material";
import FlexBox from "../FlexBox";
import UserCard from "./UserCard";
import * as React from "react";
import {useEffect, useState} from "react";
import AddNewUser from "./AddNewUser";
import apiAxiosInstance from "@/hooks/apiAxiosInstance";
import {usePathname, useRouter} from "next/navigation";


// styled component
const StyledFlexBox = styled(FlexBox)(({theme}) => ({
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: 20,
  [theme.breakpoints.down(500)]: {
    width: "100%",
    "& .MuiInputBase-root": {maxWidth: "100%"},
    "& .MuiButton-root": {
      width: "100%",
      marginTop: 15,
    },
  },
}));


const GameRoom = () => {
  const [open, setOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [apiURL, setApiURL] = useState(null);

  const router = useRouter();

  const path = usePathname();
// 경로가 변경될 때 apiURL을 업데이트
  useEffect(() => {
    if (path === "/start-game-room") {
      setApiURL('/game/room/start');
    } else {
      setApiURL('/game/room/ready');
    }
  }, [path]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (apiURL === null) return;
    apiAxiosInstance.get(apiURL)
      .then(response => {
        const data = response.data; // 응답 데이터 가져오기
        console.log('게임방 데이터:', data);

        const users = data.map(item => ({
          name: item.user.nickname,
          roomName: item.roomName,
          seedMoney: item.budget,
          fullMember: item.totPlayer,
          currentMember: item.currPlayer,
          roomCode: item.roomId,
          cover: item.user.profilePicture,
        }));

        setUserList(users);
      })
      .catch(error => {
        console.error('문제가 발생했습니다:', error);
      });
  }, [apiURL]);

  return (
    <Box pb={4}>
      <StyledFlexBox>
        {/* path가 "/start-game-room"이 아닐 때만 버튼을 표시 */}
        {path !== "/start-game-room" && (
          <>
            <Button fullWidth={true} variant="contained" onClick={handleClickOpen}>
              방 만들기
            </Button>
            <Button variant="contained" onClick={() => router.push('/start-game-room')}
                    sx={{position: "absolute", right: "26px", top: "90px"}}>진행 중</Button>
          </>
        )}


      </StyledFlexBox>

      <Grid container spacing={3}>
        {userList.map((user, index) => (
          <Grid item md={4} sm={6} xs={12} key={index}>
            <UserCard user={user}/>
          </Grid>
        ))}
      </Grid>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle sx={{fontSize: "21px", padding: "20px 30px 0"}}>방 만들기</DialogTitle>
        <DialogContent sx={{padding: 0}}>
          <AddNewUser/>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GameRoom;
