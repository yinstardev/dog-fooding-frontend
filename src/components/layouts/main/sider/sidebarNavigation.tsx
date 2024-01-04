import React from 'react';
import {
  CompassOutlined,
  DashboardOutlined,
  FormOutlined,
  HomeOutlined,
  LayoutOutlined,
  LineChartOutlined,
  TableOutlined,
  UserOutlined,
  BlockOutlined,
} from '@ant-design/icons';
import { ReactComponent as NftIcon } from '@app/assets/icons/nft-icon.svg';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'Home',
    key: 'home-page',
    // TODO use path variable
    url: '/',
  },
  {
    title: 'Support Central',
    key: 'support-central',
    // TODO use path variable
    url: '/support-central',
  },
  {
    title: 'Champagne',
    key: 'champagne',
    // TODO use path variable
    url: '/champagne',
  },
];
