"use client"

import * as React from 'react';
import {useEffect} from "react";
import apiAxiosInstance from "@/hooks/apiAxiosInstance";


export default function Page(): React.JSX.Element {
  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const accessToken = cookies.find(cookie => cookie.startsWith('accessToken='));
    const getUserData = () => {
      apiAxiosInstance.get('/user/data')
        .then(response => {
          console.log('User Data:', response.data);
          // 여기서 추가적인 데이터 처리 로직을 구현할 수 있습니다.
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
      });
    }

    if (accessToken) {
      const tokenValue = accessToken.split('=')[1];
      localStorage.setItem('custom-auth-token', tokenValue);
      console.log("access token is " + accessToken);

      // 사용자 데이터 요청
      getUserData();
    }
    location.href = '/';

  }, []);

  return (
    <div></div>
  );
}
