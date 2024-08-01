import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'ranking', title: 'Ranking', href: paths.dashboard.ranking, icon: 'ranking' },
  { key: 'game-room', title: 'GameRoom', href: paths.dashboard.gameroom, icon: 'game-controller' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
