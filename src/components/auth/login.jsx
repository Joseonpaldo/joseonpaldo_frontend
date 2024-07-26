"use client"; // 추가

import {Box, Button, Card, Divider, FormControlLabel, FormHelperText, styled, Switch,} from "@mui/material";
import FlexBox from "/src/components/FlexBox";
import GoogleIcon from "/src/app/auth/sign-in/GoogleIcon.tsx";
import FacebookIcon from "/src/app/auth/sign-in/FacebookIcon.tsx";


export default function Login() {

  return <FlexBox
    sx={{
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      height: {sm: "100%"},
    }}
  >
    <Card sx={{padding: 4, maxWidth: 500, boxShadow: 1, minWidth: 500,}}>
      <FlexBox
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        mb={5}
      >
        <Box width={50}>
          <img src="/static/logo/logo.png" width="100%" alt="Uko Logo"/>
        </Box>
        <h1>조선팔도</h1>
      </FlexBox>

      <FlexBox justifyContent="space-between" flexWrap="wrap" my="1rem">
        <SocialIconButton
          // onClick={loginWithGoogle}
          startIcon={<GoogleIcon sx={{mr: 1}}/>}
        >
          Google
        </SocialIconButton>
        <SocialIconButton
          // onClick={loginWithFacebook}
          startIcon={<FacebookIcon sx={{mr: 1}}/>}
        >
          Facebook
        </SocialIconButton>

      </FlexBox>
    </Card>
  </FlexBox>
}

export const SocialIconButton = styled(Button)(({theme}) => ({
  width: "48%",
  height: 48,
  fontSize: 13,
  borderRadius: "6px",
  border: "2px solid #E5EAF2",
  borderColor:
    theme.palette.mode === "light"
      ? theme.palette.text.secondary
      : theme.palette.divider,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginTop: "0.5rem",
  },
}));

export const TextFieldWrapper = styled(Box)(({theme}) => ({
  width: "48%",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginTop: "0.5rem",
  },
}));
