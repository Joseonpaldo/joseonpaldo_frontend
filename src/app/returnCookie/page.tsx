"use client"

import * as React from 'react';
import {useEffect} from "react";


export default function Page(): React.JSX.Element {
  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const accessToken = cookies.find(cookie => cookie.startsWith('accessToken='));

    if (accessToken) {
      const tokenValue = accessToken.split('=')[1];
      localStorage.setItem('custom-auth-token', tokenValue);
    }
    location.href = '/';

  }, []);

  return (
    <div></div>
  );
}
