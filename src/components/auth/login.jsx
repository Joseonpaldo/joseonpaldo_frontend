"use client"; // 추가

import {Box, Button, Card, Divider, FormControlLabel, FormHelperText, styled, Switch,} from "@mui/material";
import FlexBox from "/src/components/FlexBox";
import GoogleIcon from "/src/app/auth/sign-in/GoogleIcon.tsx";
import FacebookIcon from "/src/app/auth/sign-in/FacebookIcon.tsx";


export default function Login() {
  const redirectUri="http://localhost:8080/login/oauth2/code";
  const googleClientId=process.env.GOOGLE_CLIENT_ID;
  const kakaoRestApiKey=process.env.KAKAO_RESTAPI_KEY;
  const naverClientId=process.env.NAVER_CLIENT_ID;
  const state = Math.random().toString(36).substr(2);

  let googleUrl=`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}/google&response_type=code&scope=email profile&state=${state}`;
  let kakaoUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoRestApiKey}/kakao&redirect_uri=${redirectUri}`;
  let naverUrl=`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}/naver&redirect_uri=${redirectUri}&state=${state}`;

  const loginWithSocial=(social)=>{
    switch (social){
      case "google":{
        window.location.href=googleUrl;
        break
      }
      case "kakao":{
        window.location.href=kakaoUrl;
        break
      }
      case "naver":{
        window.location.href=naverUrl;
        break
      }
    }
  }

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
          onClick={()=>loginWithSocial("google")}
          startIcon={<GoogleIcon sx={{mr: 1}}/>}
        >
          Google
        </SocialIconButton>
        <SocialIconButton
          onClick={()=>loginWithSocial("kakao")}
        >
          Kakao
        </SocialIconButton>
        <SocialIconButton
          onClick={()=>loginWithSocial("naver")}
        >
          Naver
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
