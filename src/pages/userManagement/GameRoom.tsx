import {Box, Button, Dialog, DialogContent, DialogTitle, Grid, styled} from "@mui/material";
import FlexBox from "components/FlexBox";
import UserCard from "components/userManagement/UserCard";
import useTitle from "hooks/useTitle";
import {FC, useState} from "react";
import AddNewUser from "./AddNewUser";

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

const GameRoom: FC = () => {
  // change navbar title
  useTitle("놀이방");

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box pt={2} pb={4}>
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
        <DialogTitle sx={{fontSize:"21px", padding: "20px 30px 0"}}>방 만들기</DialogTitle>
        <DialogContent sx={{padding: 0}}>
          <AddNewUser/>
        </DialogContent>

      </Dialog>
    </Box>
  );
};


// 방 정보 불러오는 api
const userList = [
  {
    cover: "/static/cover/cover-1.png",
    avatar: "/static/avatar/001-man.svg",
    name: "민석이짱",
    roomName: "초보만 들어오셈",
    seedMoney: 500,
    fullMember: 4,
    currentMember: 1,
    roomCode: "adsadvkjwi"
  },
  {
    cover: "/static/cover/cover-4.png",
    avatar: "/static/avatar/002-girl.svg",
    name: "짱짱맨",
    roomName: "고수만 와라",
    seedMoney: 1000,
    fullMember: 2,
    currentMember: 1,
    roomCode: "safasvasdnewo"
  },
  {
    cover: "/static/cover/cover-4.png",
    avatar: "/static/avatar/002-girl.svg",
    name: "짱짱맨",
    roomName: "고수만 와라",
    seedMoney: 1000,
    fullMember: 2,
    currentMember: 1,
    roomCode: "safasvasdnewo"
  },
  {
    cover: "/static/cover/cover-4.png",
    avatar: "/static/avatar/002-girl.svg",
    name: "짱짱맨",
    roomName: "고수만 와라",
    seedMoney: 1000,
    fullMember: 2,
    currentMember: 1,
    roomCode: "safasvasdnewo"
  },
  {
    cover: "/static/cover/cover-4.png",
    avatar: "/static/avatar/002-girl.svg",
    name: "짱짱맨",
    roomName: "고수만 와라",
    seedMoney: 1000,
    fullMember: 2,
    currentMember: 1,
    roomCode: "safasvasdnewo"
  },
  {
    cover: "/static/cover/cover-4.png",
    avatar: "/static/avatar/002-girl.svg",
    name: "짱짱맨",
    roomName: "고수만 와라",
    seedMoney: 1000,
    fullMember: 2,
    currentMember: 1,
    roomCode: "safasvasdnewo"
  },
  {
    cover: "/static/cover/cover-4.png",
    avatar: "/static/avatar/002-girl.svg",
    name: "짱짱맨",
    roomName: "고수만 와라",
    seedMoney: 1000,
    fullMember: 2,
    currentMember: 1,
    roomCode: "safasvasdnewo"
  },
  {
    cover: "/static/cover/cover-4.png",
    avatar: "/static/avatar/002-girl.svg",
    name: "짱짱맨",
    roomName: "고수만 와라",
    seedMoney: 1000,
    fullMember: 2,
    currentMember: 1,
    roomCode: "safasvasdnewo"
  },
];

export default GameRoom;
