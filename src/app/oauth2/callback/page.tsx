'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const Callback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // JWT와 제공자 정보를 로컬 스토리지에 저장
      localStorage.setItem('custom-auth-token', token);

      // 홈 페이지로 리다이렉트
      router.push('/');
    } else {
      console.error('No token or provider found in the URL');
    }
  }, [token, router]);

  return <div>Processing login...</div>;
};

export default Callback;