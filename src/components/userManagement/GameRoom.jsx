"use client";

import {Box, Button, Dialog, DialogContent, DialogTitle, Grid, styled} from "@mui/material";
import FlexBox from "../FlexBox";
import UserCard from "./UserCard";
import * as React from "react";
import {useEffect, useState} from "react";
import AddNewUser from "./AddNewUser";
import apiAxiosInstance from "@/hooks/apiAxiosInstance";
import {usePathname, useRouter} from "next/navigation";
import SearchInput from "@/components/SearchInput";
import Typography from "@mui/material/Typography";
import {light} from "@mui/material/styles/createPalette";


// styled component
const StyledFlexBox = styled(FlexBox)(({theme}) => ({
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  [theme.breakpoints.down(500)]: {
    width: "100%",
    "& .MuiInputBase-root": {maxWidth: "100%"},
    "& .MuiButton-root": {
      width: "100%",
    },
  },
}));


const GameRoom = () => {
  const [open, setOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [apiURL, setApiURL] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [btnVariant, setBtnVariant] = useState("outlined"); //contained
  const [roomStatus, setRoomStatus] = useState(true); //contained

  const router = useRouter();

// 경로가 변경될 때 apiURL을 업데이트
  useEffect(() => {
    if (roomStatus) {
      setApiURL('/game/room/ready');
    } else {
      setApiURL('/game/room/start');
    }
  }, [roomStatus]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const playingRoomShow = () => {
    if (roomStatus) {
      setRoomStatus(false);
      setBtnVariant("contained");
    } else {
      setRoomStatus(true);
      setBtnVariant("outlined");
    }

  }

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
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <Typography variant="h4">놀이방</Typography>
        <StyledFlexBox style={{display: "flex", justifyContent: "space-between", flexWrap: "nowrap", flexDirection: "row"}}>
          <Button variant={btnVariant} onClick={playingRoomShow}
                  sx={{width: "110px", marginRight: "20px"}}>진행 중</Button>
          <SearchInput placeholder="검색어를 입력하세요" onChange={(e) => setSearchKeyword(e.target.value)}/>
        </StyledFlexBox>
      </div>
      <Button fullWidth={true} variant="contained" onClick={handleClickOpen} sx={{marginY: 2}}>
        방 만들기
      </Button>
      <Grid container spacing={3}>
        {
          userList.filter((e) => {
            return e.name.toLowerCase().includes(searchKeyword.toLowerCase()) || e.roomName.toLowerCase().includes(searchKeyword.toLowerCase());
          }).map((user, index) => (
            <Grid item md={4} sm={6} xs={12} key={index}>
              <UserCard user={user} roomStatus={roomStatus}/>
            </Grid>
          ))
        }
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
