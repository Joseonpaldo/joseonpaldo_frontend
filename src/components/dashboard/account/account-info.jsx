"use client"

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import axios from 'axios';

async function getUserData(jwt) {
  try {
    const response = await axios.get(`/api/user/${jwt}`);
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
    throw error; // 오류를 다시 던져서 호출자에게 알림
  }
}

export default function AccountInfo() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('custom-auth-token');
    if (jwt) {
      getUserData(jwt)
        .then(data => setUserData(data))
        .catch(error => console.error('사용자 데이터 로드 실패:', error));
    }
  }, []);

  if (!userData) {
    return <div>로딩 중...</div>; // 데이터 로드 중 표시할 내용
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={userData.profilePicture} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{userData.nickname}</Typography>
            <Typography color="text.secondary" variant="body2">
              2인 승률
            </Typography>
            <Typography color="text.secondary" variant="h6">
              {userData.tot_2p}판 {userData.win_2p}승
            </Typography>
            <Divider />
            <Typography color="text.secondary" variant="body2">
              4인 승률
            </Typography>
            <Typography color="text.secondary" variant="h6">
              {userData.tot_4p}판 {userData.win_4p}승
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
