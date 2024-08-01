'use client';

import type {User} from '@/types/user';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar-1.png',
  nickname: '민석이짱',
  email: 'sofia@devias.i₩~o',
} satisfies User;


export interface SignInWithOAuthParams {
  provider: 'google' | 'kakao' | 'naver';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}


class AuthClient {
  async signInWithOAuth(params: SignInWithOAuthParams): Promise<{ error?: string }> {



    return {error: 'Social authentication not implemented'};
  }

  //테스트 후 삭제
  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const {email, password} = params;
    if (email !== 'sofia@devias.io' || password !== 'Secret1') {
      return {error: 'Invalid credentials'};
    }
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);
    return {};
  }


  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return {data: null};
    }

    return {data: user};
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
