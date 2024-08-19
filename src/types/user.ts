export interface User {
  id: string;
  nickname?: string;
  avatar?: string;
  email?: string;


  [key: string]: unknown;
}
