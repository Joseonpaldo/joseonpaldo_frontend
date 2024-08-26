"use client"

import * as React from 'react';
import {useEffect} from "react";
import axios from "axios";


export default function Page(): React.JSX.Element {
  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const accessToken = cookies.find(cookie => cookie.startsWith('accessToken='));

    if (accessToken) {
      const tokenValue = accessToken.split('=')[1];
      localStorage.setItem('custom-auth-token', tokenValue);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + tokenValue;

      // 사용자 데이터 요청
      axios.get('api/user/data')
        .then(response => {
          console.log('User Data:', response.data);
          // 여기서 추가적인 데이터 처리 로직을 구현할 수 있습니다.
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
    location.href = '/';

  }, []);

  return (
    <div></div>
  );
}
