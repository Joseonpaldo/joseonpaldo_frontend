import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { Ranking } from '@phosphor-icons/react/dist/ssr/Ranking';
import { GameController } from '@phosphor-icons/react/dist/ssr/GameController';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  // 'chart-pie': ChartPieIcon,
  // 'gear-six': GearSixIcon,
  'ranking': Ranking,
  // 'x-square': XSquare,
  'game-controller': GameController,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
