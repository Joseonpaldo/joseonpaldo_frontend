import {Box, Card, Divider, Grid, styled} from "@mui/material";
import {H3, H6, Small, Tiny} from "../Typography";
import React, {FC} from "react";

// component props interface
interface UserCardProps {
    user: {
        name: string;
        roomName: string;
        seedMoney: number;
        fullMember: number;
        currentMember: number;
        roomCode: string;
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


const UserCard: FC<UserCardProps> = ({user}) => {
    return (
        <Card onClick={() => {
            window.open(`/game/${user.roomCode}`, '_blank')
        }}>
            <ImageWrapper>
                {/*<img src={user.cover} width="100%" height="100%" alt={user.name}/>*/}

            </ImageWrapper>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: 5,
                }}
            >
                <H6>{user.roomName}</H6>
                <Tiny color="text.disabled" fontWeight={500}>
                    {user.name}
                </Tiny>


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
