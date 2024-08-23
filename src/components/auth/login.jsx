"use client"; // 추가

import {Box, Button, Card, styled,} from "@mui/material";
import FlexBox from "/src/components/FlexBox";
import GoogleIcon from "/src/app/auth/sign-in/GoogleIcon.tsx";
import KakaoIcon from "/src/app/auth/sign-in/KakaoIcon.tsx";
import NaverIcon from "@/app/auth/sign-in/NaverIcon";


export default function Login() {
  const loginWithGoogle = () => {
    location.href = "/api/login/oauth2/google"
  }
  const loginWithNaver = () => {
    location.href = "/api/login/oauth2/naver"
  }
  const loginWithKakao = () => {
    location.href = "/api/login/oauth2/kakao"
  }

  return <FlexBox
    sx={{
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      height: {sm: "100%"},
    }}
  >
    <Card sx={{
      padding: 4, boxShadow: 1, width: "400px",
    }}>
      <FlexBox
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        mb={2}
      >
        <Box width={50}>
          <img src="/static/logo/logo.png" width="100%" alt="Uko Logo"/>
        </Box>
        <h1>조선팔도</h1>
      </FlexBox>

      <FlexBox alignItems="center" flexDirection="column" gap={2}>
        <SocialIconButton
          onClick={loginWithGoogle}
          startIcon={<GoogleIcon sx={{mr: 1}}/>}
        >
          Google
        </SocialIconButton>

        <SocialIconButton
          onClick={loginWithNaver}
          startIcon={<NaverIcon sx={{mr: 1}}/>}
        >
          NAVER
        </SocialIconButton>

        <SocialIconButton
          onClick={loginWithKakao}
          startIcon={<KakaoIcon sx={{mr: 1}}/>}
        >
          Kakao
        </SocialIconButton>

      </FlexBox>
    </Card>
  </FlexBox>
}

export const SocialIconButton = styled(Button)(({theme}) => ({
  width: "70%",
  height: 48,
  fontSize: 13,
  borderRadius: "6px",
  border: "1.5px solid #E5EAF2",
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
