export interface User {
  id: number;
  nickname?: string;
  avatar?: string;
  email?: string;
  socialProvider?: string
  tot_2p?: number
  tot_4p?: number
  win_2p?: number
  win_4p?: number

  [key: string]: unknown;
}
