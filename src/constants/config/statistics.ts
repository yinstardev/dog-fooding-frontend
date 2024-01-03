import { FC } from 'react';
import { ReactComponent as BonesIcon } from '@app/assets/icons/bones.svg';
import { ReactComponent as FatIcon } from '@app/assets/icons/fat.svg';
import { ReactComponent as ProteinIcon } from '@app/assets/icons/protein.svg';
import { ReactComponent as WaterBalanceIcon } from '@app/assets/icons/water.svg';
import { ReactComponent as P0Icon } from '@app/assets/icons/p0-jira.svg';
import { ReactComponent as P1Icon } from '@app/assets/icons/P1-jira.svg';
import { ReactComponent as P2Icon } from '@app/assets/icons/p2-jira.svg';

export type StatisticColor = 'primary' | 'error' | 'secondary' | 'success';

interface ConfigStatistic {
  id: number;
  name: string;
  title: string;
  color: StatisticColor;
  Icon: FC;
}

export const statistics: ConfigStatistic[] = [
  {
    id: 1,
    name: 'P0',
    title: 'P0 Backlog',
    color: 'success',
    Icon: P0Icon,
  },
  {
    id: 2,
    name: 'P1',
    title: 'P1 Backlog',
    color: 'error',
    Icon: P1Icon,
  },
  {
    id: 3,
    name: 'P2',
    title: 'P2 Backlog',
    color: 'primary',
    Icon: P2Icon,
  },
];
