import type {User} from '@/types/user';
import apiAxiosInstance from "@/hooks/apiAxiosInstance";


const user = {
  id: 0,
  avatar: 'none',
  nickname: 'none',
  email: 'none',
  socialProvider: "none",
  tot_2p: 0,
  tot_4p: 0,
  win_2p: 0,
  win_4p: 0,
} satisfies User;

async function getUserData() {
  let jwt = localStorage.getItem('custom-auth-token');
  console.log("jwt : " + jwt)
  if (jwt == null){
    return null;
  }
  const response = await apiAxiosInstance.get(`/user/${jwt}`);
  console.log(response);
  return response.data; // 응답 데이터 반환
}

class AuthClient {
  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request
    let userData = await getUserData()
    if (userData != null) {
      user.id = userData.user_id;
      user.avatar = userData.profilePicture;
      user.email = userData.email;
      user.nickname = userData.nickname;
      user.tot_2p = userData.tot_2p;
      user.tot_4p = userData.tot_4p;
      user.win_2p = userData.win_2p;
      user.win_4p = userData.win_4p;
    }


    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token || user.id == null) {
      return {data: null};
    }

    return {data: user};
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    document.cookie = "accessToken" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = "refreshToken" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    window.location.reload();

    return {};
  }
}

export const authClient = new AuthClient();
