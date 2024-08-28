import {Box, Card, Divider, Grid, styled} from "@mui/material";
import {H3, H5, Small, Tiny} from "../Typography";
import React, {FC} from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

// component props interface
interface UserCardProps {
    user: {
        name: string;
        roomName: string;
        seedMoney: number;
        fullMember: number;
        currentMember: number;
        roomCode: string;
        cover: string;
    };
}

// styled components
const ImageWrapper = styled(Box)(({theme}) => ({
    height: 100,
    position: "relative",
    "&::before": {
        content: '""',
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        position: "absolute",
        opacity: 0.6,
        backgroundColor: theme.palette.primary.light,
    },
}));

const StyledAvatar = styled(Avatar)(({theme}) => ({
  zIndex: 1,
  width: 50,
  height: 50,
  bottom: -25,
  position: "absolute",
  left: "50%",
  right: "50%",
  transform: "translateX(-50%)",
  border: "2px solid",
  borderRadius: "50%",
  borderColor: theme.palette.background.paper,
}));


const UserCard: FC<UserCardProps> = ({user}) => {
    return (
        <Card onClick={() => {
            window.open(`/lobby/${user.roomCode}`, '_blank')
        }}>
            <ImageWrapper>
              <Typography sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "100%",
                textAlign: "center",
                transform: "translate(-50%, -50%)",
              }}>
                {user.roomName}
              </Typography>
              <StyledAvatar src={user.cover} alt={user.name}/>
            </ImageWrapper>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: 5,
                }}
            >
                <H5><span style={{fontWeight: "bolder"}}>{user.name}</span>님의 방</H5>


            </Box>

            <Divider sx={{my: 2}}/>

            <Grid container spacing={3} mb={2}>
                <Grid item xs={6} textAlign="center">
                    <H3>{user.currentMember}/{user.fullMember}</H3>
                    <Small color="text.disabled">인원 수</Small>
                </Grid>
                {/*<Grid item xs={4} textAlign="center">*/}
                {/*  <H3>{user.follower}</H3>*/}
                {/*  <Small color="text.disabled">Followers</Small>*/}
                {/*</Grid>*/}
                <Grid item xs={6} textAlign="center">
                    <H3>{user.seedMoney}</H3>
                    <Small color="text.disabled">시드머니</Small>
                </Grid>
            </Grid>
        </Card>
    );
};

export default UserCard;
